// server.js
const dotenv = require('dotenv');
dotenv.config();
console.log(process.env.SECRET_KEY);

const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const bcrypt = require('bcrypt');
const port = 8001;
const cors = require('cors');
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization',
}));

  

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root3977',
  database: 'website'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

app.use(bodyParser.json());

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Received signup data:', req.body); // Debugging
  
    const sql = 'INSERT INTO users (Username, Email, Password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error signing up');
      } else {
        res.status(200).send('Signup successful');
      }
    });
  });
  // User login endpoint
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    console.log('Login attempt with email:', email); // Log email for debugging
  
    db.query('SELECT * FROM users WHERE Email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Error finding user:', err);
        res.status(500).json({ error: 'Error finding user' });
        return;
      }
  
      if (results.length === 0) {
        console.log('No user found with email:', email); // Log if no user found
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
  
      const user = results[0];
  
      try {
        console.log('User found:', user); // Log user details for debugging (do not log sensitive information in production)
        const match = await bcrypt.compare(password, user.Password);
        if (!match) {
          console.log('Password does not match for user:', email); // Log password mismatch
          res.status(401).json({ error: 'Invalid email or password' });
          return;
        }
        if (user.Role !== 'admin') {
          console.log('User is not an admin');
          res.status(403).json({ error: 'Access denied. User is not an admin.' });
          return;
        }
        const token = jwt.sign({ id: user.UserID, email: user.Email,role: user.Role },""+ process.env.SECRET_KEY, { expiresIn: '24h' });
        console.log('User logged in successfully');
        res.status(200).json({ message: 'User logged in successfully', token });
      } catch (error) {
        console.error('Error comparing passwords:', error);
        res.status(500).json({ error: 'Error comparing passwords' });
      }
    });
  });

  // Middleware to authenticate users
  app.use((req, res, next) => {
    const token = req.headers.authorization;
    console.log('Authorization header:', token); // Log the token

    if (!token) {
        console.log('No token provided');
        req.user = null;
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const cleanedToken = token.replace('Bearer ', '');
        console.log('Cleaned token:', cleanedToken); // Log the cleaned token
        const decoded = jwt.verify(cleanedToken, ""+process.env.SECRET_KEY);
        console.log('Decoded token:', decoded); // Log the decoded token
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verifying JWT token:', error);
        req.user = null;
        return res.status(401).json({ error: 'Unauthorized' });
    }
});

app.get('/protected', (req, res) => {
    if (!req.user) {
        console.log('Unauthorized access attempt to /protected');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user.id;
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).json({ error: 'Error fetching user data' });
        }

        if (results.length === 0) {
            console.log('User not found for id:', userId);
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = results[0];
        res.json(userData);
    });
});

app.post('/api/user/causes', (req, res) => {
    if (!req.user) {
        console.log('Unauthorized access attempt to /api/user/causes');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, description } = req.body;
    const userId = req.user.id;
    const sql = 'INSERT INTO causes (title, description, status, userId) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, description, 'pending', userId], (err, result) => {
        if (err) {
            console.error('Error creating cause:', err);
            res.status(500).json({ error: 'Error creating cause' });
        } else {
            const newCause = { id: result.insertId, title, description, status: 'pending', userId };
            res.status(201).json(newCause);
        }
    });
});

app.get('/api/user/causes', (req, res) => {
  // Ensure the user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = req.user.id; // Get the authenticated user's ID from req.user
  const sql = 'SELECT * FROM causes WHERE UserID = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching causes:', err);
      return res.status(500).json({ error: 'Error fetching causes' });
    }

    // Check if any causes were found for the user
    if (results.length === 0) {
      console.log('No causes found for user:', userId);
      return res.status(404).json({ error: 'No causes found for this user' });
    }

    // Causes found, send them in the response
    res.json(results);
  });
});

