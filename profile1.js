"use strict";

// init vars here
const loginData = loggedIn();
const currentUser = loginData.username;
const userFullName = document.getElementById("fullName");
const userCreationDate = document.getElementById("createdAt");
const signoutBtn = document.getElementById("signoutBtn");
const bio = document.getElementById("bio");
const fullNameInput = document.getElementById("fullNameInput");
const bioInput = document.getElementById("bioInput");
const saveEditsBtn = document.getElementById("editSaveBtn");


window.addEventListener("load", function () {
    displayPost();
    moreInfo();
    signoutBtn.onclick = function () {
        logout();
    };
    saveEditsBtn.onclick = updateProfile;
    document.getElementById("postBtn").onclick = postBtnOnClick;
    document.getElementById("name").innerHTML = "@" + currentUser;
  


});

// Update Profile when Edit Profile Saved
function updateProfile(event) {
    event.preventDefault();

    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginData.token}`,
        },
        body: JSON.stringify({
            bio: bioInput.value,
            fullName: fullNameInput.value,
        }),
    };
    fetch(
        "https://microbloglite.herokuapp.com/" + "api/users/" + loginData.username,
        options
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setTimeout(function () {
                location.reload();
            }, 1000); // Refreshes the page.
        });
}

// Grab Full Name
function moreInfo() {
    fetch(`https://microbloglite.herokuapp.com/api/users/${loginData.username}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${loginData.token}`,
            "Content-type": "application/json; charset=UTF-8",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            userFullName.innerHTML = data.fullName;
            bio.innerHTML = data.bio;
            
        });
}

// Display Posts
function displayPost() {
    fetch(
        `https://microbloglite.herokuapp.com/api/posts?username=${currentUser}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${loginData.token}`,
                "Content-type": "application/json; charset=UTF-8",
            },
        }
    )
        .then((response) => response.json())
        .then((data) => {
            let currentUserPosts = data.filter(
                (post) => post.username === currentUser
            );

            currentUserPosts.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            let displayPost = document.getElementById("recentPost");
            let postsHTML = "";
            for (let i = 0; i < currentUserPosts.length; i++) {
                let post = currentUserPosts[i];
                postsHTML += ` <div class="row">
          <div class="card mb-3" style="max-width: auto;">
              <div class="card-body">
                  <h4 class="card-title"><svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                </svg><span id="cardName">${post.username
                    }</span>  <span style="color: #999999; font-size: small;">posted on: ${monthDayYear(
                        post.createdAt
                    )}</span></h4>
                  <p class="card-text">${post.text}</p>
              </div>
              <div class="card-footer bg-transparent">
                  <div class="btn-group" role="group" aria-label="Basic mixed styles example" style="width: 100%;">
                      <button type="button" class="btn likeBtn" style="width: 33.3%;">
                          <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                  fill="currentColor" class="bi bi-hand-thumbs-up"
                                  viewBox="0 0 16 16">
                                  <path
                                      d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
                              </svg>
                              ${post.likes.length}
                          </span>
                      </button>
                      <button type="button" class="btn deleteBtn" style="width: 33.3%;">
                    <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path
                        d="M4.5 5.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm1.5 0a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7zm3 0a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" />
                    <path
                        d="M1.5 3.5a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5zm2.297-.357A.5.5 0 0 0 3 3.5h1v9a.5.5 0 0 0 .854.354l1.647-1.237h3.005l1.647 1.237a.5.5 0 0 0 .854-.354v-9h1a.5.5 0 0 0 .5-.5.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5.5.5 0 0 0 .5.5z" />
                </svg> Delete
                    </span>
                </button>
                  </div>
              </div>
          </div>
      </div>
          `;
            }
            displayPost.innerHTML = postsHTML;
        });
}

function postBtnOnClick() {
    let textToPost = inputElement.value;
    let data = { text: textToPost };

    let options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginData.token}`,
        },
    };

    fetch("https://microbloglite.herokuapp.com/api/posts", options).then(
        (response) => {
            console.log(data);
            if (response.ok) {
                inputElement.value = "";
                setTimeout(function () {
                    location.reload();
                }, 1000); // Refreshes the page.
            }
        }
    );
}

/* auth.js provides LOGIN-related functions */

"use strict";

const api = "https://microbloglite.herokuapp.com";


// You can use this to get the login data of the logged-in user (if any). 
// Returns either an object including the username and token,
// or an empty object if the visitor is not logged in.
function getLoginData () {
    return JSON.parse(window.localStorage.getItem("login-data")) || {};
}



// You can use this to see whether the current visitor is logged in. 
// Returns either `true` or `false`.
function isLoggedIn () {
    const loginData = getLoginData();
    return Boolean(loginData.token);
}


// This function is already being used in the starter code for the
// landing page, in order to process a user's login. READ this code,
// and feel free to re-use parts of it for other `fetch()` requests
// you may need to write.
function login (loginData) {
    // POST /auth/login
    const options = { 
        method: "POST",
        headers: {
            // This header specifies the type of content we're sending.
            // This is required for endpoints expecting us to send
            // JSON data.
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    };

    return fetch(api + "/auth/login", options)
        .then(response => response.json())
        .then(loginData => {
            window.localStorage.setItem("login-data", JSON.stringify(loginData));
            window.location.assign("post.html");  // redirect
        });
}


// This is the `logout()` function you will use for any logout button
// which you may include in various pages in your app. Again, READ this
// function and you will probably want to re-use parts of it for other
// `fetch()` requests you may need to write.
function logout () {
    const loginData = getLoginData();

    // GET /auth/logout
    const options = { 
        method: "GET",
        headers: { 
            // This header is how we authenticate our user with the
            // server for any API requests which require the user
            // to be logged-in in order to have access.
            // In the API docs, these endpoints display a lock icon.
            Authorization: `Bearer ${loginData.token}`,
        },
    };

    fetch(api + "/auth/logout", options)
        .then(response => response.json())
        .then(data => console.log(data))
        .finally(() => {
            // We're using `finally()` so that we will continue with the
            // browser side of logging out (below) even if there is an 
            // error with the fetch request above.

            window.localStorage.removeItem("login-data");  // remove login data from LocalStorage
            window.location.assign("index.html");  // redirect to landing page
        });
}