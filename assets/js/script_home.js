fetch(src="./assets/data/reservations.json")
    .then(response => response.json())
    .then(data => {   
      const tableBody = document.getElementById('table_body');
      // data = JSON.parse(JSON.stringify(data));
      data.reservations.forEach(item => {
        
        const row = document.createElement('tr');

        const sale = document.createElement('td');
        sale.textContent = item.sale;
        row.appendChild(sale);

        const ime = document.createElement('td');
        ime.textContent = item.ime;
        row.appendChild(ime);

        const dan = document.createElement('td');
        dan.textContent = item.dan;
        row.appendChild(dan);

        const od_vreme = document.createElement('td');
        od_vreme.textContent = item.od_vreme;
        row.appendChild(od_vreme);

        const do_vreme = document.createElement('td');
        do_vreme.textContent = item.do_vreme;
        row.appendChild(do_vreme);

        const razlog = document.createElement('td');
        razlog.textContent = item.razlog;
        row.appendChild(razlog);

        const napomena = document.createElement('td');
        napomena.textContent = item.napomena;
        row.appendChild(napomena);

        tableBody.appendChild(row);
      });
    });


    // function reservation_add(){}

    const relocation_r = () => {
      window.location.replace("/pages/reservation.html")
  }