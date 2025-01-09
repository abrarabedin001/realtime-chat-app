import jwt from 'jsonwebtoken';
import User from '../models/user.models';
import { NextFunction, Request, Response } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any;
}


export const protectRoute = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { userId: string };
    if (!decoded) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}