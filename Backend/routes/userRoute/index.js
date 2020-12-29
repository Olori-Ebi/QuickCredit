import express from 'express'
import LoanController from '../../controller/loan.js';
import UserController from '../../controller/user.js';
import AuthenticateUser from '../../middleware/authenticateUsers.js';
import validateParameter from '../../middleware/validateParameter.js';

const userRouter = express.Router();

userRouter.route('/api/v1/users')
  .get(
    AuthenticateUser.verifyAdmin, 
    UserController.getAllUsers
  );

userRouter.route('/api/v1/users/:email')
  .get(
    AuthenticateUser.verifyAdmin, 
    validateParameter.validateEmailParams(), 
    validateParameter.validateParamsError,
    UserController.getUser
  )

userRouter.route('/api/v1/users/:email/verify')
  .patch(
    AuthenticateUser.verifyAdmin,
    validateParameter.validateEmailParams(),
    validateParameter.validateStatus(), 
    validateParameter.validateParamsError, 
    UserController.verifyUser
  )

userRouter.route('/api/v1/user/loan')
    .get(
      AuthenticateUser.verifyUser,
      LoanController.viewUserLoan
    )


export default userRouter