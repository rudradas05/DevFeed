import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =========================
   🔐 REGISTER
========================= */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 🛑 basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔍 check existing user
    const existing = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)));

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔐 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧾 insert user
    const newUser = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
      })
      .returning();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser[0].id,
        username: newUser[0].username,
        email: newUser[0].email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR 👉", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* =========================
   🔐 LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🛑 validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔍 find user
    const result = await db.select().from(users).where(eq(users.email, email));

    const user = result[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔐 compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🎟️ create token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 🍪 set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // 👉 true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR 👉", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* =========================
   🔐 LOGOUT
========================= */
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const me = async (req, res) => {
  try {
    const userId = req.user && req.user.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await db.select().from(users).where(eq(users.id, userId));

    const user = result[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("ME ERROR 👉", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
