const { error } = require( 'console' );
const { createUser } = require( '../models/user.model' );

async function signUp ( req, res )
{
       const { userName, fullName, email, password } = req.body;
       if ( !userName || !fullName || !email || !password )
       {
              return res.status( 400 ).json( { error: 'all input required' } );
       }
       try
       {
              const result = await createUser( userName, fullName, email, password );
              if ( result.error )
              {
                     return res.status( 400 ).json( result );
              }
              res.status( 201 ).json( result );
       } catch ( error )
       {
              res.status( 500 ).json( { error: 'internal server error' } );
       }
}

module.exports = { signUp };