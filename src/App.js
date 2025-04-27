import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter, Routes, Link } from 'react-router';
import SignUpForm from './userForm/SignUpForm';
import Login from './userForm/Login';
import NavbarMenu from './component/NavbarMenu';
function App ()
{
  return (
    <BrowserRouter>
      {/* nav bar */ }
      <NavbarMenu />
      {/* Router */ }

      <Routes>
        <Route path='/signup' element={ <SignUpForm /> } />
        <Route path='/login' element={ <Login /> } />

      </Routes>

    </BrowserRouter>

  );
}

export default App;
