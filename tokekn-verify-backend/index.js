const express = require( 'express' );
const cors = require( 'cors' );
const cookieParser = require( 'cookie-parser' );
const morgan = require( 'morgan' );
const helmet = require( 'helmet' );
const rateLimit = require( 'express-rate-limit' );
const jwt = require( 'jsonwebtoken' );
const db = require( './config/db.config' );
require( 'dotenv' ).config();

const userRoutes = require( './routes/user.route' );
const loginRoutes = require( './routes/login.route' );
const checkToken = require( './routes/checkToken.route' );

const app = express();

// Rate Limiter
const limiter = rateLimit( {
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 100, // Limit each IP to 100 requests per windowMs
} );
app.use( limiter );

// Security and logging
app.use( morgan( 'combined' ) );
app.use( helmet( { contentSecurityPolicy: false } ) );

// CORS configuration
app.use(
       cors( {
              origin: 'http://localhost:3000',
              credentials: true,
       } )
);

// Middleware
app.use( cookieParser() );
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );

// Routes
const router = express.Router();

// Refresh Token Route
router.get( '/refresh', async ( req, res ) =>
{
       const refreshToken = req.cookies.refresh_token; // Match cookie name with frontend

       if ( !refreshToken )
       {
              return res.status( 401 ).json( { message: 'Unauthorized: Refresh token missing' } );
       }

       try
       {
              // Check if token exists and is not revoked
              const [ rows ] = await db.execute(
                     'SELECT is_revoked FROM refresh_tokens WHERE refresh_token = ?',
                     [ refreshToken ]
              );

              if ( rows.length === 0 )
              {
                     return res.status( 403 ).json( { message: 'Refresh token not found in database' } );
              }

              if ( rows[ 0 ].is_revoked === 1 )
              {
                     return res.status( 403 ).json( { message: 'Refresh token has been revoked' } );
              }

              // Verify refresh token
              const decoded = jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET );

              // Generate new access token
              const newAccessToken = jwt.sign(
                     {
                            id: decoded.id,
                            userName: decoded.userName,
                            email: decoded.email,
                     },
                     process.env.ACCESS_TOKEN_SECRET,
                     { expiresIn: '18m' }
              );

              // Set new access token cookie
              res.cookie( 'access_token', newAccessToken, {
                     httpOnly: process.env.NODE_ENV === 'production', // Secure in production
                     secure: process.env.NODE_ENV === 'production', // HTTPS in production
                     sameSite: 'strict',
                     path: '/',
                     maxAge: 18 * 60 * 1000, // 18 minutes
              } );

              return res.status( 200 ).json( { accessToken: newAccessToken } );
       } catch ( error )
       {
              console.error( 'Error verifying refresh token:', error.stack );
              return res.status( 403 ).json( { message: 'Invalid or expired refresh token' } );
       }
} );

// Logout Route
router.post( '/logout', async ( req, res ) =>
{
       const refreshToken = req.cookies.refresh_token;

       if ( refreshToken )
       {
              try
              {
                     // Revoke refresh token in database
                     await db.execute( 'UPDATE refresh_tokens SET is_revoked = 1 WHERE refresh_token = ?', [
                            refreshToken,
                     ] );
              } catch ( error )
              {
                     console.error( 'Error revoking refresh token:', error.stack );
              }
       }

       // Clear cookies
       res.clearCookie( 'access_token', {
              path: '/',
              httpOnly: process.env.NODE_ENV === 'production',
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
       } );
       res.clearCookie( 'refresh_token', {
              path: '/',
              httpOnly: process.env.NODE_ENV === 'production',
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
       } );

       res.status( 200 ).json( { message: 'Logged out successfully' } );
} );

// API Routes
app.use( '/api', [ userRoutes, loginRoutes, checkToken, router ] );

// Error Handling Middleware
app.use( ( err, req, res, next ) =>
{
       console.error( err.stack );
       res.status( err.statusCode || 500 ).json( {
              message: err.message || 'Internal Server Error',
              error: process.env.NODE_ENV === 'production' ? {} : err.stack,
       } );
} );

// Start server
const PORT = process.env.PORT || 5000;
app.listen( PORT, () =>
{
       console.log( `Server is running on port ${ PORT }` );
} );