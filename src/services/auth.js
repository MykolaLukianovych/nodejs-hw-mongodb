import createHttpError from 'http-errors';
import User from '../db/models/User.js';
import Session from '../db/models/Session.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/auth.js';

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
  Session.deleteOne({ _id: sessionId });
};
