// import { OAuth2Client } from 'google-auth-library';
// import bcrypt from 'bcrypt';
// import User from '../model/user.js';

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// export const registerUser = async (req, res) => {
//   try {
//     const { fullName, email, password } = req.body;

//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ status: 'error', message: 'User already exists' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const newUser = new User({ fullName, email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ status: 'success', user: newUser });
//   } catch (error) {
//     res.status(500).json({ status: 'error', message: error.message });
//   }
// };

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
