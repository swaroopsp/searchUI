// import config from 'config';
// import { authHeader } from '../_helpers';

export const userService = {
    login,
    logout
};

function login(username, password) {
    return fetch('http://localhost:3000/loginOAuth',
    {
        method: 'post',
        crossDomain:true,
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(responseJson => {
        localStorage.setItem('token', responseJson.token);
    });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
}