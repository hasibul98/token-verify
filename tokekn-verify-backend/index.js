const express = require( 'express' );
const cors = require( 'cors' );
const cookieParser = require( 'cookie-parser' );
const bodyParser = require( 'body-parser' );
const userRoutes = require( './routes/user.route' );
const loginRoutes = require( './routes/login.route' );
require( 'dotenv' ).config();
const jwt = require( 'jsonwebtoken' );

const authenticateToken = require( './controllers/authenticateToken' );


const app = express();
const morgan = require( 'morgan' );
app.use( morgan( 'combined' ) );
const helmet = require( 'helmet' );
app.use( helmet( {
       contentSecurityPolicy: false, // যদি আপনার অ্যাপ্লিকেশনে ইনলাইন স্ক্রিপ্ট থাকে
} ) );
app.use( cors( {
       origin: process.env.CLIENT_URL || 'http://localhost:3000',
       credentials: true,
} ) );
app.use( cookieParser() );

app.use( bodyParser.json() );
app.use( '/api', userRoutes );
app.use( '/api', loginRoutes );


app.post( '/api/refresh', ( req, res ) =>
{
       const refreshToken = req.cookies.refreshToken;
       if ( !refreshToken )
       {
              return res.status( 401 ).json( { message: 'Refresh Token is missing. Please log in again.' } );
       }

       jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET, ( err, user ) =>
       {
              if ( err )
              {
                     return res.status( 403 ).json( { message: 'Invalid Refresh Token. Please log in again.' } );
              }

              const newAccessToken = jwt.sign( { id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' } );
              res.json( { accessToken: newAccessToken } );
       } );
} );

const rateLimit = require( 'express-rate-limit' );
const limiter = rateLimit( {
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 100, // Limit each IP to 100 requests per windowMs
} );
app.use( limiter );


app.use( ( err, req, res, next ) =>
{
       console.error( err.stack );
       res.status( err.status || 500 ).json( {
              message: err.message || 'Internal Server Error',
              error: process.env.NODE_ENV === 'production' ? {} : err.stack,
       } );
} );


app.post( '/api/logout', ( req, res ) =>
{
       res.clearCookie( 'accessToken', { path: '/', httpOnly: true, secure: false, sameSite: 'Strict' } );
       res.clearCookie( 'refreshToken', { path: '/', httpOnly: true, secure: false, sameSite: 'Strict' } );
       res.status( 200 ).json( { message: 'Logged out successfully' } );
} );




app.listen( process.env.PORT, () => { console.log( 'server is running at 5000 port' ); } );