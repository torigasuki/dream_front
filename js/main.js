const FRONT_BASE_URL = "http://127.0.0.1:5500"
function movepage(data){
    window.location.href = `${FRONT_BASE_URL}/html/no_board.html?boardtype=${data.innerText}`
}

if (localStorage.getItem("payload")){
}
 else if (location.href.split('=')[1]){
    const kakao_code = new URLSearchParams(window.location.search).get('code')
    kakaoLoginApi(kakao_code)
}
async function kakaoLoginApi(kakao_code) {
    const response = await fetch(`http://127.0.0.1:8000/users/kakao/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"code":kakao_code}),
    })
    response_json = await response.json()
    if (response.status === 200) {    
        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(function (c) {
                return '%' + (
                    '00' + c.charCodeAt(0).toString(16)
                ).slice(-2);
            }).join('')
        );
        localStorage.setItem("payload", jsonPayload);
        localStorage.setItem("access", response_json.access); 
        localStorage.setItem("refresh", response_json.refresh);
    }else {
        alert(response_json['error'])
        window.history.back()
}}