import express from "express";
import {register, login, resetPassword, forgotPassword} from "../controllers/authController.js";
import {generateToken} from "../utils/generateToken.js";
import passport from "passport";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword); // POST /api/auth/forgot-password
router.post("/reset-password/:token", resetPassword); // POST /api/auth/reset-password/:token
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { session: false }),
    (req, res) => {
        const token = generateToken(req.user._id);
        // Редиректим на frontend с токеном в query
        res.redirect(`${process.env.FRONTEND_URL}/auth/google?token=${token}`);
    }
);


export default router;
