import { Router } from "express";
import {
  hashPassword,
  compare_hashed_passwords,
} from "../authentication/hash.js";
import { createToken } from "../authentication/tokens.js";
import { DataTypes } from "sequelize";
import { sequelize } from "../authentication/conn.js";

// --------------------------------- Start Model --------------------------------- //
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
// --------------------------------- End Model --------------------------------- //

// --------------------------------- Start Router --------------------------------- //
const router = Router();
router.post("/register", register);
router.post("/login", login);
export { User, router as authRoutes };
// --------------------------------- End Router --------------------------------- //

// --------------------------------- Start Users --------------------------------- //
export async function register(req, res) {
  try {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ where: { username } });
    if (foundUser) {
      return res.json({ message: "This user is already registered!" });
    }
    const hashedPassword = await hashPassword(password);
    await User.create({ username, password: hashedPassword });
    res.json({ message: "Registered successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    const registeredUser = await User.findOne({ where: { username } });
    if (!registeredUser) {
      return res.json({ message: "Invalid Credentials!" });
    }
    const is_matched = await compare_hashed_passwords(
      password,
      registeredUser.password
    );
    if (!is_matched) {
      return res.json({ message: "Invalid Credentials!" });
    }
    const token = createToken(registeredUser.id, username);
    res.json({ message: "Logged in successfully!", token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error!!" });
  }
}
// --------------------------------- End Users --------------------------------- //
