const appContainer = document.querySelector(".app");
const overlay = document.querySelector(".overlay");
const submitDeleting = document.querySelector(".submit-deleting");
const cancelDeleting = document.querySelector(".cancel-deleting");
let MAX_ID = 0;
let upVoted = [];
let downVoted = [];
let isEditing = false;

const data = {
  currentUser: {
    image: "./images/avatars/image-juliusomo.png",
    username: "juliusomo",
  },
  comments: [
    {
      id: 1,
      content:
        "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
      createdAt: "1 month ago",
      score: 12,
      user: {
        image: "./images/avatars/image-amyrobson.png",
        username: "amyrobson",
      },
      replies: [],
    },
    {
      id: 2,
      content:
        "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
      createdAt: "2 weeks ago",
      score: 5,
      user: {
        image: "./images/avatars/image-maxblagun.png",
        username: "maxblagun",
      },
      replies: [
        {
          id: 3,
          content:
            "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
          createdAt: "1 week ago",
          score: 4,
          " ": "maxblagun",
          user: {
            image: "./images/avatars/image-ramsesmiron.png",
            username: "ramsesmiron",
          },
        },
        {
          id: 4,
          content:
            "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
          createdAt: "2 days ago",
          score: 2,
          replyingTo: "ramsesmiron",
          user: {
            image: "./images/avatars/image-juliusomo.png",
            username: "juliusomo",
          },
        },
      ],
    },
  ],
};

function changeScore(elem, changeType, commId) {
  const scoreElement = elem.closest(".vote").querySelector(".score");
  let changeNum;
  // elem.style.filter = "brightness(0)";
  if (changeType == "up") {
    changeNum = 1;
    if (upVoted.includes(commId)) return;
    if (downVoted.includes(commId)) {
      changeNum = 2;
      downVoted = downVoted.filter((el) => {
        return el !== commId;
      });
      elem.closest(".vote").querySelector(".down-vote").style.filter = "none";
    }
    upVoted.push(commId);
    elem.style.filter = "brightness(0)";
  } else {
    changeNum = -1;
    if (downVoted.includes(commId)) return;
    if (upVoted.includes(commId)) {
      changeNum = -2;
      upVoted = upVoted.filter((el) => {
        return el !== commId;
      });
      elem.closest(".vote").querySelector(".up-vote").style.filter = "none";
    }
    downVoted.push(commId);
    elem.style.filter = "brightness(0)";
  }
  scoreElement.innerHTML = +scoreElement.innerHTML + changeNum;
}

function deleteMessage(comment) {
  overlay.classList.remove("hidden");
  cancelDeleting.addEventListener("click", function () {
    overlay.classList.add("hidden");
  });
  submitDeleting.addEventListener("click", function () {
    comment.remove();
    overlay.classList.add("hidden");
  });
}

function editComment(comment) {
  const commContent = comment.querySelector(".mess-content");
  const text = commContent.textContent;
  const parent = commContent.parentElement;

  // commContent.remove();
  commContent.classList.add("hidden-editing--comm");

  const textArea = document.createElement("textarea");
  textArea.classList.add("update-input");
  textArea.innerHTML = text;

  const btn = document.createElement("button");
  btn.classList.add("submit-edit");
  btn.innerHTML = "Update";

  parent.append(textArea);
  parent.append(btn);
}

const currentUserName = data.currentUser.username;
data.comments.forEach((com) => {
  renderComment(com, currentUserName, "comment");
  if (com.replies.length > 0) {
    com.replies.forEach((rep) => {
      renderComment(rep, currentUserName, "reply-com");
    });
  }
});
renderAddNewComments();

function renderAddNewComments() {
  const item = document.createElement("div");
  item.classList.add("add-new--comment");
  item.innerHTML = `<img class="add-comm--avatar" src="images/avatars/image-juliusomo.png" />
        <textarea
          class="add-comm--input"
          name="add-new--comment"
          placeholder="Add a comment..."
        ></textarea>
        <button class="send-btn">send</button> `;

  appContainer.append(item);
}

