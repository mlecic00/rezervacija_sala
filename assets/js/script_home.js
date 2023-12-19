let reservations = [];
async function fetchReservations() {
  await fetch("/assets/data/reservations.json")
    .then((response) => response.json())
    .then((data) => {
      reservations = data.reservations;
    })
    .catch((error) => console.error("Error loading JSON:", error));
}

printReservations = () => {
  const tableBody = document.getElementById("table_body");
  reservations.forEach((r) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="checkbox" id="${r.id}"></td>
        <td><a href="./pages/reservation_details.html?id=${r.id}">${r.sala}</a></td>
        <td>${r.ime}</td>
        <td>${r.datum}</td>
        <td>${r.dolazak}</td>
        <td>${r.odlazak}</td>
        <td>${r.razlog}</td>
        <td>${r.napomena}</td>
        <td><input type="button" value="update" class="btn btn-primary" onclick="redirectToUpdatePage(${r.id})"></td>  
      `;
    tableBody.appendChild(row);
  });
};

redirectToUpdatePage = (reservationId) => {
  const queryParams = `id=${reservationId}`;

  window.location.replace(`../pages/reservation_update.html?${queryParams}`);
};

if (window.location.toString().includes("home.html")) {
  (async function main() {
    await fetchReservations();
    printReservations(reservations);
  })();
}

if (window.location.toString().includes("reservation.html")) {
  fetch("../assets/data/users.json")
    .then((response) => response.json())
    .then((data) => {
      const ime_el = document.getElementById("ime");
      data.users.forEach(function (user) {
        var option = document.createElement("option");
        option.value = user.name;
        option.text = user.name;
        ime_el.appendChild(option);
      });
    })
    .catch((error) => console.error("Error fetching JSON:", error));
}

if (window.location.toString().includes("reservation_update.html")) {
  fetch("../assets/data/users.json")
    .then((response) => response.json())
    .then((data) => {
      const ime_el = document.getElementById("ime_update");
      data.users.forEach(function (user) {
        var option = document.createElement("option");
        option.value = user.name;
        option.text = user.name;
        ime_el.appendChild(option);
      });
    })
    .catch((error) => console.error("Error fetching JSON:", error));

  const urlParams = new URLSearchParams(window.location.search);
  const reservationId = urlParams.get("id");
  console.log(reservationId);
  fetch(`http://localhost:3000/reservations/${reservationId}`)
    .then((response) => response.json())
    .then((data) => {
      document.querySelector("#sala_update").value = data.sala;
      document.querySelector("#ime_update").value = data.ime;
      document.querySelector("#date_update").value = data.datum;
      document.querySelector("#time_1_update").value = data.dolazak;
      document.querySelector("#time_2_update").value = data.odlazak;
      document.querySelector("#razlog_update").value = data.razlog;
      document.querySelector("#napomena_update").value = data.napomena;
    })
    .catch((error) => console.error("Error loading JSON:", error));
}

let submit_form = true;
let data;
const getFormValues = async () => {
  const formEl = document.querySelector("#myForm");
  let myData = new FormData(formEl);
  const imeValue = myData.get("ime");
  if (imeValue === "Ime" || (await isDuplicateReservation(myData))) {
    alert("Nije uneto ime ili je datum vec rezervisan");
    submit_form = false;
  } else {
    submit_form = true;
  }
};

const visitCreate = async (event) => {
  event.preventDefault();
  await getFormValues();

  if (submit_form) {
    const formEl = document.querySelector("#myForm");
    const formData = new FormData(formEl);

    data = Object.fromEntries(formData);

    fetch("http://localhost:3000/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((json) => {
        window.location.replace("/pages/home.html");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

async function isDuplicateReservation(myData) {
  await fetchReservations();
  return reservations.some(
    (reservation) =>
      reservation.sala == myData.get("sala") &&
      reservation.datum === myData.get("datum") &&
      reservation.dolazak === myData.get("dolazak")
  );
}

function deleteSelected() {
  const table = document.getElementById("table");
  const checkboxes = table.querySelectorAll('input[type="checkbox"]:checked');

  if (checkboxes.length === 0) {
    alert("Oznacite korisnika koga zelite da obrisete!");
    return;
  }

  checkboxes.forEach((checkbox) => {
    const id = checkbox.id;

    fetch(`http://localhost:3000/reservations/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(`Element ciji je id: ${id} je obrisan.`, data);
      })
      .catch((error) => console.error("Error:", error));
  });
}

const updateRes = async (event) => {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const Resid = urlParams.get("id");
  const formEl = document.querySelector("#myForm");
  let myData = new FormData(formEl);

  if (submit_form) {
    const formEl = document.querySelector("#myForm");
    const formData = new FormData(formEl);

    let updateData = Object.fromEntries(formData);
    if (await isDuplicateTime(myData, Resid)) {
      alert("Vreme je vec rezervisano.");
      submit_form = false;
      return;
    }

    console.log("Resid", Resid);
    fetch(`http://localhost:3000/reservations/${Resid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    })
      .then((res) => res.json())
      .then((json) => {
        window.location.replace("../pages/home.html");
      })
      .catch((err) => {
        console.error("Error updating reservation:", err);
      });
  }
};

const isDuplicateTime = async (formData, updateResId) => {
  const selectedTime = formData.get("dolazak");
  const selectedDate = formData.get("datum");
  const selectedSala = formData.get("sala");

  const allReservations = await fetch("http://localhost:3000/reservations")
    .then((res) => res.json())
    .catch((err) => {
      console.error("Error fetching reservations:", err);
      return [];
    });

  const otherReservations = allReservations.filter(
    (reservation) => reservation.id != updateResId
  );
  return otherReservations.some(
    (reservation) =>
      reservation.sala === selectedSala &&
      reservation.dolazak === selectedTime &&
      reservation.datum === selectedDate
  );
};

if (window.location.toString().includes("reservation_details.html")) {
  const urlParams = new URLSearchParams(window.location.search);
  const reservationId = parseInt(urlParams.get("id"));
  getDetailsById(reservationId);

  function getDetailsById(targetId) {
    let reservation;
    const reservationDetailsDiv = document.getElementById("reservationDetails");

    fetch(`http://localhost:3000/reservations/${targetId}`)
      .then((response) => response.json())
      .then((data) => {
        reservation = data;
        reservationDetailsDiv.innerHTML = `
           <h2><Detalji rezervacije/h2>
           <p>Sala: ${reservation.sala}</p>
           <p>Ime: ${reservation.ime}</p> 
           <p>Datum: ${reservation.datum}</p>
           <p>Vreme dolaska: ${reservation.dolazak}</p>
           <p>Vreme odlaska: ${reservation.odlazak}</p>
           <p>Razlog: ${reservation.razlog}</p>
           <p>Napomena: ${reservation.napomena}</p>
         `;
      })
      .catch((error) => console.error("Error loading JSON:", error));
  }
}
