import React, { useState } from 'react';
import styled from 'styled-components';
import '../index.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InputContaienr = styled.div`
       margin: 30px;
       display: flex;
       flex-direction: row;
`;
const Label = styled.label`
       margin-right: 50px;
`;

const InputInnerDiv = styled.div`
       margin-left: 20px;
       margin-right: 20px;
       padding-left: 20px;
       padding-right: 20px;
       /* border: 2px solid red; */
       width: 150px;
       display: flex;
       flex-direction: row;
       align-items: center;
       /* justify-content: center; */
       
       
`;
const Input = styled.input`
       width: 300px;
       height: 30px;
       margin-left: 50px;
       outline: none;
       color: rgb(120, 0, 240);
       font-size: 20px;
       background-color: rgb(90, 210, 240);
       &:hover{
              background-color: rgb(120, 120, 60);
       }
       &:focus{
              height: 40px;
       }
       
`;
const Checkboxinput = styled.input`
       width: 40px !important;
       height: 40px !important;
       flex-shrink: 0; /* Flexbox এর সংকোচন বন্ধ করবে */
       
`;


function SignUpForm ()
{
       // console.log( useNavigate() );
       const [ user, setUser ] = useState( { userName: '', fullName: '', email: '', password: '' } );
       const [ showPassword, setShowPassword ] = useState( { show: false, text: '' } );

       const toggleShowPassword = () =>
       {
              setShowPassword( ( prevState ) => ( {
                     show: !prevState.show,

              } ) );
       };

       const handleChange = ( e ) =>
       {
              const { name, value } = e.target;
              setUser( { ...user, [ name ]: value } );
              // console.log( user );



       };
       const navigate = useNavigate();
       const handleSubmit = async ( e ) =>
       {
              e.preventDefault();
              if ( !user.userName )
              {
                     alert( 'User Name is required.' );
                     return;
              }
              if ( !user.fullName )
              {
                     alert( 'Full Name is required.' );
                     return;
              }
              if ( !user.email )
              {
                     alert( 'Email is required.' );
                     return;
              }
              if ( !user.password )
              {
                     alert( 'Password is required.' );
                     return;
              }
              // console.log( user );
              try
              {
                     const res = await axios.post( 'http://localhost:5000/api/signup', user );
                     console.log( res );
                     alert( res.data.message );
                     navigate( '/login' );

              } catch ( error )
              {
                     const errorMsg = error.response?.data?.error || "something went wrong";
                     alert( "Error:" + errorMsg );
              }

       };

       return (
              <div>
                     <form onSubmit={ handleSubmit }>
                            <InputContaienr className='input-container'>
                                   <InputInnerDiv className='InputInnerDiv'>
                                          <Label htmlFor='userName'>user name:</Label>

                                   </InputInnerDiv>
                                   <InputInnerDiv className='InputInnerDiv'>
                                          <Input type="text" id='userName' name='userName' onChange={ handleChange } value={ user.userName } />
                                   </InputInnerDiv>

                            </InputContaienr>
                            <InputContaienr className='input-container'>

                                   <InputInnerDiv className='InputInnerDiv'><Label htmlFor='FullName'>Full Name:</Label></InputInnerDiv>
                                   <InputInnerDiv className='InputInnerDiv'><Input type="text" id='FullName' name='fullName' onChange={ handleChange } value={ user.fullName } /></InputInnerDiv>

                            </InputContaienr>
                            <InputContaienr className='input-container'>
                                   <InputInnerDiv className='InputInnerDiv'><Label htmlFor='email'>Email:</Label></InputInnerDiv>
                                   <InputInnerDiv className='InputInnerDiv'> <Input type="email" id='email' name='email' onChange={ handleChange } value={ user.email } /></InputInnerDiv>


                            </InputContaienr>
                            <InputContaienr className='input-container'>
                                   <InputInnerDiv className='InputInnerDiv'><Label htmlFor='password'>password:</Label></InputInnerDiv>
                                   <InputInnerDiv className='InputInnerDiv'><Input type={ showPassword.show ? 'text' : "password" } id='password' name='password' onChange={ handleChange } value={ user.password } />
                                          <Checkboxinput type='checkbox' onChange={ toggleShowPassword } checked={ showPassword.show } /> { showPassword.show ? 'hide' : 'show' }
                                   </InputInnerDiv>


                            </InputContaienr>
                            <InputContaienr className='input-container'>

                                   <InputInnerDiv className='InputInnerDiv'><Input type='submit' id='Submit' onChange={ handleChange } value='signUp' />

                                   </InputInnerDiv>


                            </InputContaienr>

                     </form>
              </div>
       );
}

export default SignUpForm;