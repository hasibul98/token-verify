import React from 'react';
import styled from 'styled-components';

const DivContainer = styled.div`
       display: flex;
       flex-direction: column;
       margin-left: 50px;
`;

const DivWrapper = styled.div`
       margin: 20px;
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

const InputCheckbox = styled.input`
       width: 50px ;
       height: 50px ;
       background-color: red !important;
       flex-shrink: 0;
       border: 2px solid  red !important ; 
       cursor: pointer; 

       
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
       return (
              <DivContainer>
                     <DivWrapper>
                            <Input type="email" placeholder='type email' />
                     </DivWrapper>
                     <DivWrapper>
                            <Input type="password" placeholder='type password' />
                            <InputCheckbox type="checkbox" />
                     </DivWrapper>
                     <DivWrapper>
                            <Button type='submit'>Login</Button>

                     </DivWrapper>
              </DivContainer>
       );
}

export default Login;