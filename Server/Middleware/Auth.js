const jwt = require('jsonwebtoken');

// Use your secret key (keep it safe)
const SECRET_KEY = 'MurthySuperKey123';

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;  // you can access user info from token
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or Expired Token' });
  }
};

module.exports = authenticateToken;
