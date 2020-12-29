import checkApis from 'express-validator'

const { check, validationResult } = checkApis;

const validateRepaymentError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
    return res.status(400).json({
      statusCode: 400,
      error: extractedErrors[0],
    });
  }
  return next();
};

const validateRepaymentBody = () => [
  check('amountpaid')
    .notEmpty()
    .withMessage('Enter amount to be paid')
    .isNumeric()
    .withMessage('amountpaid should be an integer')
]

export default {
  validateRepaymentError, 
  validateRepaymentBody
}