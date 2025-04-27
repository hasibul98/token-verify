import React from 'react';
import { Link } from 'react-router';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
       display: flex;
       flex-direction: row;
       margin-top: 40px;
       margin-left: 20px;
`;
const Anchor = styled( NavLink )`
       font-size: 20px;
       margin: 10px;
       text-decoration: none;
       color: rgb(90, 150, 30);
       font-family: cursive;
       font-weight: 600;
       margin-bottom: 80px;
        &.active{
              color: rgb(180, 30, 30);
        }
`;

function NavbarMenu ()
{
       return (
              <Nav>
                     <Anchor to='/signup' > Sign up </Anchor>
                     <Anchor to='/login' > Login </Anchor>
                     <Anchor to='/home' > Home </Anchor>
                     <Anchor to='/logout' > Logout </Anchor>
              </Nav>

       );
}

export default NavbarMenu;