
const apiBaseURL = "https://microbloglite.herokuapp.com";


// References to HTML elements
const postForm = document.getElementById("postForm");
const postsContainer = document.getElementById("posts");
const logoutBtn = document.getElementById("logoutBtn");
const recentBtn = document.getElementById("recent");
const createPostInput = document.getElementById("createPost");

const imghidden = document.getElementById("imghidden");
const input = document.getElementById("addimg");



// emoji group
let emojiGroup=[]
let emojisTag = document.getElementById("emojis").getElementsByTagName("img");
for(dom of emojisTag ){ //replace dom loop
  let _this=dom;
  dom.addEventListener("click",function(){
    //console.log(_this.id)
    document.getElementById("createPost").value+=("%"+_this.id+"%")
  })
  let tempemj={}
  tempemj.emojiName=dom.id
  tempemj.src=dom.src

  emojiGroup.push(tempemj)
}

// Check if the user is logged in
const userLoggedIn = loggedIn();
// the page work normal if the user login
if (userLoggedIn) {
  // Event listeners
  recentBtn.addEventListener("click", () => {//recent button to refresh the post
    fetchRecentPosts().then((data) => {
     // console.log(data);
      updateUI(data);
    });
  });

  logoutBtn.addEventListener("click", logout);

  // Retrieve recent posts and update UI
  fetchRecentPosts().then((data) => {
    //console.log(data);
    updateUI(data);
  });
  

  // Add event listener for form submission to create post
  postForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const postContent = createPostInput.value;
    createPost(postContent);
  });

  // Function to update the UI with posts
  function updateUI(allPosts) {

    //filter the post only for our website
    let posts=allPosts.filter(post=>{
      if((new RegExp(/.*donut/)).test(post.username)){
        post.username=post.username.substr(0,post.username.length-5);
        //console.log(post.username)
        return post
      }
    })

    //using forEach to loop and display the posts
    postsContainer.innerHTML = "";
    posts.forEach((post) => {
      const { text, likes, username, createdAt, _id } = post;
  
      let contentHtml = ""

      if(text.split("data:image").length==1){ //means no image been choose
        //console.log(text)
        contentHtml=`<p>${text.replaceAll("<","&lt;").replaceAll(">","&rt;").replace("data:image","")}</p>` //avoid comment have html style to effect our own html
      }else{//there is image been choose
       // console.log(text)
        let textMain=text.split("data:image")[0]; //using "data:image" to separate so the base64 can read the url of the image
        let textImg=text.split("data:image")[1];
        
        //if emoji use 
          contentHtml=`<p>${textMain.replaceAll("<","&lt;").replaceAll(">","&rt;")}</p>`
            +(textImg!=undefined?`<br><img src="data:image${textImg}">`:"")
      }

        for(e of emojiGroup){//using for of to change the emoji text(id) back to emoji image
          let emj=e
        let eName=emj.emojiName
        contentHtml=contentHtml.replaceAll("%"+eName+"%",`<img width=25 height=25 src="${emj.src}" class="emoji ${emj.id}"/>`)
      }
      
      const postDiv = document.createElement("div");
      postDiv.className = "post";

      const postContent = document.createElement("div");
      postContent.className = "post-content";
      postContent.innerHTML = contentHtml;

      const postDetails = document.createElement("div");
      postDetails.className = "post-details";
      postDetails.innerHTML = `<span class="post-likes">${likes.length} likes</span> | <span class="post-author">${username}</span> | <span class="post-date">${createdAt}</span>`;

      const likeBtn = document.createElement("button");
      likeBtn.id = "like*"+_id;
      likeBtn.addEventListener("click", () => likePost(post));
      likeBtn.textContent = "";
      likeBtn.classList.add("like-button");
      

      const dislikeBtn = document.createElement("button");
      dislikeBtn.id ="dislike*"+ _id;
      dislikeBtn.addEventListener("click", () => dislikePost(post));
      dislikeBtn.textContent = "";
      dislikeBtn.classList.add("dislike-button");
      

      const deleteBtn = document.createElement("button");
      deleteBtn.id = "delete*"+ _id;
      deleteBtn.addEventListener("click", () => deleteUserPost(post));
      deleteBtn.textContent = "";
      deleteBtn.classList.add("delete-button");
      

      postDiv.appendChild(postContent);
      postDiv.appendChild(postDetails);
      postDiv.appendChild(likeBtn);
      postDiv.appendChild(dislikeBtn);
      postDiv.appendChild(deleteBtn);

      postsContainer.appendChild(postDiv);

    });
  };


} else {
  window.location.assign("./login.html");//send back to the login page
}
  

//for adding image to the post
if (typeof FileReader === "undefined") { //check able to use the fileReader
  alert("This browser not support FileReader");
  input.setAttribute("disabled", "disabled");
  } else {
  input.addEventListener("change", function(){
    let file = this.files[0]
    try{
        if (!/image\/\w+/.test(file.type)) { //checking the file type
          alert("Image only!");
          return false;
        }
    
        let reader = new FileReader(); //set a fileReader object
        reader.readAsDataURL(file); //using readAsDataURL to read the image url
        reader.onload = function(e) {
          imghidden.value=this.result;//get the image base url so can use base64 to convert to image
          console.log(this.result);
        }

    }catch(e){
      imghidden.value="";//give blank if no image been choose
    }

    }, false);//if able to use, run the readFile function
    
  }


// Helper function to check if the user is logged in
function loggedIn() {
  const loginJSON = window.localStorage.getItem("login-data");
  return JSON.parse(loginJSON) || null;
};

// Logout function
function logout() {
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
function filterByMostLikes(posts) {
  return posts.sort((a, b) => b.likes.length - a.likes.length);
};

// Function to fetch posts
function fetchPosts() {
  if (loggedIn() !== null) {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedIn().token}`,
      },
    };

    return fetch(apiBaseURL + "/api/posts?limit=2000&offset=0", options)
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error fetching posts:", error);
        return [];
      });
  } else {
    return Promise.resolve([]);
  }
};

// Function to fetch recent posts
function fetchRecentPosts() {
  return fetchPosts().then((data) => {
    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  });
}

// Function to like a post
function likePost(post) {
  if (loggedIn() !== null) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedIn().token}`,
      },
      body: JSON.stringify({
        postId: post._id,
      }),
    };

    fetch(apiBaseURL + "/api/likes", options)
    .then(()=>{
      recentBtn.click()
    });
  }
};

// Function to dislike a post
function dislikePost(post) {
  if (loggedIn() !== null) {
    const likeToDelete = post.likes.find(
      (like) => like.username === loggedIn().username
    );

    if (likeToDelete) {
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedIn().token}`,
        },
      };

      fetch(apiBaseURL + `/api/likes/${likeToDelete._id}`, options)
      .then(()=>{
        recentBtn.click()
      });
  }
  }
};

// Function to delete a post
function deletePost(post) {
  if (loggedIn() !== null) {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedIn().token}`,
      },
    };

    fetch(apiBaseURL + `/api/posts/${post._id}`, options)
    .then(()=>{
      recentBtn.click()
    });
  }
};

// Function to delete user's own post
function deleteUserPost(post) {
  if (loggedIn() !== null && loggedIn().username === (post.username+"donut")) {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedIn().token}`,
      },
    };

    fetch(apiBaseURL + `/api/posts/${post._id}`, options)
    .then(_=>{
      recentBtn.click()
    });
  }
};

// Function to create a post
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
        //console.log("New post created:", data);
        createPostInput.value = "";
        recentBtn.click()
        

      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  } else {
    console.error("User is not logged in. Cannot create post.");
  }
  
};



