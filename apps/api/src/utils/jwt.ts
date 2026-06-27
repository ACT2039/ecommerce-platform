import jwt from 'jsonwebtoken';

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET must be defined in environment variables');
  }
  return secret;
};

export const signToken = (payload: object, expiresIn?: string | number): string => {
  const secret = getSecret();
  const options: jwt.SignOptions = {};
  
  if (expiresIn) {
    options.expiresIn = expiresIn as any;
  } else if (process.env.JWT_EXPIRES_IN) {
    options.expiresIn = process.env.JWT_EXPIRES_IN as any;
  }

  return jwt.sign(payload, secret, options);
};

export const verifyToken = <T>(token: string): T => {
  const secret = getSecret();
  return jwt.verify(token, secret) as T;
};
