const mongoose = require('mongoose');

const dbConnectionString = process.env.DB_CONNECTION_STRING;

mongoose.connect(dbConnectionString).then(()=> console.log('connected'))