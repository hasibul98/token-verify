const express = require( 'express' );
const router = express.Router();
const { signUp } = require( '../controllers/user.controller' );



router.post( '/signup', signUp );



module.exports = router;





