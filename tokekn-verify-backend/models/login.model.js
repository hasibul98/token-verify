const connection = require( '../config/db.config' );

const findUserByEmail = async ( email ) =>
{
       const query = `SELECT * FROM users WHERE email = ?`;
       const [ results ] = await connection.execute( query, [ email ] );
       return results[ 0 ];
};

module.exports = { findUserByEmail };