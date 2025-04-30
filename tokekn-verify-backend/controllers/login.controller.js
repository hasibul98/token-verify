const jwt = require( 'jsonwebtoken' );
const bcrypt = require( 'bcryptjs' );
const { findUserByEmail } = require( '../models/login.model.js' );
require( 'dotenv' ).config();
const db = require( '../config/db.config.js' );

// Generate Access Token (expires in 18 minutes)
const generateAccessToken = ( user ) =>
{
       return jwt.sign(
              { id: user.id, userName: user.userName, email: user.email },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '18m' }
       );
};

// Generate Refresh Token (expires in 1 day)
const generateRefreshToken = ( user ) =>
{
       return jwt.sign(
              { id: user.id, userName: user.userName, email: user.email },
              process.env.REFRESH_TOKEN_SECRET,
              { expiresIn: '1d' }
       );
};

// Login Controller
const loginUser = async ( req, res ) =>
{
       const { email, password } = req.body;

       try
       {
              // Find user by email
              const user = await findUserByEmail( email );
              if ( !user )
              {
                     return res.status( 404 ).json( { message: 'User not found' } );
              }

              // Compare passwords
              const isPasswordValid = await bcrypt.compare( password, user.password );
              if ( !isPasswordValid )
              {
                     return res.status( 401 ).json( { message: 'Invalid credentials' } );
              }

              // Generate tokens
              const accessToken = generateAccessToken( user );
              const refreshToken = generateRefreshToken( user );

              // Get Client IP
              const ip = req.headers[ 'x-forwarded-for' ] || req.socket.remoteAddress || req.ip;
              const finalIP = ip === '::1' ? '127.0.0.1' : ip;
              // Get Device Information
              const device = req.headers[ 'user-agent' ] || 'Unknown Device';

              // Save Refresh Token into Database
              const query = `
      INSERT INTO refresh_tokens (user_id, refresh_token, ip, device)
      VALUES (?, ?, ?, ?)
    `;


              const values = [ user.id, refreshToken, finalIP, device ];

              await db.execute( query, values );

              // Set cookies
              res.cookie( 'access_token', accessToken, {
                     httpOnly: false,
                     secure: false, // Change to true in production (HTTPS)
                     sameSite: 'Strict',
                     maxAge: 18 * 60 * 1000, // 18 minutes
                     path: '/',
              } );

              res.cookie( 'refresh_token', refreshToken, {
                     httpOnly: true,
                     secure: false, // Change to true in production (HTTPS)
                     sameSite: 'Strict',
                     maxAge: 24 * 60 * 60 * 1000, // 1 day
                     path: '/',
              } );

              return res.status( 200 ).json( { message: 'Login successful' } );

       } catch ( err )
       {
              console.error( '[Login Error]', err );
              return res.status( 500 ).json( { message: 'Server error', error: err.message } );
       }
};

module.exports = { loginUser };
