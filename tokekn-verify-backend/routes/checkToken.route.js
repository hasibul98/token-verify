const express = require( 'express' );
const router = express.Router();
const db = require( '../config/db.config' );
const jwt = require( 'jsonwebtoken' );
require( 'dotenv' ).config();

router.get( '/check-token', async ( req, res ) =>
{
       try
       {
              const refreshToken = req.cookies.refresh_token;

              // Check if refresh token exists
              if ( !refreshToken )
              {
                     return res.status( 401 ).json( { error: 'Refresh token is missing in cookies.' } );
              }

              // Verify JWT refresh token
              try
              {
                     jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET );
              } catch ( jwtError )
              {
                     console.error( '[check-token] JWT verification error:', jwtError.message );
                     return res.status( 403 ).json( { error: 'Invalid or expired refresh token.' } );
              }

              // Check token in database
              const query = 'SELECT is_revoked FROM refresh_tokens WHERE refresh_token = ?';
              const [ rows ] = await db.execute( query, [ refreshToken ] );

              if ( rows.length === 0 )
              {
                     return res.status( 404 ).json( { error: 'Refresh token not found in database.' } );
              }

              const isRevoked = rows[ 0 ].is_revoked;

              return res.status( 200 ).json( { is_revoked: isRevoked } );
       } catch ( error )
       {
              console.error( '[check-token] Database or server error:', error.stack );
              return res.status( 500 ).json( { error: 'Internal server error while checking token.' } );
       }
} );

module.exports = router;