const socket = io('http://192.168.1.65:3000/')

//Client side handling
const mainContainer = document.querySelector('.main-container')
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





const outgoing = new Audio('../assets/outgoing.mp3')
const incoming = new Audio('../assets/incoming.mp3')


const userInfo = localStorage.getItem('user')
const userData = JSON.parse(userInfo)
const name = userData.Name;
const emailaddr = userData.Email









form_input.addEventListener('submit', (e)=> {
    e.preventDefault()
    const Messageinp = document.getElementById('Messageinp')
    const message = Messageinp.value
    const userName=document.querySelector('.Name')
    const str=userName.children[1].defaultValue
    const id=str.replace('/','')
    if (message) {
        socket.emit('Message', message,id);
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

socket.on('connection', (state) => {
    message_window.style.display = 'block'
    usersection.style.display = 'block'
    let loader = document.getElementsByClassName('loader user-section-loader')
    if (loader) {
        mainContainer.removeChild(mainContainer.firstElementChild)
        mainContainer.removeChild(mainContainer.children[1])
    }

})






















// // Make connection to socketio
socket.emit('New-user-joined', name, emailaddr);
socket.on('user-joined', (name,id) => {

    alert(`${name} want to chat with you`)
    if(alert) {
        append(`Now you can call each other`, name)
        appendChatHead(name,id)
    }

})

socket.on('receive', data => {
    // console.log(data)
    appendMessage(data.message, "Roshan", 'incoming')
})


socket.on('user_list', user => {
    let arr = user
    let self={}
    for (let index = 0; index < arr.length; index++) {
        const user = arr[index];
        if (user.username == name) {
           self=user
            arr.splice(index, 1)
        }
    }
    let hyper=`<h4>${self.username}</h4>
    <input type="text" hidden value=${self.id}/>
    `
    userName.innerHTML =hyper
    user_list.innerHTML = `${arr.map(user => `<div id=${user.id} onclick=handle_join_chat(this.id) class="friends">
    <img src="../assets/upload.png"/>
    <h4>${user.username}</h4>
    </div>`).join('')}`

})




socket.on('left', username => {
    append(`${username} left the chat`)
})




function handle_join_chat(id) {
    const div=document.getElementById(id)
    const Name= div.children[1].innerText

    appendChatHead(Name,id)
    const str=userName.children[1].defaultValue
    const ids=str.replace('/','')
    console.log(name,id)
     socket.emit('Joined_Chat',name,ids,id);
    }


function appendChatHead(name,id){
    const userName=document.querySelector('.Name')
    if(userName.children[1]){
        userName.removeChild[1]
    }
    // if(!userName.children[1]){
let hyper=`<h4>${name}</h4>
<input type="text" hidden value=${id}/>
`
userName.innerHTML=hyper

}