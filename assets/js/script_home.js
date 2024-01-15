class VisitService {
  constructor() {
    this.urlExtension = "http://localhost:3000/reservations";
  }

  async get() {
    return await fetch(`${this.urlExtension}/`);
  }

  async details(identifier) {
    return await fetch(`${this.urlExtension}/${identifier}/`);
  }

  async create(data) {
    return await fetch(`${this.urlExtension}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async update(identifier, updateData) {
    return await fetch(`${this.urlExtension}/${identifier}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
  }

  async delete(identifier) {
    return await fetch(`${this.urlExtension}/${identifier}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

const visitService = new VisitService();

let reservations = [];

async function fetchReservations() {
  return visitService.get().then((response) => response.json());
}

printReservations = (data) => {
  const dropdownItems = document.querySelectorAll(".dropdown-item");
  function getQueryParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
  }
  const tableBody = document.getElementById("table_body");
  const perPage = parseInt(getQueryParam("perPage")) || 15;

  if (window.location.pathname.endsWith("home.html")) {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("perPage", perPage);
    window.history.replaceState({}, "", newUrl);
  }

  const updatePerPage = (selectedPerPage) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("perPage", selectedPerPage);
    window.history.replaceState({}, "", newUrl);
    location.reload();
  };
  dropdownItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      const selectedPerPage = item.getAttribute("value");
      updatePerPage(selectedPerPage);
    });
  });
  if (perPage) {
    data = data.slice(0, perPage);
  }
  data.forEach((r) => {
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
        <td><input type="button" value="update" class="btn btn-primary" onclick="location.href='../pages/reservation_update.html?id=${r.id}'"></td>  
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
    reservations = await fetchReservations();
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
  let data = Object.fromEntries(myData);
  const imeValue = myData.get("ime");
  const salaValue = myData.get("sala");
  if (
    salaValue === "Sala" ||
    imeValue === "Ime" ||
    (await isDuplicateReservation(data))
  ) {
    alert("Nije uneto ime ili je datum vec rezervisan");
    submit_form = false;
  } else {
    submit_form = true;
  }
};

function fetchData() {
  return new Promise((resolve) =>
    setTimeout(resolve, 5000, "Uspesna rezervacija!")
  );
}

const handleError = (error) => {
  alert("Greska, pokusajte ponovo.");
  console.error("Error handling:", error);
};

const visitCreate = async (event) => {
  event.preventDefault();
  await getFormValues();
  const button_2 = document.querySelector("#button_2");
  const loader = document.querySelector("#loader");
  const content = document.querySelector("#content");

  if (submit_form) {
    const formEl = document.querySelector("#myForm");
    const formData = new FormData(formEl);

    data = Object.fromEntries(formData);

    loader.style.display = "block";

    try {
      button_2.onclick = async function () {
        content.innerHTML = "";
        loader.style.display = "block";
      };
      setTimeout(() => {
        visitService.create(data).then(() => {
          window.location.replace("/pages/home.html");
        });
      }, 3000);
    } catch (err) {
      handleError(err);
      loader.style.display = "none";
    }
  }
};

async function deleteSelectedRes() {
  const table = document.getElementById("table");
  const checkboxes = table.querySelectorAll('input[type="checkbox"]:checked');

  if (checkboxes.length === 0) {
    alert("Oznacite korisnika kog zelite da uklonite!");
    return;
  }

  checkboxes.forEach(async (checkbox) => {
    const id = checkbox.id;

    try {
      visitService
        .delete(id)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(`Element ciji je id: ${id} je obrisan.`, data);
        });
    } catch (error) {
      handleError(error);
    }
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
    if (
      (await isDuplicateTime(myData, Resid)) ||
      (await isDuplicateReservation(updateData))
    ) {
      alert("Vreme je vec rezervisano.");
      return;
    }
    console.log("proslo if");
    try {
      visitService
        .update(Resid, updateData)
        .then((res) => res.json())
        .then((json) => {
          window.location.replace("../pages/home.html");
        });
    } catch (err) {
      handleError(err);
    }
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
    try {
      visitService
        .details(targetId)
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
        });
    } catch (err) {
      handleError(err);
    }
  }
}
async function deleteRes() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get("id"));

  try {
    visitService
      .delete(id)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        window.location.replace("../pages/home.html");
        return response.json();
      })
      .then((data) => {
        console.log(`Element ciji je id: ${id} je obrisan.`, data);
      });
  } catch (error) {
    handleError(error);
  }
}

async function isDuplicateReservation(newReservation) {
  let reservationLocal = await fetchReservations();
  return reservationLocal.some((reservation) => {
    const isSameSalaAndDate =
      reservation.sala === newReservation.sala &&
      reservation.datum === newReservation.datum;

    if (isSameSalaAndDate) {
      const startTime1 = new Date(`2000-01-01T${reservation.dolazak}`);
      const endTime1 = new Date(`2000-01-01T${reservation.odlazak}`);
      const startTime2 = new Date(`2000-01-01T${newReservation.dolazak}`);
      const endTime2 = new Date(`2000-01-01T${newReservation.odlazak}`);

      const doTimeRangesOverlap =
        (startTime2 > startTime1 && endTime2 < endTime1) ||
        (startTime1 > startTime2 && endTime2 > endTime1) ||
        (startTime2 < startTime1 &&
          endTime2 < endTime1 &&
          endTime2 > startTime1) ||
        (startTime2 > startTime1 &&
          startTime2 < endTime1 &&
          endTime2 > endTime1) ||
        (startTime2 < startTime1 && endTime2 < endTime1);

      return doTimeRangesOverlap;
    }

    return false;
  });
}

function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("table");
  switching = true;

  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("td")[3];

      y = rows[i + 1].getElementsByTagName("td")[3];

      if (new Date(x.textContent) > new Date(y.textContent)) {
        shouldSwitch = true;
        break;
      }
    }

    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function MyFilter() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.querySelector("#table");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
