const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const JobApplication = require('./models/JobApplication');
const cors = require('cors');




// Create an Express app
const app = express();
// Body parser middleware
app.use(cors());
app.use(bodyParser.json());
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');



// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://admin-Ak:2602@cluster-ak.yz0a5lc.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster-AK', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

// MongoDB schema for storing user information
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
});

// MongoDB model for users
const User = mongoose.model('User', userSchema);

// Routes for handling the login and sign-up forms

// Sign-up Route
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'templates')));

// Middleware
app.use(cors()); // Enable CORS to allow frontend requests
app.use(bodyParser.json()); // To parse JSON 


// Serve home.html for the /home route
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'home.html'));
});

app.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;

    const newUser = new User({
        email,
        username,
        password
    });

    try {
        await newUser.save();
        res.redirect('/login');  // Redirect to the login page after successful sign-up
    } catch (err) {
        console.error('Error signing up user:', err);
        res.send('Error signing up user');
    }
});

// Login Route
app.get('/login', (req, res) => {
    res.render('login');
});

// Serve the home page (home.html) after login
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'home.html' )); // Path to home.html
});


  


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.redirect('/home');
        } else {
            res.send('Invalid credentials');
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.send('Error during login');
    }
});

// Default route if someone accesses the root directory
app.get('/', (req, res) => {
    res.redirect('/login');  // Redirect to login page if root is accessed
});

// Route to handle post submission (for example, a post with a caption and image URL)
app.post('/add-post', (req, res) => {
    const { image, caption } = req.body;
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push({ image, caption });
    localStorage.setItem('posts', JSON.stringify(posts));
  
    // Redirect to home page after adding a post
    res.redirect('/home');
});


// Define a schema for posts
const postSchema = new mongoose.Schema({
    caption: String,
    image: String, // Store the image URL or Base64 string
    createdAt: { type: Date, default: Date.now }
  });
  
    const Post = mongoose.model('Post', postSchema);
  
  // Set up Multer storage (for image file uploads)
    const storage = multer.memoryStorage(); // Store file in memory (you can store it on disk or cloud later)
    const upload = multer({ storage: storage });
  
  // POST route to handle image upload
    app.post('/api/upload', upload.single('file'), async (req, res) => {
    const { caption } = req.body;
    const file = req.file;
  
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
  
    // Convert image to Base64 (optional if you store images on cloud or disk, not required)
    const imageBase64 = file.buffer.toString('base64');
  
    // Create a new post object
    const newPost = new Post({
      caption: caption,
      image: `data:image/${file.mimetype.split('/')[1]};base64,${imageBase64}`  // Store Base64 in MongoDB
    });
  
    try {
      await newPost.save();
      res.json({ success: true, message: 'Post uploaded successfully' });
    } catch (err) {
      console.error('Error saving post:', err);
      res.status(500).json({ success: false, message: 'Error saving post to database' });
    }
});

// Get all posts
app.get('/api/posts', async (req, res) => {
    try {
      const posts = await Post.find();  // Fetch all posts from the database
      res.json(posts);  // Send the posts as JSON response
    } catch (err) {
      console.error('Error fetching posts:', err);
      res.status(500).json({ success: false, message: 'Error fetching posts from the database' });
    }
});

// Delete post route
app.delete('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const post = await Post.findByIdAndDelete(id); // Find and delete the post by ID
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json({ message: 'Post deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error while deleting post' });
    }
});

app.post('/apply', async (req, res) => {
    const { name, email, companyName, jobTitle } = req.body;
  
    try {
      // Validate input
      if (!name || !email || !companyName || !jobTitle) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const newApplication = new JobApplication({ name, email, companyName, jobTitle });
      await newApplication.save();
      res.status(201).json({ message: 'Application submitted successfully!' });
    } catch (err) {
      console.error('Error saving job application:', err);
      res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
});

// Mongoose Schema
const EnrollmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  course: String,
});

const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);

// Route to handle enrollments
app.post('/api/enroll', (req, res) => {
  const { name, email, phone, course } = req.body;

  const newEnrollment = new Enrollment({
    name,
    email,
    phone,
    course,
  });

  newEnrollment.save()
    .then((enrollment) => {
      res.status(200).json({ message: 'Enrollment successful!', enrollment });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error enrolling. Please try again later.' });
    });
});

  
// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
