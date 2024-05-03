import express from "express";
import userController from "../controllers/userController.mjs";
//import { requireAuth } from "../middleware/requireAuth.mjs"

const router = express.Router();

// login route
router.post('/login', userController.loginUser)

// signup route
router.post('/signup', userController.signupUser)

// profile route
router.post('/profile', userController.updateUser)

// getUser route
router.get('/profile/:email', userController.getUser)


export default router;