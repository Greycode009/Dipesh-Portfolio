import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { AppError } from '@/shared/errors/AppError';
import { Admin } from './admin.model';

const SALT_ROUNDS = 12;

export const hashPassword = (password: string) =>
  bcrypt.hash(password, SALT_ROUNDS);

function signToken(admin: Admin): string {
  return jwt.sign({ sub: admin.id, email: admin.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
}

export async function login(email: string, password: string) {
  const admin = await Admin.findOne({ where: { email } });

  // Hash even when the account is missing, so a wrong email and a wrong
  // password take the same time to answer.
  const hash = admin?.passwordHash ?? (await hashPassword('no-such-account'));
  const matches = await bcrypt.compare(password, hash);

  if (!admin || !matches) {
    throw AppError.unauthorized('Incorrect email or password');
  }

  await admin.update({ lastLoginAt: new Date() });
  return { token: signToken(admin), admin: admin.toJSON() };
}

export async function changePassword(
  adminId: number,
  currentPassword: string,
  newPassword: string,
) {
  const admin = await Admin.findByPk(adminId);
  if (!admin) throw AppError.unauthorized();

  if (!(await bcrypt.compare(currentPassword, admin.passwordHash))) {
    throw AppError.unauthorized('Current password is incorrect');
  }

  await admin.update({ passwordHash: await hashPassword(newPassword) });
}
