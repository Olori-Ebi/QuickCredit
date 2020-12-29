import checkAPIs from 'express-validator/check/index.js'

const { check, validationResult } = checkAPIs;

const validate = (req, res, next) => {
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

const validateProfileDetails = () => [
  check('firstname')
    .notEmpty()
    .withMessage('firstname field is required')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('firstname should be between 3 and 20 characters')
    .isAlpha()
    .withMessage('firstname should only contain alphabets'),
  check('lastname')
    .notEmpty()
    .withMessage('lastname field is required')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('lastname should be between 3 and 20 characters')
    .isAlpha()
    .withMessage('lastname should only contain alphabets'),
  check('address')
    .notEmpty()
    .withMessage('address field is required')
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage('address should be at least 10 characters')
    .matches(/^[A-Za-z0-9\.\-\s\,]*$/)
    .withMessage('invalid address format entered'),
  check('email')
    .notEmpty()
    .withMessage('email field is required')
    .trim()
    .isEmail()
    .withMessage('Invalid email address entered')
    .customSanitizer((email) => email.toLowerCase()),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .trim()
    .isLength({ min: 6, max: 15 })
    .withMessage('Password must be between 6 to 15 characters')
    .isAlphanumeric()
    .withMessage('Password must be be alphanumeric')
];

const validateLoginDetails = () => [
  check('email')
    .notEmpty()
    .withMessage('email field required')
    .trim()
    .isEmail()
    .withMessage('invalid credentials'),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .trim()
    .isLength({ min: 6, max: 15 })
    .withMessage('invalid credentials')
    .isAlphanumeric()
    .withMessage('invalid credentials')
]

export default {
  validate, validateProfileDetails, validateLoginDetails
};