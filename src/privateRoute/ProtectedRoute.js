import React from 'react';
import { Navigate } from 'react-router-dom';

const getCookie = ( name ) =>
{
       const value = `; ${ document.cookie }`;
       const parts = value.split( `; ${ name }=` );
       if ( parts.length === 2 ) return parts.pop().split( ';' ).shift();
       return null;
};

const ProtectedRoute = ( { children } ) =>
{
       const accessToken = getCookie( 'accessToken' ); // কুকি থেকে টোকেন পড়া

       return accessToken ? children : <Navigate to='/login' />;


};

export default ProtectedRoute;