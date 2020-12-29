import checkAPIs from 'express-validator/check/index.js'

const { check, validationResult } = checkAPIs;

const validateParamsError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
    return res.status(400).json({
      statusCode: 400,
      errors: extractedErrors[0],
    });
  }
  return next();
};

const validateEmailParams = () => [
  check('email')
    .notEmpty()
    .withMessage('email field required')
    .trim()
    .isEmail()
    .withMessage('invalid email address'),
]

const validateStatus = () => [
  check('status')
    .notEmpty()
    .withMessage('Specify status field')
    .isAlpha()
    .withMessage('Invalid status type specified')
    .matches(/^(verified|unverified)$/)
    .withMessage('Invalid status option specified')
]

export default {
  validateParamsError,
  validateEmailParams,
  validateStatus
}