

var socket = io('https://connect-me-server.herokuapp.com/')

// var socket = io('http://192.168.1.65:3000/')
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



//Client side handling
const form_input = document.querySelector('.form_input')
const MessageBody = document.querySelector(".chats")
const user_list = document.querySelector("#users-list")
const user_count = document.querySelector('.count')
const Main = document.querySelector(".Main");
const user_login = document.querySelector('.userlogin')
const room_list = document.querySelector('.roomList')
const admin_div=document.querySelector('.admin');
const Room_Name=document.querySelector(".Name");
const usersection=document.querySelector('.user-section');
const message_window=document.querySelector('.message-window');


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



// Make connection to socketio
socket.emit('join-room', username, roomname);

socket.on('user-joined', name => {
    append(`${name} joined the chat`, name)

})

socket.on('receive', data => {
    appendMessage(data.message, data.username, 'incoming')

})

socket.on('roomUser', ({ room, user }) => {
let admin=user[0].username
let html=`<h4>${admin}</h4>`
admin_div.innerHTML=html
let count =user.length
let room_name=`<h4>${room}</h4>`
let hyper=`<h4>${count}</h4>`
user_count.innerHTML=hyper
room_list.innerText=room
Room_Name.innerHTML=room_name
user_list.innerHTML=`${user.map(user=>`<h4>${user.username}</h4>`).join('')}`
})



socket.on('left', username => {
    append(`${username} left the chat`)
})


function videocall(){
socket.emit('stream',data=>{
    console.log(data)
})
}






