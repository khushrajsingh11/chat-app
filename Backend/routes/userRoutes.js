import express from "express"
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js";
import  protectRoute  from "../middlewere/auth.js";

const userRoutes =express.Router();

userRoutes.post("/signup",signup);
userRoutes.post("/login",login);
userRoutes.put("/update-profile",protectRoute,updateProfile);
userRoutes.get("/check",checkAuth);

export default userRoutes;