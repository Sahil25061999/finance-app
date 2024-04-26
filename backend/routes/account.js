const zod = require("zod");
const mongoose = require("mongoose");
const { Account, User } = require("../db");
const { authMiddleware } = require("../middleware");

const router = require("express").Router();

const transferValidator = zod.object({
  to: zod.string().email(),
  amount: zod.number(),
});

router.get("/balance", authMiddleware, async (req, res) => {
  const userId = req.headers.userId;
  const balance = await Account.findOne({ userId });
  res.status(200).json({
    success: true,
    data: {
      balance: balance.balance,
    },
  });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userId = req.headers.userId;
    const { success } = transferValidator.safeParse(req.body);
    if (!success) {
      await session.abortTransaction();
      return res.status(422).json({
        success: false,
        message: "Unable to transfer funds, recheck parameters",
      });
    }
    const { to, amount } = req.body;
    const receiverUser = await User.findOne({ username: to });
    if (!receiverUser) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userAccount = await Account.findOne({ userId });
    if (
      !userAccount ||
      userAccount.balance <= 0 ||
      amount > userAccount.balance
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }
    const receiverAccount = await Account.findOne({ userId: receiverUser._id });
    if (!receiverAccount) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Invalid account",
      });
    }
    userAccount.balance -= amount;

    receiverAccount.balance += amount;
    await userAccount.save();
    await receiverAccount.save();
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message:"transfer successfull",
      data: {
        balance: userAccount.balance,
      },
    });
  } catch (e) {
    await session.abortTransaction();
    res.status(422).json({
      success: false,
      message: e.message,
      data: {
        balance: userAccount.balance,
      },
    });
  }
});

module.exports = router;
