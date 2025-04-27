const jwt = require( 'jsonwebtoken' );

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRATION = '15m';
const REFRESH_TOKEN_EXPIRATION = '7d';
const JWT_ALGORITHM = 'HS256';

module.exports = { JWT_SECRET, ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION, JWT_ALGORITHM };



