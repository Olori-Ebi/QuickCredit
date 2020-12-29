import authUser from "../models/Auth.js";
import Loan from "../models/Loan.js";

/**
 * @class LoanController
 * @description specifies which method handles a request for the Loan endpoints
 * @exports LoanController
 */
class LoanController {

  /**
   * @method createLoan
   * @description Creates a loan application request
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static createLoan(req, res) {
    const { email } = req.user;
    const { tenor, amount } = req.body;
    const loan = {
      interest: 0.05 * parseInt(amount, 10),
      get paymentInstallment() {
        return (parseInt(amount, 10) + this.interest) / parseInt(tenor, 10);
      },
      get balance() {
        return parseInt(this.paymentInstallment, 10) * parseInt(tenor, 10);
      },
      status: 'pending',
      repaid: false,
    };

    authUser.findAll({ where: { email: `${email}`}})
      .then(data => {
        if (data[0].dataValues.status !== 'verified') {
          return res.status(401).json({
            statusCode: 401,
            error: 'User must be verified first'
          })
        }
        Loan.findAll({ where: { email: `${email}` }})
          .then(data => {
            if(data.length > 0) {
              return res.status (400).json ({
                statusCode: 400,
                msg: 'You have an existing loan',
              });
            }
            console.log(data)
            if(data.length === 0) {
              Loan.create({
                email,
                tenor,
                amount,
                interest: loan.interest,
                paymentinstallment: loan.paymentInstallment,
                balance: loan.balance,
                status: loan.status,
                repaid: loan.repaid
              }) 
              .then(data => {
                return res.status(201).json({
                  statusCode: 201,
                  data: {...data}
                })
              })
            }
          })
      })
      .catch(error => console.log('error', error))
  }

    /**
   * @method getAllLoans
   * @description List all loan applications in the database
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getAllLoans(req, res) {
    const { status, repaid } = req.query;
    if (status && repaid) {
      Loan.findAll({ where: { status: `${status}`, repaid: `${repaid}`}})
        .then(data => {
          data.length > 0 ? 
          res.status(200).json({
            statusCode: 200,
            data
          }) : res.status(400).json({
            statusCode: 400,
            message: 'loan not found'
          })
        })
        .catch(err => console.log('err', err))
    } else {
      Loan.findAll()
        .then(data => {
          data.length > 0 ? 
          res.status(200).json({
            statusCode: 200,
            data
          }) : res.status(400).json({
            statusCode: 400,
            message: 'loan not found'
          })
        })
        .catch(err => console.log('err', err))
    }
  }

  /**
   * @method getOneLoan
   * @description Obtain a single loan
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getOneLoan(req, res) {
    const {id} = req.params;
    Loan.findAll({ where: { id: `${id}`}})
      .then(data => {
        data.length > 0 ? res.status(200).json({
            statusCode: 200,
            data
          }
        ) : res.status(404).json({
          statusCode: 404,
          message: 'loan record not found'
        })
      })
      .catch(err => console.log('err', err))
  }
  /**
   * @method updateLoan
   * @description Approves or rejects a loan application request
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static updateLoan(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    Loan.findAll({ where: { id: `${id}`}})
      .then(data => {
        if(!data.length) {
          return res.status(400).json({
            statusCode: 400,
            message: 'loan record not found'
          })
        }
        if(data[0].dataValues.status == 'approved' || data[0].dataValues.status == 'rejected') {
          return res.status(400).json({
            statusCode: 400,
            message: 'loan status already updated'
          })          
        }
        Loan.update(
          {status: `${status}`}, {where: { id: `${id}` }, 
          returning: true,
          plain: true
        })
        .then(data => {
          return res.status(200).json({
            statusCode: 200,
            message: 'Loan status updated',
            data: data[1].dataValues
          })
        })
      })
  }

  static viewUserLoan(req, res) {
    const { email } = req.user;
    Loan.findAll({ where: { email: `${email}`}})
      .then(data => {
        data.length > 0 ? res.status(200).json({
          statusCode: 200,
          data
        }
      ) : res.status(404).json({
        statusCode: 404,
        message: 'loan record not found'
      })
    })
  }
}

export default LoanController