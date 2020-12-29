import express from 'express'
import LoanController from '../../controller/loan.js';
import RepaymentController from '../../controller/repayment.js';
import AuthenticateUser from '../../middleware/authenticateUsers.js';
import validateLoan from '../../middleware/validateLoan.js';
import validateParameter from '../../middleware/validateParameter.js';
import validateRepayment from '../../middleware/validateRepayment.js';

const loanRouter = express.Router();

loanRouter.route('/api/v1/loans')
  .post(
    AuthenticateUser.prevAdmin, 
    AuthenticateUser.verifyUser,
    validateLoan.validateLoanApply(),
    validateLoan.validateInputError,
    LoanController.createLoan
  );

  loanRouter.route('/api/v1/loans')
    .get(
      AuthenticateUser.verifyAdmin,
      validateLoan.validateQueryOptions(),
      validateLoan.validateInputError,
      LoanController.getAllLoans
    );
  
  loanRouter.route('/api/v1/loans/:id')
    .get(
      AuthenticateUser.verifyAdmin,
      validateLoan.validateIdParams(),
      validateLoan.validateInputError,
      LoanController.getOneLoan
    )
  loanRouter.route('/api/v1/loans/:id/repayments')
    .post(
      AuthenticateUser.verifyAdmin,
      validateLoan.validateIdParams(),
      validateRepayment.validateRepaymentBody(),
      validateRepayment.validateRepaymentError,
      RepaymentController.postRepayment
    )
  loanRouter.route('/api/v1/loans/:id/repayments')
    .get(
      AuthenticateUser.verifyUser,
      validateLoan.validateIdParams(),
      validateRepayment.validateRepaymentError,
      RepaymentController.viewRepaymentHistory
    )

  loanRouter.route('/api/v1/loans/:id')
    .patch(
      AuthenticateUser.verifyAdmin,
      validateLoan.validateIdParams(),
      validateLoan.validatePatchOptions(),
      validateLoan.validateInputError,
      LoanController.updateLoan
    )


export default loanRouter;