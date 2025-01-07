import { Request, Response } from 'express';
export const signup = async (req: Request, res: Response) => {
  res.send("Signup route");
}

export const login = async (req: Request, res: Response) => {
  res.send("login route");
}

export const logout = async (req: Request, res: Response) => {
  res.send("logout route");
}