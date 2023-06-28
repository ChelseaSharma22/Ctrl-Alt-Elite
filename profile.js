
const apiBaseURL = "https://microbloglite.herokuapp.com";


// References to HTML elements
const postForm = document.getElementById("postForm");
const postsContainer = document.getElementById("posts");
const logoutBtn = document.getElementById("logoutBtn");
const recentBtn = document.getElementById("recent");
const createPostInput = document.getElementById("createPost");


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
const currentUser = loginData.username;
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


//my code 













//Check if the user is logged in
const userLoggedIn = loggedIn();

 if (userLoggedIn) {
//   // Event listeners
//  recentBtn.addEventListener("click", () => {
//   fetchRecentPosts().then((data) => {
//        console.log(data);
//       updateUI(data);
//     });
//  });

   logoutBtn.addEventListener("click", logout);


   
 

//   // Retrieve recent posts and update UI
//   fetchRecentPosts().then((data) => {
//     console.log(data);
//     updateUI(data);
//   });
  

//   // Add event listener for form submission
//   postForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const postContent = createPostInput.value;
//     createPost(postContent);
//   });

//   // Function to update the UI with posts
//   const updateUI = (allPosts) => {

//     let posts=allPosts.filter(post=>{
//       if((new RegExp(/.*donut/)).test(post.username)){
//         post.username=post.username.substr(0,post.username.length-5);
//         //console.log(post.username)
//         return post
//       }
//     })

//     // if(isShowAll){
//     //   posts=allPosts
//     // }
//     postsContainer.innerHTML = "";

//     posts.forEach((post) => {
//       const { text, likes, username, createdAt, _id } = post;

//       const postDiv = document.createElement("div");
//       postDiv.className = "post";

//       const postContent = document.createElement("div");
//       postContent.className = "post-content";
//       postContent.innerHTML = `<p>${text.replaceAll("<","&lt;").replaceAll(">","&rt;")}</p>`;

//       const postDetails = document.createElement("div");
//       postDetails.className = "post-details";
//       postDetails.innerHTML = `<span class="post-likes">${likes.length} likes</span> | <span class="post-author">${username}</span> | <span class="post-date">${createdAt}</span>`;

//       const likeBtn = document.createElement("button");
//       likeBtn.id = "like*"+_id;
//       likeBtn.addEventListener("click", () => likePost(post));
//       likeBtn.textContent = "Like";

//       const dislikeBtn = document.createElement("button");
//       dislikeBtn.id ="dislike*"+ _id;
//       dislikeBtn.addEventListener("click", () => dislikePost(post));
//       dislikeBtn.textContent = "Dislike";

//       const deleteBtn = document.createElement("button");
//       deleteBtn.id = "delete*"+ _id;
//       deleteBtn.addEventListener("click", () => deleteUserPost(post));
//       deleteBtn.textContent = "Delete";

//       postDiv.appendChild(postContent);
//       postDiv.appendChild(postDetails);
//       postDiv.appendChild(likeBtn);
//       postDiv.appendChild(dislikeBtn);
//       postDiv.appendChild(deleteBtn);

//       postsContainer.appendChild(postDiv);

//     });
//   };


} else {
  window.location.assign("./login.html");
}
  

function createPost(content) {
  //store img data

   let imgBase64=imghidden.value

  if(imghidden.value==""){
    combineContent=content;
  }
  else {
    combineContent = content +imgBase64
  }
  
  imghidden.value="";
  input.value="";
  if (loggedIn() !== null) {
    const requestBody = {
      text: combineContent,
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