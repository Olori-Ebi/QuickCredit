import Sequelize from 'sequelize'
import db from '../database/seeds/dbConfig.js'


const authUser = db.define('users', {
  firstname: {
    type: Sequelize.STRING
  },
  lastname: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  created_at: {
    type: Sequelize.DATE
  },
  updated_at: {
    type: Sequelize.DATE
  },
  status: {
    type: Sequelize.STRING
  },
  isadmin: {
    type: Sequelize.BOOLEAN
  }
}, {
  timestamps: false
})

export default authUser;