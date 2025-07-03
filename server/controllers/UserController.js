import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import tryCatch from '../utils/tryCatch.js';
import AppError from '../utils/appErorr.js';

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

// Register user
export const register = tryCatch(async (req, res, next) => {
  const { username, password, email, fullName, role } = req.body;

  if (!username || !password || !email || !fullName) {
    return next(new AppError('All fields (username, password, email, fullName) are required', 400));
  }

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    return next(new AppError('Username already exists', 409));
  }

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    return next(new AppError('Email already exists', 409));
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    username,
    password: hashedPassword,
    email,
    fullName,
    role: role || 'client',
  });

  const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, jwtSecret, { expiresIn: '1d' });

  res.status(201).json({ user, token });
});

// Login user
export const login = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return next(new AppError('Invalid credentials', 401));
  }

  const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, jwtSecret, { expiresIn: '1d' });

  res.json({ user, token });
});

// Get all users
export const getAllUsers = tryCatch(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// Get user by ID
export const getUserById = tryCatch(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.json(user);
});

// Update user
export const updateUser = tryCatch(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const { password, ...rest } = req.body;

  if (password) {
    rest.password = await bcrypt.hash(password, saltRounds);
  }

  await user.update(rest);

  res.json(user);
});

// Delete user
export const deleteUser = tryCatch(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  await user.destroy();

  res.json({ message: 'User deleted' });
});
