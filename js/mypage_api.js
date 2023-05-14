import {mypage} from './api.js'

if (localStorage.getItem('access')==null){
    window.location.href = `http:127.0.0.1:5500/html/login.html`
}

window.onload = async function(){
    mypage();
}