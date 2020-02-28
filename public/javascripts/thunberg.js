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
  const buttonPost = document.getElementById("btnThunberg");
  const charcounter = document.getElementById("characters-left");
  charcounter.innerHTML = 50 - this.value.length;

  /*   if (parseInt(charcounter.innerHTML) < 0) {
    charcounter.classList.add("red");
    buttonPost.disabled = true;
  } else {
    charcounter.classList.remove("red");
    buttonPost.disabled = false;
  } */
  this.value.length > 50
    ? charcounter.classList.add("red")
    : charcounter.classList.remove("red");

  buttonPost.disabled =
    this.value.length == 0 || this.value.length > 50 ? true : false;
};
