import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const authC = new AuthController();
const authR = Router();

authR.post("/signup", async (req, res, next) => {
  await authC.authWrapper("signup", req, res, next);
});

export default authR;
