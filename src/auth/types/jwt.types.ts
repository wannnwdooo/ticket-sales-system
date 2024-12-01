import { Role } from '../enums';

export type JwtPayload = {
  email: string;
  id: string;
  role?: Role;
  iat?: number;
  exp?: number;
};

export type JwtPayloadWithRt = {
  refreshToken: string;
} & JwtPayload;
