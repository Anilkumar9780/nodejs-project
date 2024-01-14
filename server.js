import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';


const app = express();
app.use(session({ secret: 'anything', resave: true, saveUninitialized: true }));
const sessions = session({
    cookie: {
        maxAge: 86400000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : 'auto',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
    name: 'sessionID',
    genid: (req) => {
        return genuuid();
    },
    resave: false,
    secret: 'secretidhere',
    saveUninitialized: false,
});

app.use(sessions);
app.use(passport.initialize());
app.use(passport.session());

// Node.js body parsing middleware.
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cookieParser("secret123"));
app.use(cors());
mongoose.set('useCreateIndex', true);

// user 
app.use((req, res, next) => {
    res.locals.user = req.user || null
    next();
})

app.get('/', (req, res) => {
    if (req.session.user === null) {
        renderSplash(req, res);
    } else {
        renderIndex(req, res);
    }
});

// start server(port)
const PORT = process.env.PORT || 5000;

// create connection (mongodb database)
mongoose.connect(process.env.CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() =>
        app.listen(PORT, () =>
            console.log(`Server Running on Port: http://localhost:${PORT}`))
    )
    .catch((error) => console.log(`${error} did not connect`));
