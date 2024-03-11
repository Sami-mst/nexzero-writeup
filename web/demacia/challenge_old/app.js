const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
// env 
require('dotenv').config();

// Set the view engine to Pug
app.set('view engine', 'pug');
app.set('views', 'views');

//database of user profiles and files
const users = [
  { id: '1', name: 'guest', isAdmin: false, username: 'guest', password: 'guest' },
  { id: '2', name: 'lux', isAdmin: false, username: 'user', password: 'pass1' },
  { id: '3', name: 'fiora', isAdmin: false, username: 'user', password: 'pass2' },
  { id: '4', name: 'garen', isAdmin: false, username: 'user', password: 'pass3' },
  { id: '5', name: 'sona', isAdmin: false, username: 'user', password: 'pass4' },
  { id: '6', name: 'lucian', isAdmin: false, username: 'user', password: 'pass5' },
  { id: '7', name: 'sylas', isAdmin: false, username: 'user', password: 'pass6' },
  { id: '8', name: 'vayne', isAdmin: false, username: 'user', password: 'pass7' },
  { id: '9', name: 'Quinn', isAdmin: false, username: 'user', password: 'pass8' },
  { id: '10', name: 'Admin', isAdmin: true, username: 'admin', password: 'adminpassdemacia'},
];

const files = [
  { id: '1', name: 'document.txt', ownerId: '1' },
  { id: '2', name: 'photo.jpg', ownerId: '2' },
  { id: '3', name: 'secret.txt', ownerId: '3' },
  { id: '4', name: 'document1.txt', ownerId: '4' },
  { id: '5', name: 'photo1.jpg', ownerId: '5' },
  { id: '6', name: 'secret1.txt', ownerId: '6' },
  { id: '7', name: 'document2.txt', ownerId: '7' },
  { id: '8', name: 'photo2.jpg', ownerId: '8' },
  { id: '9', name: 'secret2.txt', ownerId: '9' },
  { id: '10', name: 'document3.txt', ownerId: '10' },
];

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));
// public folder for css 
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  const userId = req.session && req.session.userId;
  req.user = userId ? users.find(user => user.id === userId) : null;
  next();
});

// Define the flag
const flag = process.env.FLAG || "nexus{This_is_so_ez_right}";
// Index page
// i will put session later 
app.get('/', (req, res) =>{
  res.render('login'); 
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.userId = user.id;
    res.redirect('/profile?user_id=' + user.id); 
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});
// Profile page
app.get('/profile', (req, res) => {
  const requestedUserId = req.query.user_id;
  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }
  const userProfile = users.find(user => user.id === requestedUserId);

  res.render('profile', { userProfile, flag });
});

// view files page
app.get('/file', (req, res) => {
  const requestedFileId = req.query.file_id;
  const ownerUserId = req.query.owner_id;

  // console log
/*   console.log("owner", ownerUserId);
  console.log("file", requestedFileId);
  console.log('User ID:', req.user ? req.user.id : 'undefined');
  console.log('Authenticated User:', req.user); */

  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }
  if (!ownerUserId) {
    return res.status(400).send('Bad Request');
  }
  const requestedFile = files.find(file => file.id === requestedFileId && file.ownerId === ownerUserId);

  if (!requestedFile) {
    return res.status(404).send('File not found');
  }

  // Render the file template with the flag for file with ID 10
  const fileContent = requestedFile;
  const flag = (fileContent.id === '10') ? "nexus{This_is_so_ez_right}" : undefined;
  res.render('file', { fileContent, flag });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// routes
/*
http://localhost:3000/file?file_id=1&owner_id=1&user_id=1
http://localhost:3000/profile?user_id=1
*/