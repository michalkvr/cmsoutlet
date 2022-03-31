const token = 'keyvt6vx1nJeHCRBX';
const api = 'https://api.airtable.com/v0/appnxwDTMUtlFZXdI';
const numOfResults = document.getElementById('jsNumOfResults');
const machineryMakeEl = document.getElementById('machineryMake');
const typeOfMachineryEl = document.getElementById('typeOfMachinery');
const typeOfPartEl = document.getElementById('typeOfPart');
const searchEl = document.getElementById('search');
let activeParts = [];

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
  const anchor = document.getElementById('typeOfPart');
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
  
  validItems = items.filter(item => Object.keys(item.fields).length >= 6);
  validItems.sort((a, b) => a.fields.name.localeCompare(b.fields.name));

  validItems.forEach((item) => {
    const props = item.fields;
    let el = document.createElement('li');

    let price = '';
    let in_stock = '';
    if(props.in_stock == 0) {
      in_stock = 'Ask for availability';
    }
    else {
      in_stock = 'Available';
      price = props.price == 0 ? 'Ask for price' : props.price + '€';
    }

    let img = typeof props.img !== 'undefined' ? props.img[0].url : 'img/no-image.png';

    el.setAttribute('data-desc', props.description);
    el.setAttribute('data-name', props.name);
    el.setAttribute('data-machinery-make', props.machinery_make);
    el.setAttribute('data-type-of-machinery', props.type_of_machinery);
    el.setAttribute('data-type-of-part', props.type_of_part);
    el.classList.add('part');
    el.innerHTML = `
    <div class="part__start">
      <p class="part__name">${props.name}</p>
      <img class="part__img" src="${img}" alt="No image available"/>
      <p class="part__number">Part number: <span class="fw-bold">${props.part_number}</span></p>
      <p class="part__desc">${props.description}</p>
    </div>
    <div class="part__end">
      <p class="part__in-stock ${props.in_stock > 0 ? 'part__in-stock--green' : 'part__in-stock--orange'}">${in_stock}</p>
      <p class="part__price">${price}</p>
    </div>
    `;
    anchor.appendChild(el);
  });
  numOfResults.innerHTML = validItems.length.toString();
  activeParts = Array.from(document.getElementsByClassName('part'));
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

function search() {
  let needle = searchEl.value;
  setTimeout(() => {
    if(needle !== document.getElementById('search').value)
      return;
    let count = 0;
    activeParts.forEach((item) => {
      needle = needle.toLowerCase();
      let dataDesc = item.getAttribute('data-desc').toLowerCase();
      let dataName = item.getAttribute('data-name').toLowerCase();

      if(dataDesc.includes(needle) || dataName.includes(needle)) {
        item.classList.remove('hidden');
        count++;
      }
      else {
        item.classList.add('hidden');
      }
    })
    machineryMakeEl.value = 'all';
    typeOfMachineryEl.value = 'all';
    typeOfPartEl.value = 'all';
    numOfResults.innerHTML = count;
  }, 300, needle);
}

function applyFilter() {
  searchEl.value = '';
  let count = 0;
  activeParts.forEach(item => {
    if( (item.getAttribute('data-machinery-make').includes(machineryMakeEl.value) || machineryMakeEl.value == 'all') && 
        (item.getAttribute('data-type-of-machinery').includes(typeOfMachineryEl.value) || typeOfMachineryEl.value == 'all') && 
        (item.getAttribute('data-type-of-part').includes(typeOfPartEl.value) || typeOfPartEl.value == 'all')) {
      item.classList.remove('hidden');
      count++;
    }
    else {
      item.classList.add('hidden');
    }    
  })
  numOfResults.innerHTML = count;
}

function resetFilter() {
  searchEl.value = '';
  machineryMakeEl.value = 'all';
  typeOfMachineryEl.value = 'all';
  typeOfPartEl.value = 'all';
  activeParts.forEach(item => item.classList.remove('hidden'))
  numOfResults.innerHTML = activeParts.length;
}
