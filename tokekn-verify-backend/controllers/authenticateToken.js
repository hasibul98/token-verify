const jwt = require( 'jsonwebtoken' );
require( 'dotenv' ).config();

const authenticateToken = ( req, res, next ) =>
{
       const token = req.headers[ 'authorization' ]?.split( ' ' )[ 1 ];
       if ( !token ) return res.status( 401 ).json( { message: 'Access Token Required' } );

       jwt.verify( token, process.env.ACCESS_TOKEN_SECRET, ( err, user ) =>
       {
              if ( err ) return res.status( 403 ).json( { message: 'Invalid Token' } );
              req.user = user;
              next();
       } );
};

module.exports = authenticateToken;