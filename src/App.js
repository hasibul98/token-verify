import logo from './logo.svg';
import './App.css';
import { Route, Router, BrowserRouter, Routes, Link } from 'react-router';
import SignUpForm from './userForm/SignUpForm';
import Login from './userForm/Login';
import NavbarMenu from './component/NavbarMenu';
import ProtectedRoute from './privateRoute/ProtectedRoute';
import Home from './privatePage/Home';
import LogoutButton from './LogoutButton';
function App ()
{
  return (

    <BrowserRouter>
      {/* Navbar */ }
      <NavbarMenu />

      {/* Routes */ }

      <Routes>
        <Route path='/signup' element={ <SignUpForm /> } />
        <Route path='/login' element={ <Login /> } />
        <Route
          path='/home'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path='/logout' element={ <LogoutButton /> } />
      </Routes>
    </BrowserRouter>


  );
}

export default App;
