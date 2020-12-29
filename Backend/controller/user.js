import authUser from '../models/Auth.js';


/**
 * @class UserController
 * @description specifies which method handles a request for User endpoints
 * @exports UserController
 */
class UserController {
  /**
   * @method getAllUsers
   * @description Allows admin get all registered users
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {void}
   */
  static getAllUsers(req, res) {
    authUser.findAll()
      .then(data => {
        return res.status(200).json({
          statusCode: 200,
          data
        })
      })
      .catch(err => console.log('err', err))
  }

  /**
   * @method getUser
   * @description Gets a specific user by Email
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getUser(req, res) {
    const { email } = req.params;
    authUser.findAll({ where: { email: `${email}` }})
      .then(data => {
        if(data.length === 0) {
          return res.status(400).json({
            statusCode: 400,
            message: 'User does not exist'
          })
        }
        return res.status(200).json({
          statusCode: 200,
          data
        })
      })
      .catch(err => console.log('err', err))
  }

  /**
   * @method verifyUser
   * @description Verifies a user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static verifyUser(req, res) {
    const { status } = req.body;
    const { email } = req.params;
    authUser.findAll({ where: { email: `${email}` }})
      .then(data => {
        if(data.length === 0) {
          return res.status(404).json({
            statusCode: 404,
            message: 'User does not exist'
          })
        }
        if (data[0].dataValues.status == 'verified') {
          return res.status(409).json({
            statusCode: 409,
            error: 'User status has already been updated',
          });
        }
        authUser.update(
          {status: `${status}`}, {where: { email: `${email}` },
            returning: true,
            plain: true
        })
          .then(data => {
            console.log('data', data[1].dataValues)
            if (data) {
              return res.status(200).json({
                statusCode: 200,
                message: "verification status updated successfully",
                data: data[1].dataValues
              })
            }
            return res.status(400).json({
              statusCode: 400,
              error: `Cannot verify user with email: ${email}. Maybe email not found or req.body is empty`,
            });
          })
          .catch(err => console.log('err', err))
      })
      .catch(err => console.log('err', err))
  }
}

export default UserController