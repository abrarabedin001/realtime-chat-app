import { Request, Response, RequestHandler } from 'express';

import bcrypt from 'bcrypt';
import User from '../models/user.models';
import { generateToken } from '../lib/utils';
export const signup: RequestHandler = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);
      return res.status(201).json({ _id: newUser._id, fullName: newUser.fullName, email: newUser.email });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const login: RequestHandler = async (req: Request, res: Response) => {
  res.send("login route");
}

export const logout: RequestHandler = async (req: Request, res: Response) => {
  res.send("logout route");
}