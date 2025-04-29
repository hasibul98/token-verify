import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create( {
       baseURL: 'http://localhost:5000/api',
       withCredentials: true,
} );

// Add Authorization Header
api.interceptors.request.use(
       ( config ) =>
       {
              const token = Cookies.get( 'accessToken' );
              if ( token )
              {
                     config.headers.Authorization = `Bearer ${ token }`;
              }
              return config;
       },
       ( error ) => Promise.reject( error )
);

// Handle Response Errors
api.interceptors.response.use(
       ( response ) => response,
       async ( error ) =>
       {
              const originalRequest = error.config;

              // Skip refresh request itself
              if ( originalRequest.url.includes( '/refresh' ) )
              {
                     return Promise.reject( error );
              }

              if ( ( error.response?.status === 401 || error.response?.status === 403 ) && !originalRequest._retry )
              {
                     originalRequest._retry = true;

                     try
                     {
                            const res = await api.get( '/refresh' );
                            const newAccessToken = res.data.accessToken;

                            Cookies.set( 'accessToken', newAccessToken, { expires: 1 } );

                            originalRequest.headers.Authorization = `Bearer ${ newAccessToken }`;
                            return api( originalRequest );
                     } catch ( refreshError )
                     {
                            console.error( 'Refresh token invalid or expired.' );

                            Cookies.remove( 'accessToken' );
                            Cookies.remove( 'refreshToken' );

                            window.location.href = '/login'; // <- Force Redirect
                            return Promise.reject( refreshError );
                     }
              }

              return Promise.reject( error );
       }
);

export default api;
