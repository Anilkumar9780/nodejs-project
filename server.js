import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import router from './routes/user.js';



const app = express();

// Use dotenv for managing environment variables
// require('dotenv').config();

// Node.js body parsing middleware.
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET || 'secret123'));

app.use(cors());

// Configure and use sessions
const sessions = session({
    cookie: {
      maxAge: 86400000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : 'auto',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
    name: 'sessionID',
    resave: false,
    secret: 'secretidhere',
    saveUninitialized: false,
  });

app.use(sessions);
app.use(passport.initialize());
app.use(passport.session());

// Attach user to res.locals
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Routes
app.use('/user', router);

app.get('/', (req, res) => {
    if (req.session.user === null) {
        renderSplash(req, res);
    } else {
        renderIndex(req, res);
    }
});

// Database connection

// start server(port)
const PORT = process.env.PORT || 5000;

// create connection (mongodb database)
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));
