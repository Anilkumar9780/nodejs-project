import express from 'express';

//component controllers
import {
    login,
    userProfile,
    signup,
    getAllProduct,
    addProduct,
    editProduct,
    deleteProduct,
} from '../controllers/user.js';
import auth from '../middleware/auth.js'

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/user-profile', auth, userProfile);
router.post('/addProduct', addProduct);
router.post('/editProduct', editProduct);
router.post('/deleteProduct', deleteProduct);
router.post('/getAllProduct', getAllProduct);

export default router;