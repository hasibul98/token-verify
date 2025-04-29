const express = require( 'express' );
const router = express.Router();
const authenticateToken = require( '../controllers/authenticateToken' );

// ✅ Private route - requires access token
router.get( '/user/profile', authenticateToken, ( req, res ) =>
{
       return res.status( 200 ).json( {
              message: 'This is a private user profile',
              user: req.user // comes from access token (middleware)
       } );
} );

module.exports = router;
