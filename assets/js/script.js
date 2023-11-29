// var users = require('./Users.json');
// import {users} from "./Users.json" assert { type: `json` };
function login() {
console.log('jej')
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    //  Uvoz korisnika
    fetch(src="./assets/data/users.json")
        .then(response => response.json())
        .then(data => {
            console.log(data)
            // Da li se poklapa unos i json user
            var user = data.users.find(u => u.email === email && u.password === password);

            if (user) {
                alert('Dobro dosli, ' + user.name + '!');
                relocation();
            } else {
                alert('Email ili Password nisu tacni. Pokusajte ponovo!');
            }
        })
        .catch(error => console.error('Greska', error));

}

const relocation = () => {
    window.open("/pages/home.html")
}
// const login = () => {}

