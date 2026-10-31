import "dotenv/config";

import express from "express";
import bcrypt from "bcrypt";
import { HDNodeWallet } from "ethers";
import { mnemonicToSeedSync } from "bip39";
import prisma from "./lib/prisma.js";
import config from "./config.js";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Express + Prisma + PostgreSQL is working",
  });
});

const seed = mnemonicToSeedSync(config.MNEMONICS);
// Signup

app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "password is required",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const usercreated = await prisma.binanceUsers.create({
      data: {
        username,
        password: hashedPassword,
        depositAddress: "..",
        privateKey: "...",
        balance: "0",
      },
    });

    const derivationPath = `m/44'/60'/0'/0/${usercreated.id}`;
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(derivationPath);

    const updatedUser = await prisma.binanceUsers.update({
      where: {
        id: usercreated.id,
      },
      data: {
        depositAddress: child.address,
        privateKey: child.privateKey,
      },
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        depositAddress: updatedUser.depositAddress,
        balance: updatedUser.balance,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Get deposit address
app.get("/depositAddress/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (Number.isNaN(userId)) {
      return res.status(400).json({
        message: "Invalid userId",
      });
    }

    const user = await prisma.binanceUsers.findUnique({
      where: {
        id: userId,
      },
      select: {
        depositAddress: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      depositAddress: user.depositAddress,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
