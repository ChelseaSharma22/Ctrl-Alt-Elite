
const apiBaseURL = "https://microbloglite.herokuapp.com";

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
};

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

    fetch(apiBaseURL + "/api/likes", options);
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

      fetch(apiBaseURL + `/api/likes/${likeToDelete._id}`, options);
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

    fetch(apiBaseURL + `/api/posts/${post._id}`, options);
  }
};

// Function to delete user's own post
const deleteUserPost = (post) => {
  if (loggedIn() !== null && loggedIn().username === post.username) {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedIn().token}`,
      },
    };

    fetch(apiBaseURL + `/api/posts/${post._id}`, options);
  }
};

// Function to create a post
const createPost = (content) => {
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
  // References to HTML elements
  const postForm = document.getElementById("postForm");
  const createPostInput = document.getElementById("createPost");
  const postsContainer = document.getElementById("posts");
  const logoutBtn = document.getElementById("logoutBtn");
  const recentBtn = document.getElementById("recent");

  // Event listeners
  recentBtn.addEventListener("click", () => {
    fetchRecentPosts().then((data) => {
      console.log(data);
      updateUI(data);
    });
  });

  logoutBtn.addEventListener("click", logout);

  // Retrieve recent posts and update UI
  fetchRecentPosts().then((data) => {
    console.log(data);
    updateUI(data);
  });

  // Add event listener for form submission
  postForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const postContent = createPostInput.value;
    createPost(postContent);
  });

  // Function to update the UI with posts
  const updateUI = (posts) => {
    postsContainer.innerHTML = "";

    posts.forEach((post) => {
      const { text, likes, username, createdAt, _id } = post;

      const postDiv = document.createElement("div");
      postDiv.className = "post";

      const postContent = document.createElement("div");
      postContent.className = "post-content";
      postContent.innerHTML = `<p>${text}</p>`;

      const postDetails = document.createElement("div");
      postDetails.className = "post-details";
      postDetails.innerHTML = `<span class="post-likes">${likes.length} likes</span> | <span class="post-author">${username}</span> | <span class="post-date">${createdAt}</span>`;

      const likeBtn = document.createElement("button");
      likeBtn.id = _id;
      likeBtn.addEventListener("click", () => likePost(post));
      likeBtn.textContent = "Like";

      const dislikeBtn = document.createElement("button");
      dislikeBtn.id = _id;
      dislikeBtn.addEventListener("click", () => dislikePost(post));
      dislikeBtn.textContent = "Dislike";

      const deleteBtn = document.createElement("button");
      deleteBtn.id = _id;
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
} else {
  window.location.assign("../pages/login.html");
}
