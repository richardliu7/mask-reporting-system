import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import passport from "passport";
import passportOAuth from 'passport-google-oauth20';
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";

import config from './config.js';
import apiRouter from '../routes/apiRouter.js';
import reportRouter from '../routes/reportRouter.js';
import reviewRouter from '../routes/reviewRouter.js';
import passportRouter from "../routes/passportRouter.js";

// import path from 'path';
// const __dirname = path.resolve(path.dirname(''));

function initMongoose() {
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useNewUrlParser', true);

    return mongoose.connect(process.env.DB_URI || config.db.uri, function (err) {
        if (err) {
            console.error('Failed to connect to mongo on startup - retrying in 3 sec', err);
            setTimeout(initMongoose, 3000);
        } else {
            console.log("INFO   DB Connected!")
        }
    });
}

function init() {
    initMongoose();

    // Initialize app and set app parameters
    const app = express();

    // Resolves CORS errors
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use(morgan('dev')); // enable request logging for development debugging
    app.use(bodyParser.json()); // body parsing middleware
    app.use(bodyParser.urlencoded({
        extended: false
    }));

    // Authentication using passport + Google OAuth
    // https://medium.com/@bogna.ka/integrating-google-oauth-with-express-application-f8a4a2cf3fee
    var GoogleStrategy = passportOAuth.Strategy;

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use(
        new GoogleStrategy({
                clientID: config.passport.clientID,
                clientSecret: config.passport.clientSecret,
                callbackURL: process.env.NODE_ENV === 'production' ? "http://app.maskon.dev/api/auth/google/callback" : "http://localhost:5000/api/auth/google/callback"
            },
            function (accessToken, refreshToken, profile, done) {
                done(null, profile);
            }
        )
    );

    app.use(cookieSession({
        name: 'session',
        keys: ['CaDn7JyCjCCt88YojTkBHYFwBVKU6VD46Q8NdS9mdKSUHsyHzjCjJqVJjaKtzBFG']
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    // app.use(cookieParser());

    // Set app routers
    app.use('/api', apiRouter);
    app.use('/api/report', reportRouter);
    app.use('/api/review', reviewRouter);
    app.use('/api/auth/google', passportRouter);

    if (process.env.NODE_ENV === 'production') {
        // Serve any static files
        app.use(express.static('/client/build'));

        // Handle React routing, return all requests to React app
        app.get('*', function (req, res) {
            res.sendFile('/client/build/index.html');
        });
    }

    return app
}

export default init;