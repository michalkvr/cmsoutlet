const token = 'keyvt6vx1nJeHCRBX';
const api = 'https://api.airtable.com/v0/appnxwDTMUtlFZXdI';
const numOfResults = document.getElementById('jsNumOfResults')

fetchData('/machinery_make', renderMachineryMake);
fetchData('/type_of_machinery', renderTypeOfMachinery);
fetchData('/type_of_part', renderTypeOfPart);
fetchData('/parts', renderParts);

function renderMachineryMake(items) {
  const anchor = document.getElementById('machineryMake');
  renderMenu(items, anchor);
}

function renderTypeOfMachinery(items) {
  const anchor = document.getElementById('typeOfMachinery');
  renderMenu(items, anchor);
}

function renderTypeOfPart(items) {
  console.log(items)
  const anchor = document.getElementById('typeOfParts');
  renderMenu(items, anchor);
}

function renderMenu(items, anchor) {
  items.forEach((item) => {
    let el = document.createElement('option');
    el.setAttribute('value', item.id)
    el.innerHTML = item.fields.name;
    anchor.appendChild(el);
  });
};

function renderParts(items, ctx) {
  const anchor = document.getElementById('parts');
  items.sort((a, b) => a.fields.name.localeCompare(b.fields.name));
  items.forEach((item) => {
    const props = item.fields;
    let el = document.createElement('li');

    let price = '';
    let in_stock = '';
    if(props.in_stock == 0) {
      in_stock = 'Ask for availability';
    }
    else {
      in_stock = 'In stock: ' + props.in_stock;
      price = props.price == 0 ? 'Ask for price' : props.price + '€';
    }

    el.classList.add('part');
    el.innerHTML = `
    <div class="part__start">
      <p class="part__name">${props.name}</p>
      <img class="part__img" src="${props.img[0].url}" />
      <p class="part__number">Part number: <span class="fw-bold">${props.part_number}</span></p>
      <p class="part__desc">${props.description}</p>
    </div>
    <div class="part__end">
      <p class="part__in-stock">${in_stock}</p>
      <p class="part__price">${price}</p>
    </div>
    `;
    anchor.appendChild(el);
  });
  numOfResults.innerHTML = items.length.toString();
};

function fetchData(route, callback) {
  const myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + token);
  const myInit = {
    method: 'GET',
    headers: myHeaders,
  };
  fetch(api + route, myInit)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      callback(data.records);
    });
};