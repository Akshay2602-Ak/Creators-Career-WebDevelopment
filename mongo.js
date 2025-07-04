const mongoose = require('mongoose');

const uri = 'mongodb+srv://admin-Ak:2602@cluster-ak.yz0a5lc.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster-AK';  // Replace 'mydatabase' with the name of your database

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB locally');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });
