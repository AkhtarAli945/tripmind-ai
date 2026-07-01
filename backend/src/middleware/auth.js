import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createError } from '../utils/errors.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return next(createError(401, 'Not authorized'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return next(createError(401, 'User not found'));
    next();
  } catch (error) {
    next(createError(401, 'Token invalid'));
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return next(createError(403, 'Admin access required'));
  next();
};
