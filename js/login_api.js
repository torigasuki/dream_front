import {login} from './api.js';

window.onload = async function(){
    document.getElementById('login').addEventListener('click', async function(){
        login();
    })
}

