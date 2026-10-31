import "dotenv/config";

const MNEMONICS = process.env.MNEMONICS;

if (!MNEMONICS) {
  throw new Error("MNEMONICS is missing from .env");
}

export default {
  MNEMONICS,
};
