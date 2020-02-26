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

// Like Thunberg
// document.getElementById("like").addEventListener("click", async function() {
//   // const thunbergid = document
//   //   .getElementById("like")
//   //   .getAttribute("data-thunbergid");
//   console.log("EL THUNBERG ID ES ");

//   //await likehunberg(thunbergid);
// });

// Like Thunberg
const onLikeClick = async function(id) {
  console.log("EL THUNBERG ID ES" + id);
};

// document.getElementsByClassName("like").addEventListener("click", function(e) {
//   console.log("HOLA");
//   console.log("LLEGA " + e.target.getAttribute("data-thunbergid"));
// });
