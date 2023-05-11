import {boardView,injectNavbar} from './api.js'

window.onload = async function(){
    injectNavbar()
    boardView();
    const BOARD_TYPE = location.href.split('?')[1].split('=')[1].split('#')[0]
    document.getElementById("write").setAttribute("href",`http://127.0.0.1:5500/html/write.html?board=${BOARD_TYPE}`)
}