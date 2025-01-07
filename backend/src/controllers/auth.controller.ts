
import { Request, Response, RequestHandler } from 'express';

import bcrypt from 'bcrypt';
import User from '../models/user.models';
import { generateToken } from '../lib/utils';
import cloudinary from '../lib/cloudinary';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
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

  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(user._id, res);
    return res.status(200).json({ _id: user._id, fullName: user.fullName, email: user.email, profilePic: user.profilePic });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }

}

export const logout: RequestHandler = async (req: Request, res: Response) => {
  res.send("logout route");

  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {

  }
}

export const updateProfile: RequestHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: "Please upload a profile picture" });
    }

    const updateProfile = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: updateProfile.secure_url }, { new: true });
    res.status(200).json(updatedUser);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const checkAuth: RequestHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
  
    return res.status(200).json(req.user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}