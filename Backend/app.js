import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database/seeds/dbConfig.js';
import authRouter from './routes/authRoute/index.js';
import userRouter from './routes/userRoute/index.js';
import loanRouter from './routes/loanRoute/index.js';
dotenv.config();

const app = express ();
const current_env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 5502;

//Init BodyParser Middleware
app.use (express.json ());
app.use (express.urlencoded ({extended: false}));

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', '*');
//   if(req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'PUT, PATCH, DELETE, POST, GET');
//     return res.status(200).json({});
//   }
//   next();
// });

app.use(cors());
app.options('*', cors());

//Apply router middleware
app.use('/', authRouter, userRouter, loanRouter);

//Test connection
db.authenticate()
  .then(() => console.log(`Database connected to ${current_env} DB....`))
  .catch((err) => console.log('error', err))

app.get ('/', (req, res) => {
  res.status (200).json ({
    status: 200,
    msg: 'Congratulations on finding your way around your first endpoint!!!!', 
  });
});

app.listen (port, () => {
  console.log (`server started at ${port}`);
});

export default app