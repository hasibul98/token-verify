const express = require( 'express' );
const cors = require( 'cors' );
const router = express.Router();
const cookieParser = require( 'cookie-parser' );
const bodyParser = require( 'body-parser' );
const userRoutes = require( './routes/user.route' );
const loginRoutes = require( './routes/login.route' );
const authRoute = require( './routes/auth.route.js' );
const verifyRoute = require( './routes/verifyToken.route.js' );

require( 'dotenv' ).config();
const jwt = require( 'jsonwebtoken' );
const db = require( './config/db.config.js' );



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
app.use( '/api', router );
app.use( bodyParser.json() );
app.use( '/api', authRoute );
app.use( '/api', verifyRoute );
app.use( '/api', userRoutes );
app.use( '/api', loginRoutes );


router.get( '/refresh', async ( req, res ) =>
{
       const refreshToken = req.cookies.refreshToken;

       if ( !refreshToken )
       {
              return res.status( 401 ).json( { message: 'Unauthorized' } );
       }

       try
       {
              const [ rows ] = await db.execute(
                     'SELECT is_revoked FROM refresh_tokens WHERE refresh_token = ?',
                     [ refreshToken ]
              );

              if ( rows.length === 0 || rows[ 0 ].is_revoked )
              {
                     return res.status( 403 ).json( { message: 'Refresh token is revoked' } );
              }

              const user = jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET );
              const newAccessToken = jwt.sign(
                     { id: user.id, userName: user.userName, email: user.email },
                     process.env.ACCESS_TOKEN_SECRET,
                     { expiresIn: '18m' }
              );

              res.status( 200 ).json( { accessToken: newAccessToken } );
       } catch ( err )
       {
              console.error( err );
              res.status( 403 ).json( { message: 'Invalid or expired refresh token' } );
       }
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