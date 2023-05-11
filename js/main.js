const FRONT_BASE_URL = "http://127.0.0.1:5500"
function movepage(data){
    window.location.href = `${FRONT_BASE_URL}/html/no_board.html?boardtype=${data.innerText}`
}