const mysql = require( 'mysql2/promise' );
require( 'dotenv' ).config(); // .env ফাইল লোড করা

const connection = mysql.createPool( {
       host: process.env.DB_HOST,
       user: process.env.DB_USER,
       password: process.env.DB_PASSWORD,
       database: process.env.DB_NAME,
       waitForConnections: true,
       connectionLimit: 10,
       queueLimit: 0
} );

// পুল তৈরি সফল হলে লগ দেখানোর জন্য
connection.getConnection()
       .then( () =>
       {
              console.log( 'Connected to the database successfully.' );
       } )
       .catch( ( err ) =>
       {
              console.error( 'Database connection failed: ' + err.message );
       } );

module.exports = connection;