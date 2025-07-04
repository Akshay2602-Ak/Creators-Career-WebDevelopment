const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017/mydb';  // Replace 'mydatabase' with the name of your database

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB locally');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });
