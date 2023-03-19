const express = require("express");
const { login, signUp, getMe } = require("../controllers/userControllers");
const protect = require("../middleware/authMiddleware");
// const protect = require("../middleware/authMiddleware");
const router = express.Router();


router.post("/signup", signUp);
router.post("/login", login);
router.get("/my-account",protect, getMe);

module.exports = router;
