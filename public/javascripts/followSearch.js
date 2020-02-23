var countries = [
  { label: "United Kingdom", value: "UK" },
  { label: "United States", value: "US" }
];

var input = document.getElementById("followUser");
var logedUser = input.getAttribute("data-userid");

autocomplete({
  input: input,
  fetch: async function(text, update) {
    text = text.toLowerCase();
    // you can also use AJAX requests instead of preloaded data
    let data = await getUsersByName(text);
    console.log("DATA " + JSON.stringify(data.data));
    names = JSON.parse(data.data);
    console.log("NOMBRES --- " + names[0].username);
    var suggestions = names.filter(n =>
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

    let data = await addFollowing(item.value, logedUser);
    $("#followUser").val("");
  }
});
