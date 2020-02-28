// Post Thunberg Form
const onPostClick = async function() {
  const message = document.getElementById("message").value;
  const loggedUser = document
    .getElementById("btnThunberg")
    .getAttribute("data-userid");

  await postThunberg(message, loggedUser);
  const response = await getUserThunbergs(loggedUser);

  document.querySelector("#thunbergsboard").innerHTML = response.data;
  document.getElementById("message").value = "";

  document.getElementById("btnThunberg").addEventListener("click", onPostClick);
};

// Like Thunberg
const onLikeClick = async function(id) {
  const loggedUser = document
    .getElementById("btnThunberg")
    .getAttribute("data-userid");
  await likeThunberg(id, loggedUser);
  const response = await getUserThunbergs(loggedUser);

  document.querySelector("#thunbergsboard").innerHTML = response.data;

  document.getElementById("btnThunberg").addEventListener("click", onPostClick);
};

document.getElementById("btnThunberg").addEventListener("click", onPostClick);

// Message character lenght control
document.getElementById("message").onkeyup = function() {
  updateFormStatus();
};

// Cancel button clears text area
document.getElementById("btnCancel").addEventListener("click", function() {
  document.getElementById("message").value = "";
  updateFormStatus();
});

const updateFormStatus = function() {
  const buttonPost = document.getElementById("btnThunberg");
  const messageArea = document.getElementById("message");
  const charcounter = document.getElementById("characters-left");

  charcounter.innerHTML = 50 - messageArea.value.length;

  messageArea.value.length > 50
    ? charcounter.classList.add("red")
    : charcounter.classList.remove("red");

  buttonPost.disabled =
    messageArea.value.length == 0 || messageArea.value.length > 50
      ? true
      : false;
};
