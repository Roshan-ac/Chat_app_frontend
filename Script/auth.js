// global Variables
var url='https://connect-me-server.herokuapp.com'
// var url='http://192.168.1.65:3000'



$('.message a').click(function () {
    $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
});








$(".login-form").on('submit', (e) => {
    e.preventDefault();
    var username = $('#UserName').val()
    var password = $('#Password').val()

    const UserObj = {
        name: username,
        password: password
    }

    User_login(UserObj)
})


$(".register-form").on('submit', (e) => {
    e.preventDefault()
    var username = $('#username').val()
    var emailaddress = $('#emailaddress').val()
    var password = $('#password').val()

    const UserObj = {
        name: username,
        email: emailaddress,
        password: password
    }

    Signup_handler(UserObj);
})


async function Signup_handler(UserObj) {
    const user = await fetch(`${url}/api/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(UserObj)
    })
    const json = await user.json()
    if (json.success) {
        $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
    }
}




async function User_login(UserObj) {
    const user = await fetch(`${url}/api/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(UserObj)
    })
    const json = await user.json()
    localStorage.setItem('user', JSON.stringify(json))
    if (json) {
        window.location.href = "./pages/chat.html";
    }
}












