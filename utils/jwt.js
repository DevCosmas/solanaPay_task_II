import jwt from 'jsonwebtoken';

function jwtToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id: payload },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
}

export { jwtToken };
