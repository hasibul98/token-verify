import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DivContainer = styled.div`
       display: flex;
       flex-direction: column;
       margin-left: 50px;
`;

const DivWrapper = styled.div`
       margin-bottom: 20px;
       display: flex;
       flex-direction: row;
       align-items: center;
`;

const Input = styled.input`
width: 300px;
height: 30px;
&:focus{
       outline: none;
}

`;


const InputCheckbox = styled.input.attrs( { type: 'checkbox' } )`
        -moz-appearance: none; /* Firefox এর জন্য */
       -webkit-appearance: none; /* Chrome/Safari এর জন্য */
       -o-appearance: none; /* Opera এর জন্য */
       appearance: none; /* অন্যান্য ব্রাউজারের জন্য */
       width: 50px ;
       height: 50px ;
       /* background-color: darkblue !important; */
       /* color: white; */
       /* accent-color: red; */
       flex-shrink: 0;
       border: .5px solid black; 
       cursor: pointer; 

       &:checked {
              background-color: green; /* চেক করা হলে ব্যাকগ্রাউন্ড রঙ */
              border-color: blue; /* চেক করা হলে বর্ডার রঙ */
       }

       &:checked::after {
              content: '✔'; /* চেক মার্ক */
              color: white; /* চেক মার্কের রঙ */
              font-size: 30px;
              display: flex;
              justify-content: center;
              align-items: center;
       }

       
`;

const Button = styled.button`
       width: 150px;
       height: 40px;
       background-color: rgb(0, 0, 240);
       color: rgb(0, 180, 0);
       font-size: 24px;
       cursor: pointer;
       &:hover{
              color: rgb(30, 0, 60);
              background-color: rgb(0, 180, 240);
       }

`;




function Login ()
{
       const [ loginData, setLoginData ] = useState( { email: '', password: '' } );
       const [ show, setShow ] = useState( false );
       const [ token, setToken ] = useState( null );

       const togglePaaword = () =>
       {
              setShow( !show );
       };

       const handleChange = ( e ) =>
       {
              const { name, value } = e.target;
              setLoginData( { ...loginData, [ name ]: value } );
              // console.log( loginData );
       };
       const navigate = useNavigate();

       const handleSubmit = async ( e ) =>
       {
              e.preventDefault();

              try
              {
                     const response = await axios.post( 'http://localhost:5000/api/login', loginData, {
                            withCredentials: true,
                     } );

                     // লগইন সফল হলে হোম পেজে রিডাইরেক্ট
                     navigate( '/home' );
              } catch ( error )
              {
                     console.error( 'Login error:', error );
              }
       };

       return (
              <form onSubmit={ handleSubmit }>
                     <DivContainer>
                            <DivWrapper>
                                   <Input type="email" placeholder='type email' name='email' onChange={ handleChange } />
                            </DivWrapper>
                            <DivWrapper>
                                   <Input type={ show ? 'text' : 'password' } placeholder='type password' name='password' onChange={ handleChange } />
                                   <InputCheckbox type="checkbox" onChange={ togglePaaword } /> { show ? "hide" : 'show' }
                            </DivWrapper>
                            <DivWrapper>
                                   <Button type='submit'>Login</Button>

                            </DivWrapper>
                     </DivContainer>
              </form>

       );
}

export default Login;