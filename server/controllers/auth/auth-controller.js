const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: "User already exists with the same email! Please try again",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({
      success: true,
      message: 'Registration successfull',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ 
        success: false, 
        message: 'Some error occured' });
  }
};

// login

const loginUser = async (req, res) => {

  const { email, password } = req.body;

  try {
     const checkUser = await User.findOne({ email });
    if (!checkUser) 
      return res.json({
        success: false,
        message: "User doesn't exists.Please register first",
      });
      
      const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
      if (!checkPasswordMatch) 
        return res.json({
          success: false,
          message: "Invalid password. Please try again",
        });

      const token = jwt.sign(
        { userId: checkUser._id, email: checkUser.email },
        'CLIENT_SECRET_KEY',
        { expiresIn: '1h' }
      );
      res.cookie('token', token, { httpOnly: true, secure: false }).json({
        success: true,
        message: 'Login successfull',
        user: { 
          email: checkUser.email,
          role: checkUser.role,
          id: checkUser._id
         }
      });
      
    
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Some error occured',
    });
  }
};

// logout    

const logout = (req, res) => {
  res.clearCookie('token').json({
    success: true,
    message: 'Logout successful',
  });
}

// Auth middleware

module.exports = { registerUser, loginUser };