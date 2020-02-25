// Post Thunberg Form
document
  .getElementById("btnThunberg")
  .addEventListener("click", async function() {
    const message = document.getElementById("message").value;
    const loggedUser = document
      .getElementById("btnThunberg")
      .getAttribute("data-userid");

    await postThunberg(message, logedUser);
    document.getElementById("message").value = "";
  });
