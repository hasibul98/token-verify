import axios from 'axios';
import Cookies from 'js-cookie';


const api = axios.create( {
       baseURL: 'http://localhost:5000/api',
       withCredentials: true, // Cookie যাবে
} );


// Add Authorization Header from cookie
api.interceptors.request.use(
       ( config ) =>
       {
              const token = Cookies.get( "accessToken" ); // Cookie থেকে token নিচ্ছি
              if ( token )
              {
                     config.headers.Authorization = `Bearer ${ token }`;
              }
              return config;
       },
       ( error ) => Promise.reject( error )
);

api.interceptors.response.use(
       ( response ) => response,
       async ( error ) =>
       {
              const originalRequest = error.config;


              if ( ( error.response?.status === 401 || error.response?.status === 403 ) && !originalRequest._retry )
              {
                     originalRequest._retry = true;


                     try
                     {
                            const res = await api.get( '/refresh' ); // Cookie থেকে refresh token যাবে
                            const newAccessToken = res.data.accessToken;


                            Cookies.set( "accessToken", newAccessToken, { expires: 1 } ); // Cookie তে নতুন token সেট করা

                            originalRequest.headers.Authorization = `Bearer ${ newAccessToken }`;

                            return api( originalRequest ); // Retry original request
                     } catch ( refreshError )
                     {
                            console.error( "Refresh failed" );
                            Cookies.remove( "accessToken" ); // যদি রিফ্রেশ ফেইল করে, cookie রিমুভ করে দেয়া হবে
                            return Promise.reject( refreshError );
                     }
              }


              return Promise.reject( error );
       }
);

