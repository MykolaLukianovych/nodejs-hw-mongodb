import createHttpError from 'http-errors';
import User from '../db/models/User.js';
import Session from '../db/models/Session.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/auth.js';
import sendMail from '../utils/sendMail.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = Date.now() + accessTokenLifeTime;
  const refreshTokenValidUntil = Date.now() + refreshTokenLifeTime;

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const findSession = (query) => Session.findOne(query);

export const findUser = (query) => Session.findOne(query);

export const registerUser = async (payload) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPasword = await bcrypt.hash(password, 10);

  return await User.create({ ...payload, password: hashPasword });
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await Session.findOneAndDelete({ userId: user._id });

  const session = createSession();

  return Session.create({
    userId: user._id,
    ...session,
  });
};

export const refreshUser = async ({ refreshToken }) => {
  const session = await findSession({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  if (session.refreshTokenValidUntil < Date.now()) {
    await Session.findOneAndDelete({ _id: session._id });
    throw createHttpError(401, 'Session token espired');
  }

  await Session.findOneAndDelete({ _id: session._id });

  const newSession = createSession();

  return Session.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    const html = `
      <h2>Reset your password</h2>
      <p>Click the link below to reset your password. This link is valid for 5 minutes.</p>
      <a href="${resetLink}">${resetLink}</a>
    `;

    await sendMail(email, 'Reset your password', html);
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.token = null;
    await user.save();
  } catch (err) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }
};
