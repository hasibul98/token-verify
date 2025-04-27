const bcrypt = require( 'bcryptjs' );
const connection = require( '../config/db.config' );


async function createUser ( userName, fullName, email, password )
{
       const db = connection;
       const hashedPassword = await bcrypt.hash( password, 10 );

       try
       {
              await db.query( 'INSERT INTO users (userName, fullName, email, password) VALUES(?,?,?,?)', [ userName, fullName, email, hashedPassword ] );
              return { message: 'user registered successfully' };
       } catch ( error )
       {
              if ( error.code === 'ER_DUP_ENTRY' )
              {
                     if ( error.sqlMessage.includes( 'userName' ) )
                     {
                            return { error: 'user name alrady exists' };
                     } else if ( error.sqlMessage.includes( 'email' ) )
                     {
                            return ( { error: "Email already exists" } );
                     }
              }
              return { error: 'An unexpected error occurred' };
       }



}

module.exports = { createUser };