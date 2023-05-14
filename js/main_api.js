import {boardAllView,injectNavbar,logout,navbar} from './api.js'
window.onload = async function(){
    await boardAllView()
    await injectNavbar()
    await navbar()
    if(localStorage.getItem('access')){
        document.getElementById('logout').addEventListener('click', async function(){
            logout();
        })
    }
}