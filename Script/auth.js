

const formSubmit = document.querySelector('.formSubmit');
formSubmit.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.querySelector('.UserName').value;
    const email = document.querySelector('.Email').value;
    const password = document.querySelector('.Password').value;
    const UserObj = {
        name: username,
        email: email,
        password: password
    }

    User_login(UserObj)
})



async function Signup_handler() {
    const user = await fetch('http://192.168.1.65:3000/api/signup', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(UserObj)
    })
  
}




async function User_login(UserObj) {
    const user = await fetch('http://192.168.1.65:3000/api/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(UserObj)
    })
const json = await user.json()
localStorage.setItem('user',JSON.stringify(json))
    if(json){
        window.location.href = "./pages/chat.html";
    }
}












