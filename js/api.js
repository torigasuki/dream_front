const BACK_BASE_URL = "http://127.0.0.1:8000"
const FRONT_BASE_URL = "http://127.0.0.1:5500"
// const BOARD_TYPE = new URLSeatchParams(window.location.search).get('board_type')
// const BOARD_ID = new URLSeatchParams(window.location.search).get('board_id')

export async function injectNavbar(){
    fetch(`${FRONT_BASE_URL}/html/navbar.html`).then(response=>{
        return response.text()
    })
    .then(data=>{
        document.querySelector("header").innerHTML = data;
    })
    let navbarHtml = await fetch(`${FRONT_BASE_URL}/html/navbar.html`)
    let data = await navbarHtml.text()
    document.querySelector("header").innerHTML = data;
}
export function navbar(){
    if(localStorage.getItem('access')){
        document.getElementById('signup_href').remove()
        document.getElementById('login_href').remove()

        const payload = JSON.parse(localStorage.getItem('payload'))
        const nickname = payload.nickname
        const user = document.createElement('li')
        user.setAttribute('class','user')
        const user_a = document.createElement('a')
        user_a.innerText = `${nickname}님 안녕~`
        user.appendChild(user_a)
        
        const logout = document.createElement('li')
        logout.setAttribute('class','user')
        const logout_a = document.createElement('a')
        logout_a.setAttribute('id','logout')
        logout_a.innerText = '로그아웃'
        logout.appendChild(logout_a)
       

        document.getElementById('navbar').appendChild(logout)
        document.getElementById('navbar').appendChild(user)
    }
}
export async function login(){
    const url = `${BACK_BASE_URL}/users/login/`
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    
    const response = await fetch(url,{
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body: JSON.stringify({
            'email':email,
            'password':password,
        })
    })
    if(response.status == 200){
        const response_json = await response.json()
        localStorage.setItem('refresh',response_json.refresh)
        localStorage.setItem('access',response_json.access)
        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''))
        localStorage.setItem('payload', jsonPayload)
        window.location.replace(`${FRONT_BASE_URL}/html/main.html`)
    }
}
export async function signup(){
    const url= `${BACK_BASE_URL}/users/signup/`
    const email = document.getElementById("email").value
    const nickname = document.getElementById("nickname").value
    
    const emailconfirm = document.getElementById("emailconfirm").value
    const password = document.getElementById("password").value
    const cpassword = document.getElementById("cpassword").value

    if(cpassword != password){
        alert("비밀번호가 일치하지 않습니다.")
    }
    else{
        const response = await fetch(url,{
            headers:{
                'Content-Type':'application/json'
            },
            method:'POST',
            body:JSON.stringify({
                'email':email,
                'password':password,
                'nickname':nickname,
                "code":emailconfirm
            })
        })
        if(response.status == 201){
            window.location.replace(`${FRONT_BASE_URL}/html/login.html`)
        }
    }
}
export async function emailconfirm(){
    const url = `${BACK_BASE_URL}/users/sendmail/`
    const email = document.getElementById("email").value
    console.log(email)
    const response = await fetch(url,{
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({
            'email':email
        }),
    })
    console.log(response)
}
export function logout(){
    localStorage.removeItem('refresh')
    localStorage.removeItem('access')
    localStorage.removeItem('payload')
    window.location.replace(`${FRONT_BASE_URL}/html/login.html`)
}
export async function boardAllView(){
    const url = `${BACK_BASE_URL}/boards/`
    const response = await fetch(url,{
        headers:{
            'Content-Type':'application/json',
        },
        method:'GET'
    })
    if(response.status == 200){
        const response_json = await response.json()
        response_json.forEach(board => {
            const createdAt = new Date(board.created_at).toISOString();
            const date = createdAt.slice(0, 10);
            const time = createdAt.slice(11, 16);
            const today = new Date().toISOString().slice(0, 10);
            const dateText = (date === today) ? time : date;

            const board_wrap = document.createElement('tr')
            board_wrap.setAttribute('class','list')
            
            const board_num = document.createElement('td')
            board_num.innerText = board.pk

            const board_title = document.createElement('td')
            const board_title_a = document.createElement('a')
            board_title_a.innerText = board.title
            board_title_a.setAttribute('href',`${FRONT_BASE_URL}/html/board.html?board_id=${board.pk}`)
            board_title.appendChild(board_title_a)

            const board_writer = document.createElement('td')
            board_writer.innerText = board.user

            const board_date = document.createElement('td')
            board_date.innerText = dateText

            const check = document.createElement('td')
            check.innerText = 0

            board_wrap.appendChild(board_num)
            board_wrap.appendChild(board_title)
            board_wrap.appendChild(board_writer)
            board_wrap.appendChild(board_date)
            board_wrap.appendChild(check)

            if(board.boardtype == 'BOARDTOAWAKE'){
                document.querySelector('#BOARDTOAWAKE').appendChild(board_wrap)
            }
            else if(board.boardtype == 'BOARDTOSLEEP'){
                document.querySelector('#BOARDTOSLEEP').appendChild(board_wrap)
            }
            else if(board.boardtype == 'BOARDTOHEAL'){
                document.querySelector('#BOARDTOHEAL').appendChild(board_wrap)
            }
        });
    }
}
export async function boardView(){
    const BOARD_TYPE = new URLSearchParams(window.location.search).get('boardtype')
    const url = `${BACK_BASE_URL}/boards/${BOARD_TYPE}/`

    document.getElementById('boardtype').innerText = BOARD_TYPE
    const response = await fetch(url,{
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem('access')}`
        },
        method:'GET'
    })
    if(response.status == 200){
        const response_json = await response.json()
        response_json.forEach(board => {
            const createdAt = new Date(board.created_at).toISOString();
            const date = createdAt.slice(0, 10);
            const time = createdAt.slice(11, 16);
            const today = new Date().toISOString().slice(0, 10);
            const dateText = (date === today) ? time : date;

            const board_wrap = document.createElement('div')
            board_wrap.setAttribute('class','top')
            
            const board_num = document.createElement('div')
            board_num.setAttribute('class','num')
            board_num.innerText = board.pk

            const board_title = document.createElement('div')
            board_title.setAttribute('class','title')
            const board_title_a = document.createElement('a')
            board_title_a.innerText = board.title
            board_title_a.setAttribute('href',`${FRONT_BASE_URL}/html/board.html?board_id=${board.pk}`)
            board_title.appendChild(board_title_a)

            const board_writer = document.createElement('div')
            board_writer.setAttribute('class','writer')
            board_writer.innerText = board.user

            const board_date = document.createElement('div')
            board_date.setAttribute('class','date')
            board_date.innerText = dateText

            const check = document.createElement('div')
            check.setAttribute('class','count')
            check.innerText = 0

            board_wrap.appendChild(board_num)
            board_wrap.appendChild(board_title)
            board_wrap.appendChild(board_writer)
            board_wrap.appendChild(board_date)
            board_wrap.appendChild(check)
            document.getElementById('board_list').appendChild(board_wrap)


        });
    }
}
export async function boardWrite(){
    const BOARD_TYPE = new URLSearchParams(window.location.search).get('boardtype')
    const title = document.getElementById('title').value
    const content = document.getElementById('content').value
    const url = `${BACK_BASE_URL}/boards/`
    console.log(BOARD_TYPE)
    const response = await fetch(url,{
        headers : {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem('access')}`
        },
        method:'POST',
        body:JSON.stringify({
            'title':title,
            'content':content,
            'boardtype':BOARD_TYPE

        })
    })
    if(response.status == 200){
        window.location.href = `${FRONT_BASE_URL}/html/no_board.html?boardtype=${BOARD_TYPE}`
    }
}
export async function mypage(){
    const payload = JSON.parse(localStorage.getItem('payload')).nickname
    document.getElementById('name').innerText = payload
    const response = await fetch(`${BACK_BASE_URL}/users/`,{
        headers:{
            'Authorization':`Bearer ${localStorage.getItem('access')}`
        },
        method:'GET'
    })
    const response_json = await response.json()
    const post_count = response_json.length
    const element = document.getElementById('postcount')
    element.innerText = post_count
    response_json.forEach(board => {
        const createdAt = new Date(board.created_at).toISOString();
            const date = createdAt.slice(0, 10);
            const time = createdAt.slice(11, 16);
            const today = new Date().toISOString().slice(0, 10);
            const dateText = (date === today) ? time : date;

            const board_wrap = document.createElement('tr')
            board_wrap.setAttribute('class','list')
            
            const board_num = document.createElement('td')
            board_num.innerText = board.pk

            const board_title = document.createElement('td')
            const board_title_a = document.createElement('a')
            board_title_a.innerText = board.title
            board_title_a.setAttribute('href',`${FRONT_BASE_URL}/html/board.html?board_id=${board.pk}`)
            board_title.appendChild(board_title_a)

            const board_writer = document.createElement('td')
            board_writer.innerText = board.user

            const board_date = document.createElement('td')
            board_date.innerText = dateText

            const check = document.createElement('td')
            check.innerText = 0

            board_wrap.appendChild(board_num)
            board_wrap.appendChild(board_title)
            board_wrap.appendChild(board_writer)
            board_wrap.appendChild(board_date)
            board_wrap.appendChild(check)
            document.getElementById('myboard').appendChild(board_wrap)
    });
}


