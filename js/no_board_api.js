import {boardView,injectNavbar,logout,navbar} from './api.js'


window.onload = async function(){
    await injectNavbar()
    boardView();
    const BOARD_TYPE = location.href.split('?')[1].split('=')[1].split('#')[0]
    document.getElementById("write").setAttribute("href",`http://127.0.0.1:5500/html/write.html?boardtype=${BOARD_TYPE}`)
    await navbar()
    if(localStorage.getItem('access')){
        document.getElementById('logout').addEventListener('click', async function(){
            logout();
        })
    }
}