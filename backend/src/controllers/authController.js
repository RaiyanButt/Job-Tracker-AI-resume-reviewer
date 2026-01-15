import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function createToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
    });

    const token = createToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
 export async function logout(req, res) {
  res.clearCookie("token");
  return res.json({ message: "Logged out" });
}

export async function me(req, res) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Not logged in" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select("_id name email");
    if (!user) return res.status(401).json({ message: "Not logged in" });

    return res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch {
    return res.status(401).json({ message: "Not logged in" });
  }
}
