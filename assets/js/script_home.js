window.onload = () => {
  let reservations = []
  if (window.location.toString().includes("home.html")) {
    fetch('/assets/data/reservations.json')
      .then(response => response.json())
      .then(data => {
        // Ispisi rezervacije
        reservations = data.reservations; // Niz rezervacije globalno 
        printReservations(reservations);
      })
      .catch(error => console.error('Error loading JSON:', error));
  }
  if (window.location.toString().includes("reservation.html")) {


    fetch('../assets/data/users.json')
      .then(response => response.json())
      .then(data => {

        const ime_el = document.getElementById('ime');
        //  console.log(data)
        data.users.forEach(function (user) {
          var option = document.createElement("option");
          option.value = user.name;
          option.text = user.name;
          ime_el.appendChild(option);
        });
      })
      .catch(error => console.error('Error fetching JSON:', error));



  }

  if (window.location.toString().includes("reservation_details.html")) {
    // Url parametre dohvatamo
       const urlParams = new URLSearchParams(window.location.search);
       const reservationId = parseInt(urlParams.get('id'));
       getDetailsById(reservationId);
   
   
     function getDetailsById(targetId) {
       // const reservation = reservations.find(item => item.id === targetId);
       let reservation
       const reservationDetailsDiv = document.getElementById("reservationDetails");
   
       fetch(`http://localhost:3000/reservations/${targetId}`)
         .then(response => response.json())
         .then(data => {
           // Ispisi rezervacije
           console.log(data)
           reservation = data; // Niz rezervacije globalno 
           reservationDetailsDiv.innerHTML = `
           <h2><Detalji rezervacije/h2>
           <p>Sala: ${reservation.sala}</p>
           <p>Ime: ${reservation.ime}</p>
           <p>Datum: ${reservation.datum}</p>
           <p>Vreme dolaska: ${reservation.dolazak}</p>
           <p>Vreme odlaska: ${reservation.odlazak}</p>
           <p>Razlog: ${reservation.razlog}</p>
           <p>Napomena: ${reservation.napomena}</p>
           <p>Id: ${reservation.id}</p>
         `;
           // printReservations(reservations);
         })
         .catch(error => console.error('Error loading JSON:', error));
   
       // Da li postoji rezervacija
       if (reservation) {
         // Detalji
   
       } else {
         //alert(`No reservation found with ID ${targetId}`);
       }
     }
  }

  // if(window.location.toString().includes('id')){
  //   id
  //   data.filter(room => room.id == id)

  //   div = 

  //   div.innerHTML = "<div> <p> "
  // }



  printReservations = () => {
    const tableBody = document.getElementById('table_body');
    reservations.forEach((r) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><a href="./pages/reservation_details.html?id=${r.id}">${r.sala}</a></td>
        <td>${r.ime}</td>
        <td>${r.datum}</td>
        <td>${r.dolazak}</td>
        <td>${r.odlazak}</td>
        <td>${r.razlog}</td>
        <td>${r.napomena}</td>
      `;
      tableBody.appendChild(row);

    });
  };



  const relocation_r = () => {
    window.location.replace("/pages/reservation.html")
  }




  let submit_form = true;
  let data;

  const getFormValues = () => {
    const formEl = document.querySelector('#myForm');
    let myData = new FormData(formEl);
    // Validation logic 
    // Using trim() function to validate if imeValue has blank space
    const imeValue = myData.get('ime');
    if (imeValue === 'Ime' || isDuplicateReservation(myData)) {
      alert('Nije uneto ime ili je datum vec rezervisan');
      submit_form = false;
    } else {
      submit_form = true;
    }
    // console.log(Object.fromEntries(myData));
  };




  const visitCreate = (event) => {
    event.preventDefault();
    getFormValues();

    if (submit_form) {
      const formEl = document.querySelector('#myForm');
      const formData = new FormData(formEl);

      // Convert FormData to a plain JavaScript object
      data = Object.fromEntries(formData);

      fetch("http://localhost:3000/reservations", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(json => {
          window.location.replace("/pages/home.html");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      //alert('Greska');
    }
  };



  //let newReservation = []
  function isDuplicateReservation(myData) {
    return reservations.some(reservation => (
      reservation.sala === myData.get('sala') && reservation.datum === myData.get('datum') && reservation.dolazak === myData.get('dolazak')
    ));
  }



 
}


