import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const LogoutButton = () =>
{
       const navigate = useNavigate();

       const handleLogout = async () =>
       {
              try
              {
                     await axios.post( 'http://localhost:5000/api/logout', {}, { withCredentials: true } );
                     navigate( '/login' );
              } catch ( error )
              {
                     console.error( 'Logout error:', error );
              }
       };

       const deleteCookie = ( name ) =>
       {
              document.cookie = `${ name }=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
       };

       return (
              <button onClick={ handleLogout } style={ { padding: '10px 20px', cursor: 'pointer' } }>
                     Logout
              </button>
       );
};

export default LogoutButton;