function renderComment(
  comment,
  currentUserName,
  commentType,
  newReply = false,
  targetedElem = undefined
) {
  const item = document.createElement("div");
  item.classList.add(`${commentType}`);
  item.classList.add("comment-form");
  item.setAttribute("id", `comment-${comment.id}`);
  item.innerHTML = `
        <div class="vote">
          <img class="up-vote vote--symb" src="images/icon-plus.svg" />
          <span class="score">${comment.score}</span>
          <img class="down-vote vote--symb" src="images/icon-minus.svg" />
        </div>
        <div class="message-det">
          <div class="mess-nav">
            <div class="mess-info">
              <img
                class="avatar"
                src="images/avatars/image-${comment.user.username}.png"
                alt="avatar"
              />
              <p class="user-name">${comment.user.username}</p>
              ${
                comment.user.username == currentUserName
                  ? '<span class="current--user-sign">you</span>'
                  : ""
              }
              <p class="mess-date">${comment.createdAt}</p>
            </div>
          </div>
          <p class="mess-content">${comment.content}</p>
        </div>
        <div class="actions">
            ${
              comment.user.username == currentUserName
                ? ` <div class="delete action dlt-clk">
                <img class="dlt-clk" src="images/icon-delete.svg" alt="delete" />
                <span class="dlt-clk">Delete</span>
              </div>
              <div class="edit action edit-clk">
                <img class="edit-clk" src="images/icon-edit.svg" alt="edit" />
                <span class="edit-clk">Edit</span>
              </div>`
                : `<div class="reply action rep-clk">
                <img class="rep-clk" src="images/icon-reply.svg" alt="reply" />
                <span class="rep-clk">Reply</span>
              </div>`
            }
            </div>
  `;

  MAX_ID++;
  if (targetedElem) {
    if (!newReply) return targetedElem.before(item);
    return targetedElem.after(item);
  }
  appContainer.append(item);
}

const replyBtns = document.querySelectorAll(".reply");
let replySubmitBtn;
let cancelReplyingBtn;

let replyingAlready = false;

appContainer.addEventListener("click", function (e) {
  if (e.target.classList[0]?.split("-")[1] == "vote") {
    const commId = e.target.closest(".comment-form").id.split("-")[1];
    const voteType = e.target.classList[0].split("-")[0];
    changeScore(e.target, voteType, commId);
  } else if (e.target.classList.contains("rep-clk")) {
    if (replyingAlready) return;
    const div = document.createElement("div");
    div.classList.add("reply-to-comment");
    div.setAttribute("id", e.target.closest(".comment-form").id.split("-")[1]);
    div.innerHTML = `
        <img
          class="reply-img"
          src="${data.currentUser.image}"
          alt="avatar"
        />
        <textarea class="reply-input" type="text" name="reply">@${
          e.target.closest(".comment-form").querySelector(".user-name")
            .textContent
        }</textarea>
        <div class="replying-actions">
        <button class="reply-submit-btn">Reply</button>
        <button class="cancel-replyin-btn">Cancel</button>
        </div>
      `;

    let element = e.target.closest(".comment-form");
    while (element.nextElementSibling?.classList.contains("reply-com")) {
      element = element.nextElementSibling;
    }
    element.after(div);

    replyingAlready = true;

    replySubmitBtn = document.querySelector(".reply-submit-btn");
    cancelReplyingBtn = document.querySelector(".cancel-replyin-btn");

    cancelReplyingBtn.addEventListener("click", function (e) {
      e.target.closest(".reply-to-comment").remove();
      replyingAlready = false;
    });

    replySubmitBtn.addEventListener("click", function (e) {
      const commentReplying = e.target.closest(".reply-to-comment");
      const text = commentReplying.querySelector(".reply-input").value;

      const commentObj = {
        id: MAX_ID + 1,
        content: text,
        createdAt: "Now",
        score: 0,
        user: {
          image: data.currentUser.image,
          username: data.currentUser.username,
        },
        replies: [],
      };

      renderComment(
        commentObj,
        data.currentUser.username,
        "reply-com",
        true,
        element
      );

      commentReplying.remove();
      replyingAlready = false;
    });
  } else if (e.target.classList?.contains("dlt-clk")) {
    const commentEl = e.target.closest(".comment-form");
    deleteMessage(commentEl);
  } else if (e.target.classList?.contains("edit-clk")) {
    if (isEditing) return;
    const commentEl = e.target.closest(".comment-form");
    isEditing = true;
    editComment(commentEl);
  } else if (e.target.classList?.contains("submit-edit")) {
    const editElem = document.querySelector(".update-input");
    const editedText = editElem.value;
    if (!editedText) return;

    editElem.remove();
    document.querySelector(".submit-edit").remove();

    const comment = document.querySelector(".hidden-editing--comm");
    console.log(comment);
    comment.textContent = editedText;
    comment.classList.remove("hidden-editing--comm");

    isEditing = false;
  } else if (e.target.classList?.contains("send-btn")) {
    const newCommentText = e.target.parentElement.querySelector("textarea");
    if (!newCommentText.value) return;

    const commentObj = {
      id: MAX_ID + 1,
      content: newCommentText.value,
      createdAt: "Now",
      score: 0,
      user: {
        image: data.currentUser.image,
        username: data.currentUser.username,
      },
      replies: [],
    };

    renderComment(
      commentObj,
      data.currentUser.username,
      "comment",
      false,
      e.target.parentElement
    );

    newCommentText.value = "";
  }
});

window.addEventListener("load", () => {
  document.querySelector(".preloader").style.display = "none";
});
