import "dotenv/config";
import { JsonRpcProvider, formatEther, getAddress } from "ethers";
import prisma from "../backend/src/lib/prisma.js";

const rpcUrl = process.env.ETH_RPC_URL;

if (!rpcUrl) {
  throw new Error("ETH_RPC_URL is missing from .env");
}

const provider = new JsonRpcProvider(rpcUrl);

async function main() {
  // 1. Get the interested addresses from DB
  const users = await prisma.binanceUsers.findMany({
    select: {
      id: true,
      depositAddress: true,
    },
  });

  if (users.length === 0) {
    console.log("No deposit addresses found.");
    return;
  }

  const usersByAddress = new Map(
    users.map((user) => [getAddress(user.depositAddress), user.id]),
  );

  // 2. Inspect the latest block's native ETH transactions
  const blockNumber = await provider.getBlockNumber();
  const block = await provider.getBlock(blockNumber, true);

  if (!block) {
    throw new Error(`Block ${blockNumber} not found`);
  }

  for (const tx of block.prefetchedTransactions) {
    if (!tx.to) continue;

    const userId = usersByAddress.get(getAddress(tx.to));

    if (userId === undefined) continue;

    console.log({
      blockNumber,
      userId,
      txHash: tx.hash,
      valueETH: formatEther(tx.value),
    });
  }

  // 3. Update each user's current on-chain ETH balance
  for (const user of users) {
    const address = getAddress(user.depositAddress);
    const balanceWei = await provider.getBalance(address);
    const balanceETH = formatEther(balanceWei);

    await prisma.binanceUsers.update({
      where: { id: user.id },
      data: { balance: balanceETH },
    });

    console.log(`User ${user.id}: ${balanceETH} ETH`);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
