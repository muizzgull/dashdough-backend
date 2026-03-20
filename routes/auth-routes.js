import express from "express";
import { logout, signin, signup } from "../controllers/auth-controllers.js";

const authRouter = express.Router();

authRouter.post('/signup', signup)
authRouter.post('/signin', signin)
authRouter.post('/logout', logout)

export default authRouter;