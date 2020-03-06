// import config from 'config';
// import { authHeader } from '../_helpers';

export const userService = {
    login,
    logout
};

function login(username, password) {

    return fetch('http://localhost:3001/users/authenticate',
    {
        method: 'post',
        crossDomain:true,
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(responseJson => {
        console.log(" --------------" + responseJson);
        // user.authdata = window.btoa(username + ':' + password);
        localStorage.setItem('user', JSON.stringify(responseJson));
    });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}