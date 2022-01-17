import expressJwt from 'express-jwt';

export function authJwt() {
  const secret = process.env.secret;
  return expressJwt({
    secret,
    algorithms: ['HS256'],
  });
}

