const users = require("../models/userModels");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

// create token function
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_TOKEN, {
    expiresIn: "3d",
  });
};

// description signup new user
// route POST /kazodo-health/signup
const signUp = expressAsyncHandler(async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  //check input fields
  if (!firstName || !lastName || !email || !phoneNumber || !password) {
    res.status(400).send({ error: "Please add all fields" });
    // throw new Error("Please add all fields");
  }
  // validation
  if (!validator.isEmail(email)) {
    res.status(400).json({ error: "Email is not valid" });
  }
  if (!validator.isStrongPassword(password)) {
    res.status(400).json({
      error:
        "Password not strong enough, use Capital letter, small alphabet, number and symbols up to 10 characters",
    });
  }

  //   check if user exists
  const userExists = await users.findOne({ email });

  if (userExists) {
    res.status(400).json({ error: "User already exists, use new email" });
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  //   create token
  // create user
  if (
    validator.isEmail(email) &&
    validator.isStrongPassword(password) &&
    !userExists
  ) {
    const user = await users.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hash,
    });
    const token = createToken(user.id);
    if (user) {
      res.status(200).json({
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        token,
        firstName,
        fullName: `${user.firstName} ${user.lastName}`,
      });
    }
  }
});

// description signup new user
// route POST /kazodo-health/login
const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //check fields
  if (!email || !password) {
    res.status(400).json({ error: "Please add all fields" });
  }

  //verify email exits
  const userExists = await users.findOne({ email });

  //  generate token
  const token = createToken(userExists.id);

  if (!userExists) {
    res.status(400).json({ error: "sorry, user not found" });
  }

  //verify email exits & password
  const comparePassword = await bcrypt.compare(password, userExists.password);
  if (!comparePassword) {
    res.status(400).json({ error: "Invalid Password" });
  } else if (userExists && comparePassword) {
    res.status(200).json({
      name: `${userExists.firstName} ${userExists.lastName}`,
      email: userExists.email,
      phoneNumber: userExists.phoneNumber,
      token,
      firstName: userExists.firstName,
    });
  }
});

// description signup new user
// route GET /kazodo-health/my-account
const getMe = async (req, res) => {
  const { firstName, lastName, phoneNumber, email } = await users.findOne(
    req.user._id
  );

  res.json({
    fullName: `${firstName} ${lastName}`,
    email,
    phoneNumber,
  });
};

module.exports = {
  login,
  signUp,
  getMe,
};
