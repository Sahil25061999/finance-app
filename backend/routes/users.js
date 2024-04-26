const router = require("express").Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");

const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const signupValidation = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
  username: zod.string().email(),
  password: zod.string(),
});

const signinValidation = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

const updateUserValidation = zod.object({
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  password: zod.string().optional(),
});

function validateUser(req, res, next) {
  const body = req.body;
  const validationRes = signupValidation.safeParse(body);
  if (validationRes.success) {
    next();
  } else {
    next(validationRes.error);
  }
}

router.post("/signup", validateUser, async function (req, res) {
  try {
    const { username, firstName, lastName, password } = req.body;
    const userExist = await User.findOne({ username });

    if (userExist) {
      return res.status(422).json({
        success: false,
        message: "Email already exist",
      });
    }

    const newUser = new User({
      username,
      firstName,
      lastName,
      password,
    });
    await newUser.save();

    await Account.create({
      userId: newUser._id,
      balance: 1 + Math.random() * 10000,
    });

    const token = jwt.sign({ id: newUser._id, username: username }, JWT_SECRET);

    res.status(200).json({
      success: true,
      message: "signed up successfully",
      data: {
        token,
      },
    });
  } catch (e) {
    console.log("CATCH", e);
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
});

router.post("/signin", async function (req, res) {
  try {
    const { success, error } = signinValidation.safeParse(req.body);

    if (!success) {
      return res.status(422).json({
        success: false,
        message: error,
      });
    }

    const { username, password } = req.body;
    const userExist = await User.findOne({ username, password });

    if (!userExist) {
      return res.status(422).json({
        success: false,
        message: "User details not found",
      });
    }

    const token = jwt.sign(
      { id: userExist._id, username: username },
      JWT_SECRET
    );

    res.status(200).json({
      success: true,
      message: "signed in successfully",
      data: {
        token,
      },
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
});

router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { success } = updateUserValidation.safeParse(req.body);
    if (!success) {
      res.status(422).json({
        success: false,
        message: "Unable to update profile",
      });
    }
    const { userId } = req.headers;
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { ...req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      data: user,
    });
  } catch (e) {
    res.status(422).json({
      success: false,
      message: e.message,
    });
  }
});

router.get("/bulk", authMiddleware, async (req, res) => {
  try {
    const filter = req.query.filter || "";
    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
          },
        },
        {
          lastName: {
            $regex: filter,
          },
        },
      ],
    });
    res.status(200).json({
      success: true,
      message: "Users retreived successfully",
      data: users,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
});

module.exports = router;
