import {injectNavbar,boardWrite,logout,navbar} from './api.js'

window.onload = async function(){
    await injectNavbar()
    document.getElementById('write').addEventListener('click', async function(){
        boardWrite();
    })
    document.getElementById('cancel').addEventListener('click', async function(){
        history.back();
    })

    navbar()
    if(localStorage.getItem('access')){
        document.getElementById('logout').addEventListener('click', async function(){
            logout();
        })
    }
}