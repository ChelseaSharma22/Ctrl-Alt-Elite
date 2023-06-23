"use strict";

// declear and assign variables
const $ = document.querySelectorAll.bind(document);
const registerForm = $("#registerform")[0];

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
        "username": userName,
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
    alert(`You have created the account with ${result.userName}`);
    console.log(result);

    // Redirect to the login page
    window.location.href = "login.html";
  })
  .catch(error => console.log('error', error));
    }
})
