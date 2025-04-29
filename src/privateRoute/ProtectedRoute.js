// components/ProtectedRoute.jsx

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../axios'; // তোমার axios setup
import Cookies from 'js-cookie';

const ProtectedRoute = ( { children } ) =>
{
       const [ isLoading, setIsLoading ] = useState( true );
       const [ isAuthenticated, setIsAuthenticated ] = useState( false );
       const location = useLocation();

       useEffect( () =>
       {
              const verifyToken = async () =>
              {
                     const token = Cookies.get( 'accessToken' );

                     if ( !token )
                     {
                            setIsAuthenticated( false );
                            setIsLoading( false );
                            return;
                     }

                     try
                     {
                            const response = await api.get( '/verify' ); // backend এ যাচ্ছি
                            if ( response.data.valid )
                            {
                                   setIsAuthenticated( true );
                            } else
                            {
                                   setIsAuthenticated( false );
                            }
                     } catch ( error )
                     {
                            console.error( 'Token verification failed:', error );
                            setIsAuthenticated( false );
                     } finally
                     {
                            setIsLoading( false );
                     }
              };

              verifyToken();
       }, [] );

       if ( isLoading )
       {
              return <div>Loading...</div>; // তুমি চাইলে সুন্দর Loader component দিতে পারো
       }

       return isAuthenticated ? children : <Navigate to="/login" replace state={ { from: location } } />;
};

export default ProtectedRoute;
