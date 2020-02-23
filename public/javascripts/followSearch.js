var countries = [
  { label: "United Kingdom", value: "UK" },
  { label: "United States", value: "US" }
];

var input = document.getElementById("followUser");

autocomplete({
  input: input,
  fetch: async function(text, update) {
    text = text.toLowerCase();
    // you can also use AJAX requests instead of preloaded data
    let data = await getUsersByName(text);
    //console.log("DATA " + JSON.stringify(data.data));
    names = JSON.parse(data.data);
    //console.log("NOMBRES --- " + names[0].username);
    var suggestions = names.filter(n =>
      n.username.toLowerCase().startsWith(text)
    );

    let newSuggestions = suggestions.map(item => {
      let user = {};
      user.label = item.username;
      user.value = item.username;
      return user;
    });

    update(newSuggestions);
  },
  onSelect: function(item) {
    input.value = item.label;
    console.log("Item selected " + input.value);
  }
});