app.get('/api/admin/causes', (req, res) => {
    const sql = 'SELECT * FROM causes';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching causes:', err);
            res.status(500).json({ error: 'Error fetching causes' });
        } else {
            res.json(results);
        }
    });
});

app.post('/api/admin/causes/:id/approve', (req, res) => {
  const { id } = req.params; // Get the cause ID from the route parameters
  const { status } = req.body; // Get the new status ('approved' or 'rejected') from the request body

  if (!id) {
    console.error('Cause ID is undefined');
    return res.status(400).json({ error: 'Cause ID is required' });
  }

  if (!status) {
    console.error('Status is undefined');
    return res.status(400).json({ error: 'Status is required' });
  }

  // SQL query to update the status of the cause
  const sql = 'UPDATE causes SET status = ? WHERE CauseId = ?';

  // Execute the query with the new status and cause ID
  db.query(sql, [status, id], (err, results) => {
    if (err) {
      // If there's an error executing the query, log the error and send a 500 response
      console.error('Error updating cause status:', err);
      return res.status(500).json({ error: 'Error updating cause status' });
    }

    // If the query is successful, send a success response
    res.json({ message: `Cause ${status} successfully` });
  });
});
app.get('/api/causes/approved', (req, res) => {
  const sql = 'SELECT * FROM causes WHERE status = ?';
  db.query(sql, ['approved'], (err, results) => {
      if (err) {
          console.error('Error fetching approved causes:', err);
          return res.status(500).json({ error: 'Error fetching approved causes' });
      }
      res.json(results);
  });
});


// Create a new campaign
app.post('/api/user/campaigns', (req, res) => {
  if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title, description, goalAmount, deadline } = req.body;
  const userId = req.user.id;
  const sql = 'INSERT INTO campaigns (Title, Description, GoalAmount, Deadline, Status, UserID, CreatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW())';
  db.query(sql, [title, description, goalAmount, deadline, 'pending', userId], (err, result) => {
      if (err) {
          console.error('Error creating campaign:', err);
          res.status(500).json({ error: 'Error creating campaign' });
      } else {
          const newCampaign = { CampaignID: result.insertId, title, description, goalAmount, deadline, status: 'pending', userId, createdAt: new Date() };
          res.status(201).json(newCampaign);
      }
  });
});
app.get('/api/user/campaigns', (req, res) => {
  if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = req.user.id;
  const sql = 'SELECT * FROM campaigns WHERE userId = ?';
  db.query(sql, [userId], (err, results) => {
      if (err) {
          console.error('Error fetching campaigns:', err);
          res.status(500).json({ error: 'Error fetching campaigns' });
      } else {
          res.status(200).json(results);
      }
  });
});
// Endpoint to fetch all campaigns (admin access)
app.get('/api/admin/campaigns', (req, res) => {
  const sql = 'SELECT * FROM campaigns';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching campaigns:', err);
      res.status(500).json({ error: 'Error fetching campaigns' });
    } else {
      res.status(200).json(results);
    }
  });
});
app.post('/api/admin/campaigns/:id/approve', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Campaign ID is required' });
  }

  if (!status || (status !== 'approved' && status !== 'rejected')) {
    return res.status(400).json({ error: 'Invalid status provided' });
  }

  const sql = 'UPDATE campaigns SET Status = ? WHERE CampaignID = ?';
  db.query(sql, [status, id], (err, results) => {
    if (err) {
      console.error('Error updating Campaign status:', err);
      return res.status(500).json({ error: 'Error updating Campaign status' });
    }

    res.json({ message: `Campaign ${status} successfully` });
  });
});

app.get('/api/campaigns/approved', (req, res) => {
  const sql = 'SELECT * FROM campaigns WHERE status = ?';
  db.query(sql, ['approved'], (err, results) => {
      if (err) {
          console.error('Error fetching approved causes:', err);
          return res.status(500).json({ error: 'Error fetching approved causes' });
      }
      res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});