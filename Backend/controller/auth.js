import authUser from "../models/Auth.js"
import helperUtils from "../utils/HelperUtils.js";

/**
 * @class AuthController
 * @description specifies which method handles a request for User endpoints
 * @exports AuthController
 */

class AuthController {
  /**
   * @method register
   * @description Registers a user if details are valid
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {void}
   */
  static register(req, res) {
    let { firstname, lastname, address, email, password } = req.body;
    const status = 'unverified';
    const isadmin = false;
    const hashedPassword = helperUtils.hashPassword(password);
    const data = {
      firstname, 
      lastname, 
      address,
      email,
      password: hashedPassword
    }
    const token = helperUtils.generateToken(data)

    authUser.create({
      firstname, 
      lastname, 
      address,
      email,
      status,
      password: hashedPassword, 
      isadmin
    })
      .then(data => {
        return res.status(201).json({
          statusCode: 201,
          data: {token, ...data.dataValues},
          message: "Registration successful"
        })
      })
      .catch((error) => {
        if(error.errors[0].type == 'unique violation') {
          return res.status(409).json({
            statusCode: 409,
            message: error.errors[0].message
          })
        }
        return res.status(500).json({
          statusCode: 500,
          message: 'An internal error occurred at the server'
        })
      })
  }

  /**
   * @method login
   * @description Logs in a user if details are valid
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {void}
   */
  static login(req, res) {
    const { email, password } = req.body;
    authUser.findAll({ where: { email: `${email}` } })
      .then(data => {
        if (data.length === 0) {
          return res.status(400).json({
            statusCode: 400,
            message: 'invalid credentials'
          })
        }
        if(!helperUtils.comparePassword(password, data[0].dataValues.password)) {
          return res.status(400).json({
            statusCode: 400,
            message: 'invalid credentials'
          })
        }
        const token = helperUtils.generateToken(data[0].dataValues);
        const dataValues = data[0].dataValues;
        return res.status(200).json({
          statusCode: 200,
          data: { token, ...dataValues},
          message: 'login success'
        })
      })
      .catch(err => console.log('error', err))
  }
}

export default AuthController