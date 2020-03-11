import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function isTokenValid(token) {
  return fetch('http://localhost:3000/verify', {
      method: "POST",
      crossDomain:true,
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify({ token })
  })
  .then((resp) => {
     return resp.status == 200? true : false;
  })
  .catch((error) => {
    console.log(error, "catch the hoop")
    return false;
  })
}

export const PrivateRoute = ({ component: Component, ...rest }) => (
  
    <Route {...rest} render={props => (
            localStorage.getItem('token') 
              && isTokenValid(localStorage.getItem('token')).then()
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)