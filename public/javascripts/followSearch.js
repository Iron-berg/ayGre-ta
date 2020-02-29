let input = document.getElementById("followUser");
let logedUser = input.getAttribute("data-userid");

autocomplete({
  input: input,
  fetch: async function(text, update) {
    text = text.toLowerCase();
    let data = await getUsersByName(text);

    names = JSON.parse(data.data);

    let suggestions = names.filter(n =>
      n.username.toLowerCase().startsWith(text)
    );

    let newSuggestions = suggestions.map(item => {
      let user = {};
      user.label = item.username;
      user.value = item._id;
      return user;
    });

    update(newSuggestions);
  },
  onSelect: async function(item) {
    input.value = item.label;

    let res = await addFollowing(item.value, logedUser);
    $("#followUser").val("");

    if (res.data.status == "ko") {
      document.getElementById("follow-message-ko").style.display = "block";
      document.getElementById("message-alert-ko").innerHTML = res.data.msg;
      window.setTimeout(function() {
        document.getElementById("follow-message-ko").style.display = "none";
      }, 2000);
    }

    if (res.data.status == "ok") {
      document.getElementById("follow-message-ok").style.display = "block";
      document.getElementById("message-alert-ok").innerHTML = res.data.msg;
      window.setTimeout(function() {
        document.getElementById("follow-message-ok").style.display = "none";
      }, 2000);
    }
  }
});
