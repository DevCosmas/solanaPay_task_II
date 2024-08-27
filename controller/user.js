// import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';
import User from '../model/user.js';
import AppError from '../utils/appError.js';
import { jwtToken } from '../utils/jwt.js';

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password.length <= 6)
      return next(new AppError('Password is too short', 400));
    if (password !== confirmPassword)
      return next(new AppError('Passwords does not match', 400));

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: 'error', message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      confirmPassword: undefined,
    });
    await newUser.save();

    res.status(201).json({ status: 'success', user: newUser });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return next(new AppError('User not registered', 400));

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword)
      return next(new AppError('Incorrect Password or Email', 400));

    const token = await jwtToken(user._id);

    res.status(200).json({
      status: 'success',
      message: 'You are now logged in',
      loggedUser: {
        password: undefined,
        confirmPassword: undefined,
        ...user.toObject(),
      },
      token,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

// export const googleAuth = async (req, res) => {
//   try {
//     const { idToken } = req.body;

//     // Verify the ID token
//     const ticket = await client.verifyIdToken({
//       idToken,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { sub: googleId, name, email } = payload;

//     // Check if the user exists or create a new one
//     let user = await User.findOne({ googleId });
//     if (!user) {
//       user = new User({ googleId, fullName: name, email });
//       await user.save();
//     }

//     res.json({ status: 'success', user });
//   } catch (error) {
//     res.status(400).json({ status: 'error', message: error.message });
//   }
// };
