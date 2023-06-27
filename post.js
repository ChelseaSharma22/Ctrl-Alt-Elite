const apiBaseURL = "https://microbloglite.herokuapp.com";


// References to HTML elements
const postForm = document.getElementById("postForm");
const postsContainer = document.getElementById("posts");
const logoutBtn = document.getElementById("logoutBtn");
const recentBtn = document.getElementById("recent");
const createPostInput = document.getElementById("createPost");

const imghidden = document.getElementById("imghidden");
const input = document.getElementById("addimg");


/* 
// emoji group
let emojiGroup=[]
let emojisTag = document.getElementById("emojis").getElementsByTagName("img");
for(dom of emojisTag ){ //replace dom loop
  let _this=dom;
  dom.addEventListener("click",function(){
    console.log(_this.id)
    document.getElementById("createPost").value+=("%"+_this.id+"%")
  })
  let tempemj={}
  tempemj.emojiName=dom.id
  tempemj.src=dom.src

  emojiGroup.push(tempemj)
} */

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

// Function to fetch posts
const fetchPosts = () => {
  if (loggedIn() !== null) {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedIn().token}`,
      },
    };

    return fetch(apiBaseURL + "/api/posts", options)
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
const fetchRecentPosts = () => {
  return fetchPosts().then((data) => {
    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  });
}

// Function to like a post
const likePost = (post) => {
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
const dislikePost = (post) => {
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
const deletePost = (post) => {
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
const deleteUserPost = (post) => {
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
const createPost = (content) => {
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
        recentBtn.click()
        

      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  } else {
    console.error("User is not logged in. Cannot create post.");
  }
  
};

// Check if the user is logged in
const userLoggedIn = loggedIn();

if (userLoggedIn) {
  // Event listeners
  recentBtn.addEventListener("click", () => {
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
  

  // Add event listener for form submission
  postForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const postContent = createPostInput.value;
    createPost(postContent);
    // fetchRecentPosts().then((data) => {
    //   //console.log(data);
    //   updateUI(data);
    // }
    posts.forEach((post) => {
      const { text, likes, username, createdAt, _id } = post;

      // let text2=text;
  
      let contentHtml = ""

      if(text.split("data:image").length==1){
        //console.log(text)
        contentHtml=`<p>${text.replaceAll("<","&lt;").replaceAll(">","&rt;").replace("data:image","")}</p>`
      }else{
       // console.log(text)
        let textMain=text.split("data:image")[0];
        let textImg=text.split("data:image")[1];
        
        //emoji use 
        

          // contentHtml=`<p>${textMain.replaceAll("<","&lt;").replaceAll(">","&rt;")}</p>`
          //   +(textImg!=undefined?`<br><img src="data:image${textImg}">`:"")

      }

/* 
        for(e of emojiGroup){
          let emj=e
        let eName=emj.emojiName
        // console.log(emj)
        //contentHtml=contentHtml.replaceAll("%"+eName+"%","okokok")
        contentHtml=contentHtml.replaceAll("%"+eName+"%",`<img width=25 height=25 src="${emj.src}" class="emoji ${emj.id}"/>`)
      } */
      //一样个也。。点解上边可以replaceAll下面就no
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
      likeBtn.textContent = "Like";

      const dislikeBtn = document.createElement("button");
      dislikeBtn.id ="dislike*"+ _id;
      dislikeBtn.addEventListener("click", () => dislikePost(post));
      dislikeBtn.textContent = "Dislike";

      const deleteBtn = document.createElement("button");
      deleteBtn.id = "delete*"+ _id;
      deleteBtn.addEventListener("click", () => deleteUserPost(post));
      deleteBtn.textContent = "Delete";

      postDiv.appendChild(postContent);
      postDiv.appendChild(postDetails);
      postDiv.appendChild(likeBtn);
      postDiv.appendChild(dislikeBtn);
      postDiv.appendChild(deleteBtn);

      postsContainer.appendChild(postDiv);

    });
  }
    
    )
    console.log (postContent);
  };

  // Function to update the UI with posts
  const updateUI = (allPosts) => {

    let posts=allPosts.filter(post=>{
      if((new RegExp(/.*donut/)).test(post.username)){
        post.username=post.username.substr(0,post.username.length-5);
        //console.log(post.username)
        return post
      }
    })

    // if(isShowAll){
    //   posts=allPosts
    // }
    postsContainer.innerHTML = "";

    posts.forEach((post) => {
      const { text, likes, username, createdAt, _id } = post;

      // let text2=text;
  
      let contentHtml = ""

      if(text.split("data:image").length==1){
        //console.log(text)
        contentHtml=`<p>${text.replaceAll("<","&lt;").replaceAll(">","&rt;").replace("data:image","")}</p>`
      }else{
       // console.log(text)
        let textMain=text.split("data:image")[0];
        let textImg=text.split("data:image")[1];
        
        //emoji use 
        

          // contentHtml=`<p>${textMain.replaceAll("<","&lt;").replaceAll(">","&rt;")}</p>`
          //   +(textImg!=undefined?`<br><img src="data:image${textImg}">`:"")

      }

/* 
        for(e of emojiGroup){
          let emj=e
        let eName=emj.emojiName
        // console.log(emj)
        //contentHtml=contentHtml.replaceAll("%"+eName+"%","okokok")
        contentHtml=contentHtml.replaceAll("%"+eName+"%",`<img width=25 height=25 src="${emj.src}" class="emoji ${emj.id}"/>`)
      } */
      //一样个也。。点解上边可以replaceAll下面就no
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
      likeBtn.textContent = "Like";

      const dislikeBtn = document.createElement("button");
      dislikeBtn.id ="dislike*"+ _id;
      dislikeBtn.addEventListener("click", () => dislikePost(post));
      dislikeBtn.textContent = "Dislike";

      const deleteBtn = document.createElement("button");
      deleteBtn.id = "delete*"+ _id;
      deleteBtn.addEventListener("click", () => deleteUserPost(post));
      deleteBtn.textContent = "Delete";

      postDiv.appendChild(postContent);
      postDiv.appendChild(postDetails);
      postDiv.appendChild(likeBtn);
      postDiv.appendChild(dislikeBtn);
      postDiv.appendChild(deleteBtn);

      postsContainer.appendChild(postDiv);

    });
  };
// else {
 // window.location.assign("./login.html");
//}
//} 

  //for adding image to the post
  if (typeof FileReader === "undefined") { //check able to use the fileReader
    alert("This browser not support FileReader");
    input.setAttribute("disabled", "disabled");
  } else {
    input.addEventListener("change", function(){
      let file = this.files[0]
// console.log(file)
    try{
        if (!/image\/\w+/.test(file.type)) { //checking the file type
          alert("Image only!");
          return false;
        }
    
        let reader = new FileReader(); //set a fileReader object
        reader.readAsDataURL(file); //using readAsDataURL to read the image url
        reader.onload = function(e) {
          imghidden.value=this.result;
          //console.log(this.result);
        }

    }catch(e){
      imghidden.value="";
    }

    }, false);//if able to use, run the readFile function
    
  }



  //using base64 to upload image
  //let base64Img = require('base64-img');
