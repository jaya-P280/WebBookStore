const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: path.join(__dirname, '.env') });


const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = 'mongodb://localhost:27017';
const Client = new MongoClient(uri);
const jwtkey = process.env.JWT_KEY || 'mysecretkey';

async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function protectRoute(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = header.split(' ')[1];
  try {
    const decode = jwt.verify(token, jwtkey);
    req.user = decode;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

app.post('/register', async (req, res) => {
  try {
    const user = req.body;
    if (!user.username || !user.password||!user.email) {
      return res.status(400).json({ message: 'Username, password and Email are required' });
    }

    const existingUser = await Client.db('Users').collection('users').findOne({ username: user.username });
    const existingemail=await Client.db('Users').collection('users').findOne({ email: user.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    if (existingemail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    user.password = await hashPassword(user.password);
    const data = await Client.db('Users').collection('users').insertOne(user);
    return res.status(200).json({ message: 'User registered successfully', data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await Client.db('Users').collection('users').findOne({username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, jwtkey, { expiresIn: '1h' });
    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

app.get('/books', protectRoute, async (req, res) => {
  try {
    const data = await Client.db('BookStore').collection('books').find().toArray();
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching books' });
  }
});

app.get('/getbook', protectRoute, async (req, res) => {
  try {
    const title = req.query.title;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const book = await Client.db('BookStore').collection('books').findOne({ title });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.status(200).json(book);
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

app.post('/addbook', protectRoute, async (req, res) => {
  try {
    const book = req.body;
    if (!book.title || !book.author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }

    const exist = await Client.db('BookStore').collection('books').findOne({ title: book.title });
    if (exist) {
      return res.status(400).json({ message: 'Book already exists' });
    }

    const data = await Client.db('BookStore').collection('books').insertOne(book);
    return res.status(200).json({ message: 'Book added successfully', data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

app.put('/updatebook/:title', protectRoute, async (req, res) => {
  try {
    const title = req.params.title;
    const updatedBook = req.body;

    const result = await Client.db('BookStore').collection('books').updateOne(
      { title },
      { $set: updatedBook }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({ message: 'Book updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

app.delete('/deletebook', protectRoute, async (req, res) => {
  try {
    const { title } = req.body;
    const result = await Client.db('BookStore').collection('books').deleteOne({ title });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function startServer() {
  try {
    await Client.connect();
    console.log('✅ Database connected');
    app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
}

startServer();
