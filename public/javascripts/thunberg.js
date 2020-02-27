// Post Thunberg Form
const onPostClick = async function() {
  console.log("PASA");
  const message = document.getElementById("message").value;
  const loggedUser = document
    .getElementById("btnThunberg")
    .getAttribute("data-userid");

  await postThunberg(message, loggedUser);
  const response = await getUserThunbergs(loggedUser);
  console.log("A VER EL RESPONSE DATA " + response.data);
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
};

document.getElementById("btnThunberg").addEventListener("click", onPostClick);
