import expressJwt from 'express-jwt';

export const authJwt = () => {
  const secret = process.env.secret;
  return expressJwt({
    secret,
    algorithms: ['HS256'],
  });
}

