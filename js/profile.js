
const apiBaseURL = "https://microbloglite.herokuapp.com";


// References to HTML elements
const postForm = document.getElementById("postForm");
const postsContainer = document.getElementById("posts");
const logoutBtn = document.getElementById("logoutBtn");
const recentBtn = document.getElementById("recent");
const createPostInput = document.getElementById("createPost");
const imghidden = document.getElementById("imghidden");


// Helper function to check if the user is logged in
const loggedIn = () => {
  const loginJSON = window.localStorage.getItem("login-data");
  return JSON.parse(loginJSON) || null;
};

// Logout function
const logout = () => {
  const loginData = loggedIn();

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  };

  fetch(apiBaseURL + "/auth/logout", options)
    .then((response) => response.json())
    .then((data) => console.log(data))
    .finally(() => {
      window.localStorage.removeItem("login-data");
      window.location.assign("login.html");
    });
};

// Function to sort posts by most likes
const filterByMostLikes = (posts) => {
  return posts.sort((a, b) => b.likes.length - a.likes.length);
};


//my code
const loginData = loggedIn();
console.log(loginData);
const currentUser = loginData.username.substr(0,loginData.username.length-5);
const userFullName = document.getElementById("fullName");
const userCreationDate = document.getElementById("createdAt");
const signoutBtn = document.getElementById("signoutBtn");
const bio = document.getElementById("bio");
const fullNameInput = document.getElementById("fullNameInput");
const bioInput = document.getElementById("bioInput");
const saveEditsBtn = document.getElementById("editSaveBtn");

const ProfileName = document.getElementById("ProfileName");


window.addEventListener("load", function () {
    moreInfo();
   
    saveEditsBtn.onclick = updateProfile;
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
            ProfileName.innerHTML = data.fullName;
            
        });
}



//Check if the user is logged in
const userLoggedIn = loggedIn();

 if (userLoggedIn) {


   logoutBtn.addEventListener("click", logout);


   
 



} else {
  window.location.assign("./login.html");
}
  

function createPost(content) {
  //store img data

  //  let imgBase64=imghidden.value

  // if(imghidden.value==""){
  //   combineContent=content;
  // }
  // else {
  //   combineContent = content +imgBase64
  // }
  
  // imghidden.value="";
  // input.value="";
  if (loggedIn() !== null) {
    const requestBody = {
      text: content,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedIn().token}`,
      },
      body: JSON.stringify(requestBody),
    };

    fetch(apiBaseURL + "/api/posts", options)
      .then((response) => response.json())
      .then((data) => {
        console.log("New post created:", data);
        createPostInput.value = "";
       
        window.location.href= "post.html";

      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  } else {
    console.error("User is not logged in. Cannot create post.");
  }
  
};

postForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const postContent = createPostInput.value;
  createPost(postContent);
  
});
 


