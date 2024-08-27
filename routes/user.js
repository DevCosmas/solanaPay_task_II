import express from 'express';
import { registerUser, login } from '../controller/user.js';

const userRouter = express.Router();

userRouter.post('/sign-up', registerUser);
userRouter.post('/login', login);

export default userRouter;
