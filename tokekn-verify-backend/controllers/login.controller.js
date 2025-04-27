const jwt = require( 'jsonwebtoken' );
const { findUserByEmail } = require( '../models/login.model.js' );
const bcrypt = require( 'bcryptjs' );
require( 'dotenv' ).config();



const generateAccessToken = ( user ) =>
{
       return jwt.sign( { id: user.id, userName: user.userName, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '18m' } );
};
const generateRefreshToken = ( user ) =>
{
       return jwt.sign( { id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' } );
};


const loginUser = async ( req, res ) =>
{
       const { email, password } = req.body;

       try
       {
              const user = await findUserByEmail( email ); // Add await here
              if ( !user )
              {
                     return res.status( 404 ).json( { message: "user not found" } );
              }
              const isPasswordValid = await bcrypt.compare( password, user.password );
              if ( !isPasswordValid )
              {
                     return res.status( 401 ).json( { message: 'invalid credentials' } );
              }

              const accessToken = generateAccessToken( user );
              const refreshToken = generateRefreshToken( user );

              res.cookie( 'refreshToken', refreshToken, {
                     httpOnly: true,
                     sameSite: 'strict',
                     secure: false, // Set true in production with HTTPS
                     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
              } );
              res.cookie( 'accessToken', accessToken, {
                     httpOnly: false,
                     secure: true,
                     sameSite: 'Strict',
                     path: '/',
                     maxAge: 18 * 60 * 1000 // 18 minutes
              } );

              res.status( 200 ).json( { message: 'Login successful' } );
       } catch ( err )
       {
              console.error( err ); // Log the error for debugging
              res.status( 500 ).json( { message: 'server error', error: err.message } );
       }
};

module.exports = { loginUser };








