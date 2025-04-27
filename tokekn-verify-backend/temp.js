// Token generators
const generateAccessToken = ( user ) =>
{
       return jwt.sign( { id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' } );
};
const generateRefreshToken = ( user ) =>
{
       return jwt.sign( { id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' } );
};

// Login route
app.post( '/api/login', ( req, res ) =>
{
       const { email, password } = req.body;

       db.query( 'SELECT * FROM users WHERE email = ?', [ email ], async ( err, results ) =>
       {
              if ( err || results.length === 0 ) return res.status( 401 ).json( { msg: 'Invalid credentials' } );

              const user = results[ 0 ];
              const match = await bcrypt.compare( password, user.password );
              if ( !match ) return res.status( 401 ).json( { msg: 'Wrong password' } );

              const accessToken = generateAccessToken( user );
              const refreshToken = generateRefreshToken( user );

              res.cookie( 'refreshToken', refreshToken, {
                     httpOnly: true,
                     sameSite: 'strict',
                     secure: false // Set true in production with HTTPS
              } );

              res.json( { accessToken } );
       } );
} );
