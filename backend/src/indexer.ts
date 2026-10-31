import "dotenv/config";
import { JsonRpcProvider, formatEther, getAddress } from "ethers";
import prisma from "./lib/prisma.js";

const rpcUrl = process.env.ETH_RPC_URL;

if (!rpcUrl) {
  throw new Error("ETH_RPC_URL is missing from .env");
}

const provider = new JsonRpcProvider(rpcUrl);

async function main() {
  console.log("Starting Ethereum indexer...");

  // 1. Fetch deposit addresses from the database
  const users = await prisma.binanceUsers.findMany({
    select: {
      id: true,
      depositAddress: true,
    },
  });

  console.log(`Found ${users.length} deposit addresses`);

  if (users.length === 0) return;

  const usersByAddress = new Map<string, number>();

  for (const user of users) {
    try {
      usersByAddress.set(getAddress(user.depositAddress), user.id);
    } catch {
      console.warn(`Invalid address for user ${user.id}`);
    }
  }

  // 2. Fetch the latest block with full transaction objects
  const blockNumber = await provider.getBlockNumber();
  const block = await provider.getBlock(blockNumber, true);

  if (!block) {
    throw new Error(`Block ${blockNumber} not found`);
  }

  console.log(`Scanning block ${blockNumber}`);

  for (const tx of block.prefetchedTransactions) {
    if (!tx.to) continue;

    let recipient: string;

    try {
      recipient = getAddress(tx.to);
    } catch {
      continue;
    }

    const userId = usersByAddress.get(recipient);

    if (userId === undefined) continue;

    console.log("Incoming ETH transaction:", {
      userId,
      txHash: tx.hash,
      valueETH: formatEther(tx.value),
    });
  }

  // 3. Synchronize current on-chain balances
  for (const user of users) {
    let address: string;

    try {
      address = getAddress(user.depositAddress);
    } catch {
      continue;
    }

    const balanceWei = await provider.getBalance(address);
    const balanceETH = formatEther(balanceWei);

    await prisma.binanceUsers.update({
      where: { id: user.id },
      data: { balance: balanceETH },
    });

    console.log(`User ${user.id}: ${balanceETH} ETH`);
  }

  console.log("Indexer run completed.");
}

main()
  .catch((error) => {
    console.error("Indexer failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
