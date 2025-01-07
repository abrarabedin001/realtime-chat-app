import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
export const generateToken = (userId: Types.ObjectId, res: Response) => {

  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true, // prevents client side JS from reading the cookie, prevents XSS attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // in miliseconds, 7 days
    sameSite: 'strict', // cookie will only be sent in a first-party context
    secure: process.env.NODE_ENV != 'development', // cookie will only be sent in https
  });

  return token;

};