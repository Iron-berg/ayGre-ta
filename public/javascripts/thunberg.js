// Post Thunberg Form
document
  .getElementById("btnThunberg")
  .addEventListener("click", async function() {
    const message = document.getElementById("message").value;
    const loggedUser = document
      .getElementById("btnThunberg")
      .getAttribute("data-userid");

    await postThunberg(message, loggedUser);
    document.getElementById("message").value = "";
  });

// Like Thunberg
const onLikeClick = async function(id) {
  const loggedUser = document
    .getElementById("btnThunberg")
    .getAttribute("data-userid");
  await likeThunberg(id, loggedUser);
};
