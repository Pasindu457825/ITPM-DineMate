const express = require("express");
const { registerUser, getUsers } = require("../controllers/pasindu/userController");

const router = express.Router(); // ✅ Define it only once

router.post("/register", registerUser);
router.get("/", getUsers);

module.exports = router; // ✅ Export only once
