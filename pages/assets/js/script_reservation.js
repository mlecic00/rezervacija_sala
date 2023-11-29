// const fs = require('fs');

// const data = fs.readFileSync('data.json');
// // Parse the JSON data into a JavaScript object
// const jsonData = JSON.parse(data);
// console.log(jsonData)

// fs.readFile('/path/to/my/json.json', function (err, data) {
//     if (err) throw err;
//     var newData = JSON.parse(data);
//   });

const add_element = () => {
    window.location.replace("/pages/home.html")
}


const skoci = (e) => {
    event.preventDefault()
    window.open("/pages/home.html")
}
