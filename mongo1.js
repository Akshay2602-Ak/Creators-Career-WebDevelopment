const mongoose = require('mongoose');

// MongoDB connection URI
const uri = 'mongodb+srv://admin-Ak:2602@cluster-ak.yz0a5lc.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster-AK';  // Replace 'mydatabase' with your database name

// Connect to MongoDB using Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

// Define a schema for the data (name and department)
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    }
});

// Create a model based on the schema
const Employee = mongoose.model('Employee', employeeSchema);

// Insert a new document with name and department
async function insertData() {
    const newEmployee = new Employee({
        name: 'Prasanna',
        department: 'Computer science'
    });

    try {
        // Save the new employee to the database
        const result = await newEmployee.save();
        console.log('Data inserted:', result);
    } catch (err) {
        console.error('Error inserting data', err);
    }
}

// Call the function to insert the data
insertData();