export async function mypageput(){
    id = localStorage.getItem('payload').user_id
    const url = `${BACK_BASE_URL}/api/users/${id}/`
    const response = await fetch(url,{
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem('access')}`
        },
        method:'PUT',
        body:JSON.stringify({
            'username':username,
            'nickname':nickname,
            'email':email
        })
    })
}
export async function boardDetail(){
    const url = `${BACK_BASE_URL}/api/boards/${BOARD_TYPE}/${BOARD_ID}/`
    const response = await fetch(url,{
        headers:{
            'Authorization':`Bearer ${localStorage.getItem('access')}`
        },
        method:'GET'
    })
    if(response.status == 200){
        const board = await response.json()
        const board_wrap = document.createElement('div')
        board_wrap.setAttribute('class','board_wrap')
        
        const board_title = document.createElement('div')
        board_title.setAttribute('class','board_title')
        board_title.innerHTML = board.title
        board_wrap.appendChild(board_title)
        /**대충이런식으로 데이터 넣기 */
        const board_content = document.createElement('div')
        board_content.setAttribute('class','board_content')
        board_content.innerHTML = board.content
        board_wrap.appendChild(board_content)

    }
}
export async function boardUpdate(){
    const url = `${BACK_BASE_URL}/api/boards/${BOARD_TYPE}/${BOARD_ID}/`

    const title = document.getElementById('title').value
    const content = document.getElementById('content').value
    const boardtype = document.getElementById('boardtype').value

    const response = await fetch(url,{
        headers:{
            'Content-Type':'application/json',
            "Authorization":`Bearer ${localStorage.getItem('access')}`
        },
        methods:'PUT',
        body:JSON.stringify({
            'title':title,
            'content':content,
            'boardtype':boardtype
        })
    })
    if(response.status == 200){
        window.location.replace(`${BACK_BASE_URL}/board/?board_type=${BOARD_TYPE}&board_id=${BOARD_ID}`)
    }
}
export async function boardDelete(){
    const url = `${BACK_BASE_URL}/api/boards/${BOARD_TYPE}/${BOARD_ID}/`
    const response = await fetch(url,{
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem('access')}`
        },
        method:'DELETE'
    })
    if(response.status == 200){
        window.location.replace(`${BACK_BASE_URL}/board/?board_type=${BOARD_TYPE}`)
    }
}
export async function commentView(){
    const url = `${BACK_BASE_URL}/api/boards/${BOARD_TYPE}/${BOARD_ID}/comments/`
    const response = await fetch(url,{
        headers:{
            'Content-Type':'application/json',
        },
        method:'GET',
    })
    if(response.status == 200){
        const comments = await response.json()
        comments.forEach(comment => {
            comment_id = comment.id
            recomments = recommentView(url,comment_id)
            recomments.forEach(recomment => {
                console.log(recomment)
            });

        });
    }
}
export async function commentWrite(COMMNET_ID){
    const url = `${BACK_BASE_URL}/api/boards/${BOARD_TYPE}/${BOARD_ID}/comments/${COMMNET_ID}`
    const response = await fetch(url,{
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem('access')}`
        },
        method:'POST',
        body:JSON.stringify({
            'content':content
        })
    })
    if(response.status == 201){
        window.location.reload()
    }
}
export async function commentPut(COMMNET_ID){
    const url = `${BACK_BASE_URL}/api/boards/${BOARD_TYPE}/${BOARD_ID}/comments/${COMMNET_ID}`
    const response = await fetch(url,{
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem('access')}`
        },
        method:'PUT',
        body:JSON.stringify({
            'content':content
        })
    })
    if(response.status == 201){
        window.location.reload()
    }
}
export async function commentDelete(COMMNET_ID){
    const url = `${BACK_BASE_URL}/api/boards/${BOARD_TYPE}/${BOARD_ID}/comments/${COMMNET_ID}/`
    const response = await fetch(url,{
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem('access')}`
        },
        method:'DELETE'
    })
    if(response.status == 200){
        window.location.reload()
    }
}
export async function recommentView(url,comment_id){
    const re_response = fetch(`${url}/${comment_id}/re`,{
        headers:{
            'Content-Type':'application/json',
        },
        method:'GET'
    })
    if(re_response.status == 200){
        recomments = await re_response.json()
        return recomments
    }
}
/**게시판 이동시
window.location.href = `${BACK_BASE_URL}/board/?board_type=게시판종류`
window.onload = async function(){
    const urlParams = new URLSearchParams(window.location.search).get('board_type')
}*/
