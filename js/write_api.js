import {injectNavbar,boardWrite} from './api.js'

window.onload = async function(){
    injectNavbar()
    document.getElementById('write').addEventListener('click', async function(){
        boardWrite(title,content);
    })
    document.getElementById('cancel').addEventListener('click', async function(){
        history.back();
    })
}