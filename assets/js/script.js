function login() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  fetch((src = "./assets/data/users.json"))
    .then((response) => response.json())
    .then((data) => {
      var user = data.users.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        relocation();
      } else {
        alert("Email ili Password nisu tacni. Pokusajte ponovo!");
      }
    })
    .catch((error) => console.error("Greska", error));
}

const relocation = () => {
  window.location.replace("/pages/home.html");
};

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("password")
    .addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        login();
      }
    });
});

const mail = document.querySelector("#email");
mail.addEventListener("keyup", keepValue);
function keepValue() {
  localStorage.setItem("email", mail.value);
  console.log(localStorage.getItem("email"));
}
