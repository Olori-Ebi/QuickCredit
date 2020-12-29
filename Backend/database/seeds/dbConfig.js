import Sequelize from 'sequelize'
import dotenv from 'dotenv';
dotenv.config();

const current_env = process.env.NODE_ENV || 'dev';

const config = {
  dev: process.env.DB,
  test: process.env.testDB,
  production: process.env.productionDB,
};

const db = new Sequelize(config[current_env], 'postgres', process.env.password, {
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 3000,
    idle: 10000
  }
})


export default db;