const express = require( 'express' );
const cors = require( 'cors' );
const cookieParser = require( 'cookie-parser' );
const bodyParser = require( 'body-parser' );
const userRoutes = require( './routes/user.route' );
const loginRoutes = require( './routes/login.route' );
require( 'dotenv' ).config();
const dbconfig = require( './config/db.config' );

const app = express();
app.use( cors() );
app.use( cookieParser() );

app.use( bodyParser.json() );
app.use( '/api', userRoutes );
app.use( '/api', loginRoutes );







app.listen( process.env.PORT, () => { console.log( 'server is running at 5000 port' ); } );