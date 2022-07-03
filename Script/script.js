const socket = io('https://connect-me-server.herokuapp.com/')



// var socket = io('http://192.168.1.65:3000/')

//Client side handling
const mainContainer=document.querySelector('.main-container')
const form_input = document.querySelector('.form_input')
const MessageBody = document.querySelector(".chats")
const user_list = document.querySelector(".userList")
const user_count = document.querySelector('.count')
const Main = document.querySelector(".Main");
const user_login = document.querySelector('.userlogin')
const roomName = document.querySelector('.roomName')
const admin_div = document.querySelector('.admin');
const userName = document.querySelector(".userName");
const usersection = document.querySelector('.user-section');
const message_window = document.querySelector('.message-window');



if(!socket.connected){
    message_window.style.display='none'
    usersection.style.display='none'

}

const outgoing = new Audio('../assets/outgoing.mp3')
const incoming = new Audio('../assets/incoming.mp3')
var userinfo = {
    userName: "",
    roomName: ""
}





// retreving input parameters values from url 
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('username');
const roomname = urlParams.get('roomname');




form_input.addEventListener('submit', function (e) {
    e.preventDefault()
    const Messageinp = document.getElementById('Messageinp')
    const message = Messageinp.value
    if (message) {
        socket.emit('Message', message);
        appendMessage(message, 'you', 'outgoing')
        outgoing.play()
        Messageinp.value = ""
    }

})


const append = (message) => {
    const MessageElem = document.createElement('div')
    MessageElem.classList.add("user-joined")
    const para = document.createElement('h5')
    para.innerText = message
    MessageElem.appendChild(para)
    MessageBody.append(MessageElem)
    MessageBody.scrollTop = MessageBody.scrollHeight
    outgoing.play()
}

const appendMessage = (message, name, state) => {
    const MessageElem = document.createElement('div');
    MessageElem.classList.add('message_body');

    const hyper = `
<div class="message ${state}">
    <h5>${name}</h5>
    <p>${message}</p>
</div>`

    MessageElem.innerHTML = hyper
    MessageBody.append(MessageElem)

    if (state == "incoming") {
        incoming.play()
    }

    MessageBody.scrollTop = MessageBody.scrollHeight
}



socket.on('connection',(state)=>{
    message_window.style.display='block'
    usersection.style.display='block'
    let loader=document.getElementsByClassName('loader user-section-loader')
    mainContainer.removeChild(mainContainer.firstElementChild)
    mainContainer.removeChild(mainContainer.children[1])
 
})



// Make connection to socketio
socket.emit('join-room', username, roomname);
socket.on('user-joined', name => {
    append(`${name} joined the chat`, name)
})

socket.on('receive', data => {
    appendMessage(data.message, data.username, 'incoming')

})

socket.on('roomUser', ({ room, user }) => {

    let arr = user
    for (let index = 0; index < arr.length; index++) {
        const user = arr[index];
        if (user.username == username) {
            arr.splice(index, 1)
        }
    }
    let room_name = `<h4>${room}</h4>`
    userName.innerHTML = username
    roomName.innerHTML = room_name
    user_list.innerHTML = `${arr.map(user => `<div class="friends">
    <img src="../assets/upload.png"/>
    <h4>${user.username}</h4>
    </div>`).join('')}`
    
})




socket.on('left', username => {
    append(`${username} left the chat`)
})









