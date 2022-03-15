const token = 'keyvt6vx1nJeHCRBX';
const api = 'https://api.airtable.com/v0/appnxwDTMUtlFZXdI';

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
  items.forEach((item) => {
    const props = item.fields;
    let el = document.createElement('div');
    el.innerHTML = `
      <p>${props.part_number}</p>
      <p>${props.name}</p>
      <img src="${props.img[0].url}" />
      <p>${props.description}</p>
      <p>${props.price}</p>
      <p>${props.in_stock}</p>
      <p>MachineryMakeId: ${props.machinery_make[0]}</p>
      <p>TypeOfMachineryId: ${props.type_of_machinery[0]}</p>
      <p>TypeOfPartId: ${props.type_of_part[0]}</p>
    `;
    console.log(props);
    anchor.appendChild(el);
  });
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