import helperUtils from '../../utils/HelperUtils.js';
import db from '../seeds/dbConfig.js';
import createTables from './createTable.js';
import dropQuery from './dropTable.js';

const adminPassword = helperUtils.hashPassword('oloriebi');
const userPassword = helperUtils.hashPassword('seunayo');

const createUsers = `
    INSERT INTO users(id,firstname,lastname,address,email,password,isadmin,status)
    VALUES(1,'admin','admin','10 Admin Location Ikorodu, Lagos','admin@admin.com','${adminPassword}','true','verified'),(2,'Obito', 'Uchiha','Cave-45 Akatsuki Cavern, Amegakure','uchiha.obito@akatsuki.org','${userPassword}','false','unverified');
`;

const createLoans = `
    INSERT INTO loans(id, email,status,repaid,tenor,amount,paymentInstallment,balance, interest)
    VALUES(1,'uchiha.obito@akatsuki.org','pending','false',3,20000,7000,21000,1000);
`;

const queryTable = () => {
    const populateTable = `${dropQuery}${createTables}${createUsers}${createLoans}`;
    db.query(populateTable)
    .then(() => console.log('table created successfully'))
    .catch((err) => console.log('error', err));
};

queryTable();