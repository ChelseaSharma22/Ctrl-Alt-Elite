"use strict";

// declear and assign variables
const $ = document.querySelectorAll.bind(document);
const registerForm = $("#registerform")[0];
const displayUpdate = $("#displayupdate")[0];
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const fullName = $("#fullname")[0].value;
    const userName = $("#username")[0].value;
    const setPassword = $("#password")[0].value;
    const rePassword = $("#repassword")[0].value;

    if (setPassword === rePassword) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
        "fullName": fullName,
        "username": userName + "donut",
        "password": setPassword
        });

        

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://microbloglite.herokuapp.com/api/users", requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.username===undefined){
                displayUpdate.innerHTML = `<p>error msg ${result.message}</p>`;
                console.log(result);

            }else{
                displayUpdate.innerHTML = `<p>You user name is ${result.username.substr(0,result.username.length-5)}, you will be redirect to the login page soon</p>`;
                setTimeout(() => {
                    window.location.href = "login.html";// Redirect to the login page
                }, 4000); 
            }

            
        })
        .catch(error => console.log('error', error));
    }
})
