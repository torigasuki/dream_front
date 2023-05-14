import {login} from './api.js';

window.onload = async function(){
    document.getElementById('login').addEventListener('click', async function(){
        login();
    })
    document.getElementById('kakao').addEventListener('click', async function(){
        const kakao_id = '055c93384e5e1b3418c5cb85bafa4b5d' 
        const redirect_uri = 'http://127.0.0.1:5500/html/main.html'
        window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_id}&redirect_uri=${redirect_uri}&response_type=code`
        
    })
}

