import express from 'express';
import passport from "passport";
import loginRequiredMiddleware from "../utils.js";

const passportRouter = express.Router();

/* GET Google Authentication API. */
passportRouter.get(
    "/",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: 'select_account'
    })
);

passportRouter.get(
    "/callback",
    passport.authenticate("google", {
        failureRedirect: "/",
    }),
    function (req, res) {
        let url = process.env.NODE_ENV === 'production' ? "http://app.maskon.dev" : "http://localhost:3000"
        req.session.token = req.user.token;
        res.redirect(url);
    }
);

passportRouter.get("/check", loginRequiredMiddleware, (req, res) => {
    return res.json({
        authenticated: true,
        message: "Successfully logged in!"
    });
});

passportRouter.get("/logout", (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/');
});

export default passportRouter;