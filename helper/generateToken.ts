import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const generateToken = (nvId : Number, res: Response) => {
  const token = jwt.sign({ nvId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, 
  });

  return token;
};