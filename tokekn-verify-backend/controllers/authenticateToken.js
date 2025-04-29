const jwt = require( 'jsonwebtoken' );
const db = require( '../config/db.config.js' );

const authenticateToken = async ( req, res, next ) =>
{
       const authHeader = req.headers[ 'authorization' ];
       const token = authHeader && authHeader.split( ' ' )[ 1 ];

       if ( !token ) return res.status( 401 ).json( { message: 'Access Token missing' } );

       try
       {
              const decoded = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET );

              // Check if the user's refresh token is revoked
              const [ rows ] = await db.execute(
                     'SELECT is_revoked FROM refresh_tokens WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
                     [ decoded.id ]
              );

              if ( rows.length === 0 || rows[ 0 ].is_revoked )
              {
                     return res.status( 401 ).json( { message: 'Session expired. Please log in again.' } );
              }

              req.user = decoded; // Save decoded user info in request
              next(); // Proceed to the next middleware or route handler
       } catch ( err )
       {
              return res.status( 403 ).json( { message: 'Invalid Access Token' } );
       }
};

module.exports = authenticateToken;