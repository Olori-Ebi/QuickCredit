import Loan from "../models/Loan.js";
import Repayment from "../models/Repayment.js";

class RepaymentController {
  static postRepayment(req, res) {
    const { id } = req.params;
    const amountpaid = parseInt(req.body.amountpaid, 10);
    let repaid = false

    Loan.findAll({ where: { id: `${id}`}})
      .then(data => {
        if(!data.length) {
          return res.status(400).json({
            statusCode: 400,
            message: 'Loan record not found'
          })
        }
        const { paymentinstallment, amount, status }= data[0].dataValues;
        if (status !== 'approved') {
          return res.status(422).json({
            statusCode: 422,
            error: 'Loan has not been approved yet'
          })
        }
        if(amountpaid !== paymentinstallment) {
          return res.status(400).json({
            statusCode: 400,
            error: `You are supposed to pay ${paymentinstallment} monthly`
          })
        }
        const newBalance = data[0].dataValues.balance - amountpaid;
        newBalance === 0 ? repaid = true : data[0].dataValues.balance -= amountpaid;

        if(newBalance < 0) {
          return res.status(400).json({
            statusCode: 400,
            error: 'Loan has been repaid'
          })
        }
  
        Loan.update({ balance: `${newBalance}`, repaid: `${repaid}`}, {where: { id: id }})
          .then(data => {
            if (data == '1') {
              Repayment.create({
                loanid: id,
                amountpaid,
                balance: newBalance,
                monthlyinstallment: paymentinstallment,
                amount,
              })
              .then(data => {
                return res.status(201).json({
                  statusCode: 201,
                  data
                })
              })
            }
          })
      })
  }
  static viewRepaymentHistory(req, res) {
    const { id } = req.params;
    Repayment.findAll({ where: { loanid: id }})
      .then(data => {
        data.length > 0 ? res.status(200).json({
          statusCode: 200,
          data
        }
      ) : res.status(404).json({
        statusCode: 404,
        message: 'No repayment history for loan'
      })
    })
  }
}

export default RepaymentController