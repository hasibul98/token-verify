const express = require( 'express' );
const router = express.Router();
const jwt = require( 'jsonwebtoken' );
require( 'dotenv' ).config();
const db = require( '../config/db.config.js' );

router.get( '/verify', async ( req, res ) =>
{
       const authHeader = req.headers.authorization;

       if ( !authHeader )
       {
              return res.status( 401 ).json( { message: 'Unauthorized' } );
       }

       const token = authHeader.split( ' ' )[ 1 ];

       try
       {
              const decoded = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET );

              // OPTIONAL: Database থেকে revoked check করতে পারো যদি চাও
              // const [rows] = await db.execute('SELECT is_revoked FROM refresh_tokens WHERE refresh_token = ?', [token]);
              // if (rows.length === 0 || rows[0].is_revoked) {
              //      return res.status(403).json({ message: 'Token is revoked' });
              // }

              res.status( 200 ).json( { valid: true, user: decoded } );
       } catch ( err )
       {
              return res.status( 403 ).json( { message: 'Invalid or expired token' } );
       }
} );

module.exports = router;
