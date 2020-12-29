import Sequelize from 'sequelize'
import db from '../database/seeds/dbConfig.js'


const Loan = db.define('loans', {
  email: {
    type: Sequelize.STRING
  },
  tenor: {
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
  interest: {
    type: Sequelize.FLOAT
  },
  balance: {
    type: Sequelize.FLOAT
  },
  paymentinstallment: {
    type: Sequelize.FLOAT
  },
  status: {
    type: Sequelize.STRING
  },
  repaid: {
    type: Sequelize.BOOLEAN
  }
}, {
  timestamps: false
})

export default Loan;