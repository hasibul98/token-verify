import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from '../axios';

const PrivateRoute = ( { children } ) =>
{
       const navigate = useNavigate();
       const [ isLoading, setIsLoading ] = useState( true );
       const [ isAuthenticated, setIsAuthenticated ] = useState( false );

       useEffect( () =>
       {
              const checkToken = async () =>
              {
                     const accessToken = Cookies.get( 'access_token' );

                     if ( !accessToken )
                     {
                            setIsLoading( false );
                            return navigate( '/login' );
                     }

                     try
                     {
                            const response = await api.get( '/check-token', {
                                   withCredentials: true, // Send cookies with request
                            } );

                            if ( response.data.is_revoked === 1 )
                            {
                                   setIsAuthenticated( false );
                                   return navigate( '/login' );
                            }

                            setIsAuthenticated( true );
                     } catch ( error )
                     {
                            console.error( 'Error checking token:', error.message );
                            navigate( '/login' );
                     } finally
                     {
                            setIsLoading( false ); // Ensure loading state is updated
                     }
              };

              checkToken();
       }, [ navigate ] );

       // Show loading state while checking token
       if ( isLoading )
       {
              return <div>Loading...</div>;
       }

       // Render children if authenticated, otherwise redirect to login
       return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;