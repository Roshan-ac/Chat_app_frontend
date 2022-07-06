/*

         Hello folks i'm creating realtime chat application using Jquery and plain html,css. 
         I've been working on this project since 1 week, during these days i made this project
         so far, and there is more things left for making these project cool and interactive.
         To be honest i'll gratefull for all contributers and always welcome you geek people
         for contribute some cool stuffs on these project
         
                                                                 Author: Roshan acharya [aka Cyber-geek]
*/





// ................All code goes from here.................................
// start...........

// Global variable declearation containing socket url,and ringtone for outgoins and incomming messages 
// const socket = io('http://192.168.1.65:3000/')
const socket =io('https://connect-me-server.herokuapp.com/')
const outgoing = new Audio('../assets/outgoing.mp3')
const incoming = new Audio('../assets/incoming.mp3')
var SenderName = ""
var SenderEmail = "";


// Retreving Data from localStroge which was stored after successfull authenticate
if (localStorage.getItem('user')) {
    const authData = JSON.parse(localStorage.getItem('user'))
    const { Name, Email } = authData
    SenderName = Name;
    SenderEmail = Email;
    socket.emit('NewUser', Name, Email)
}
else {
    window.location.href = '../index.html'
}





//..............Handling socket event................................. 
socket.on('UserConnected', user => {
    appendUser(user);
})
socket.on('UserList', (userlist) => {
    appendUserList(userlist)
    console.log('someone conected')
})

socket.on('Request_Join', (Name, Id) => {
    handle_user_Connection(Name, Id)
})

socket.on('connected', (Name, Id) => {
    console.log(Name,Id);
    appendChatting(Name,Id,"true");
})



// Handling user proper connection for establish chatting functionality
function handle_joined_chat(ReceiverId){
    const SenderId = $('.userName').find('input').attr('id')
    socket.emit('UserChatRequest', { SenderName: SenderName, SenderId: SenderId, ReceiverId: ReceiverId })
}

// receving message

socket.on('receive', (data) => {
    const { message, Name } = data;
    appendMessage(message, Name, 'incoming');
})


// All function code start from here

// function defination for appending new user to the intial DOM

function appendUser(user) {
    const { username, id } = user;
    // Dom manupulation
    $('.loader').remove()
    $('.user-section').css('display', 'block')
    $('.userName').html(`<h4>${username}</h4><input hidden id=${id}></input>`)

}

// function defination for appending all user connected in socket to the intial DOM
function appendUserList(userlist) {
    const ownId = $('.userName').find('input').attr('id')
    let arr = userlist
    for (let index = 0; index < arr.length; index++) {
        let user = arr[index];
        if (user.id == ownId) {
            arr.splice(index, 1)
        }
    }

    $('.userList').html(`${arr.map(user => `<div id=${user.id} class="friends" onclick="handle_joined_chat(this.id)"><img src="../assets/upload.png"/><h4>${user.username}</h4><input hidden id=${user.id}></input></div>`).join('')}`)

}


function handle_user_Connection(Name, Id) {
    handle_user_state(Name, Id).then((state) => {
        if (state) {
            appendChatting(Name, Id, state);
            const SenderId = $('.userName').find('input').attr('id')
            socket.emit('request_accepted', SenderName, SenderId, Id);
        }
    })
}



function appendChatting(Name, Id, state) {
    $('.message-window').css('display', 'block')
    $('.Name').html(`<h4>${Name}</h4><input hidden id=${Id} conection=${state} />`)
}

function handle_user_state(Name, Id) {
    return new Promise((resolve, reject) => {
        alert(`${Name} wants to chat with you`)
        if (alert) {
            resolve(true)
        } else {
            reject(false)
        }
    })
}





//  Code for Messaging Functionality

$('.form_input').on('submit', (e) => {
    e.preventDefault()
    const message = $('#Messageinp').val()
    $('#Messageinp').val('')
    const receiverId = $('.Name').find('input').attr('id')
    if (message) {
        socket.emit('Message', message, receiverId, SenderName);
        appendMessage(message, 'you', 'outgoing')
        outgoing.play()
    }
})


function appendMessage(message, whom, state) {
    $('.chats').append(`
    <div class="message_body">
<div class="message ${state}">
    <h5>${whom}</h5>
    <p>${message}</p>
</div>
</div>`)
if(state=="incoming"){
    incoming.play()
}
var MessageBody=document.querySelector('.chats')
MessageBody.scrollTop = MessageBody.scrollHeight
}