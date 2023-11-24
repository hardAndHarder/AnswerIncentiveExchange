import 'regenerator-runtime/runtime';
import { Wallet } from './near-wallet';

const CONTRACT_ADDRESS = 'loenwei-contract.testnet';

// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
const wallet = new Wallet({ createAccessKeyFor: CONTRACT_ADDRESS })

// Setup on page load
window.onload = async () => {
  let isSignedIn = await wallet.startUp();

  if (isSignedIn) {
    signedInFlow();
    loadPosts();
    updateRankingTable();
  } else {
    signedOutFlow();
  }

};

// Button clicks

document.querySelector('#sign-in-button').onclick = () => { wallet.signIn(); };
document.querySelector('#sign-out-button').onclick = () => { wallet.signOut(); };
document.querySelector('#create-post-button').onclick = createPost;
// Add this JavaScript code in your existing script
document.querySelector('#exchange-button').onclick = () => {
  // Perform the action to exchange points to NEAR
  alert('Exchanging points to NEAR!');
  wallet.callMethod({contractId: CONTRACT_ADDRESS, method: 'exchangePointsToNear', args: {accountId: wallet.accountId}})
};



// UI: Display the signed-out-flow container
function signedOutFlow() {
  document.querySelector('#signed-in-flow').style.display = 'none';
  document.querySelector('#signed-out-flow').style.display = 'block';
}

// UI: Displaying the signed in flow container and fill in account-specific data
function signedInFlow() {
  document.querySelector('#signed-out-flow').style.display = 'none';
  document.querySelector('#signed-in-flow').style.display = 'block';
  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = wallet.accountId;
  });
}

async function createPost() {
  const content = document.getElementById('post-content').value;
  if (content.trim() !== '') {


    // Call your backend function to create a post
    await wallet.callMethod({contractId: CONTRACT_ADDRESS, method: 'createPost', args: {content: content}})
    // Reload posts to display the new one
    loadPosts();
    // Clear the textarea content after creating a post
    document.getElementById('post-content').value = '';
  }
}

async function loadPosts() {
  const postsContainer = document.getElementById('posts-container');
  postsContainer.innerHTML = ''; // Clear existing posts

  // Call your backend function to get the posts
  const posts = await wallet.viewMethod({contractId: CONTRACT_ADDRESS, method: 'getAllQuestion', args:{}});
  console.log(posts)
  let count = 0;
  posts.forEach(post => {
    const postContainer = document.createElement('div');
    postContainer.classList.add('post-container'); // Add the post-container class
    postContainer.innerHTML = `
      <p>${post.content}</p>
      <div>
        <textarea id="comment-content-${count}" placeholder="Write your comment..."></textarea>
        <button class="add-comment-button" data-post-id="${count}">Add Comment</button>

      </div>
      <div class="comments-container" id="comments-container-${count}"></div>
    `;
    postsContainer.appendChild(postContainer);

    // Load comments for each post
    loadComments(count);
    count++;
  });
}


async function addComment(postId) {
  const commentContent = document.getElementById(`comment-content-${postId}`).value;
  if (commentContent.trim() !== '') {
    // Call your backend function to add a comment
    await wallet.callMethod({contractId: CONTRACT_ADDRESS, method: 'addAnswerToQuestion', args: {contentAnswer: commentContent, questionId: postId}});
    // Reload comments for the specific post
    loadComments(postId);
    // Clear the textarea content after creating a post
    document.getElementById(`comment-content-${postId}`).value = '';
  }
}

async function loadComments(postId) {
  const commentsContainer = document.getElementById(`comments-container-${postId}`);
  commentsContainer.innerHTML = ''; // Clear existing comments

  // Call your backend function to get comments for the specific post
  const comments = await wallet.viewMethod({contractId: CONTRACT_ADDRESS, method: 'getCommentsForSpecificPost', args: {questionId: postId}});

  comments.forEach(comment => {
    const commentElement = document.createElement('div');
    console.log(comment)
    commentElement.innerHTML = 
    `
    <p>
      <span style="color: green;">${comment.author}:</span> ${comment.content}
      <button class="like-button" data-post-id="${postId}" data-comment-id="${comment.author}">&#128077; Like <span class="like-count">${comment.likeNumber }</span></button>
      <button class="dislike-button" data-post-id="${postId}" data-comment-id="${comment.author}">&#128078; Dislike <span class="dislike-count">${comment.dislikeNumber }</span></button>
    </p>`;
    commentsContainer.appendChild(commentElement);
  });
}

// Example functions for like and dislike actions
async function likeComment(commentId, postId) {
  // Call your backend function to handle the like action for the specific comment
  await wallet.callMethod({contractId: CONTRACT_ADDRESS, method: 'likeAction', args: {questionId: postId, authorOfComment: commentId}});
  // Reload comments for the specific post
  loadComments(postId);
  console.log(`Liked comment with ID ${commentId}`);
}

async function dislikeComment(commentId, postId) {
  // Call  backend function to handle the dislike action for the specific comment
  await wallet.callMethod({contractId: CONTRACT_ADDRESS, method: 'dislikeAction', args: {questionId: postId, authorOfComment: commentId}});
  // Reload comments for the specific post
  loadComments(postId);
  console.log(`Disliked comment with ID ${commentId}`);
}

document.addEventListener('click', async function(event) {
  if (event.target.classList.contains('like-button')) {
    const postId = event.target.getAttribute('data-post-id');
    const commentId = event.target.getAttribute('data-comment-id');
    await likeComment(commentId, postId);
  }
});

document.addEventListener('click', async function(event) {
  if (event.target.classList.contains('dislike-button')) {
    const postId = event.target.getAttribute('data-post-id');
    const commentId = event.target.getAttribute('data-comment-id');
    await dislikeComment(commentId, postId);
  }
});


// Attach event listener for dynamically created buttons
document.addEventListener('click', async function(event) {
  if (event.target.classList.contains('add-comment-button')) {
    const postId = event.target.getAttribute('data-post-id');
    await addComment(postId);
  }
});



// ... (existing code)

// Function to update the ranking table
async function updateRankingTable() {
  const rankingTable = document.getElementById('ranking-table');
  const rankUser = await wallet.viewMethod({contractId: CONTRACT_ADDRESS, method: 'getPointLeaderBoard', args: {}});

  // Clear existing content
  rankingTable.innerHTML = '';

  // Add new rows to the table
  rankUser.forEach((rankUser, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${index + 1}</td><td>${rankUser.id}</td><td>${rankUser.points}</td><td>${rankUser.earned}</td>`;
    rankingTable.appendChild(row);
  });
}


