import checkAPIs from 'express-validator/check/index.js'

const { check, validationResult } = checkAPIs;

  /**
   * @method validateInputError
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
const validateInputError = (req, res, next) => {
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

  /**
   * @method validateLoanApply
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
const validateLoanApply = () => [
  check('amount')
  .notEmpty()
    .withMessage('Enter amount')
    .trim()
    .isNumeric()
    .withMessage('Amount should be an integer')
    .isLength({min: 5, max: 7})
    .withMessage('Amount should not be less than 10,000'),
  check('tenor')
    .notEmpty()
    .withMessage('Tenor is required')
    .trim()
    .isNumeric()
    .withMessage('Tenor should be an integer')
    .isInt({ min: 1, max: 12})
    .withMessage('Loan tenor must be between 1 and 12 months')
]

const validateQueryOptions =  () => [
  check('status')
    .optional()
    .isAlpha()
    .withMessage('Invalid status entered')
    .matches(/^(approved|rejected|pending)$/)
    .withMessage('Invalid status option specified'),
  check('repaid')
    .optional()
    .isAlpha()
    .withMessage('Invalid repaid option entered')
    .matches(/^(true|t|false|f)$/)
    .withMessage('Invalid repaid option specified'),
]

const validatePatchOptions = () => [
  check('status')
    .notEmpty()
    .withMessage('You failed to specify loan status in the request body')
    .trim()
    .isAlpha()
    .withMessage('Invalid status entered')
    .matches(/^(approved|rejected)$/)
    .withMessage('Status can only be approved or rejected'),
]

const validateIdParams = () => [
  check('id')
    .notEmpty()
    .withMessage('input id')
    .trim()
    .isNumeric()
    .withMessage('ID must be an integer'),
]



export default {
  validateInputError,
  validateLoanApply,
  validateQueryOptions,
  validateIdParams,
  validatePatchOptions
}