import Sequelize from 'sequelize'
import db from '../database/seeds/dbConfig.js'


const Repayment = db.define('repayments', {
  loanid: {
    type: Sequelize.INTEGER
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  },
  amount: {
    type: Sequelize.FLOAT
  },
  amountpaid: {
    type: Sequelize.FLOAT
  },
  balance: {
    type: Sequelize.FLOAT
  },
  monthlyinstallment: {
    type: Sequelize.FLOAT
  }
}, {
  timestamps: false
})

export default Repayment;