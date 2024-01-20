import express from 'express';

//component controllers
import {
    login,
    userProfile,
    signup,
} from '../controllers/user.js';
import auth from '../middleware/auth.js'

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/user-profile', auth, userProfile);

export default router;