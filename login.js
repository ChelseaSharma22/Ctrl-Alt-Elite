

"use strict";

const loginForm = document.querySelector("#loginForm");
const loginButton = loginForm.querySelector("#loginBtn");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const loginData = {
    username: loginForm.querySelector("#username").value,
    password: loginForm.querySelector("#password").value,
  };

  loginButton.disabled = true;

  login(loginData)
    .then(() => {
      loginButton.disabled = false;
    })
    .catch((error) => {
      console.error(error);
      // display an error message
      loginButton.disabled = false;
    });
});

function login(loginData) {
  const apiBaseURL = "https://microbloglite.herokuapp.com";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  };

  return fetch(apiBaseURL + "/auth/login", options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Login failed. Please try again.");
      }
      return response.json();
    })
    .then((responseData) => {
      window.localStorage.setItem("login-data", JSON.stringify(responseData));
      window.location.assign("post.html"); // redirect
    });
}
