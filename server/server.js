import './config.js';
import express from 'express';
import { getDBInstance } from './Database/mongoDB.js';

export const app = express();

// Start up the database instance
getDBInstance();

app.get('/', (req, res) => {
  res.end('Server working');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});


