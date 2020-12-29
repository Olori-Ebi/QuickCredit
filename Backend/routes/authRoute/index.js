import express from 'express';
import AuthController from '../../controller/auth.js';
import validateUser from '../../middleware/validateUser.js';

const authRouter = express.Router();

authRouter.route('/api/v1/auth/signup').post(validateUser.validateProfileDetails(),
validateUser.validate,
AuthController.register)

authRouter.route('/api/v1/auth/signin').post( AuthController.login)


export default authRouter;