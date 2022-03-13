class PartList {
  constructor() {
    this.anchor = document.getElementById('parts');
  }
  
  render(parts) {
    parts.forEach(part => {
      const props = part.fields;
      let el = document.createElement('div');
      el.innerHTML = `
        <p>${props.name}</p>
        <img src="${props.img[0].url}" />
      `;
      this.anchor.appendChild(el);
    })
  }
}

parts = new PartList();

const token = 'keyvt6vx1nJeHCRBX';
const myHeaders = new Headers();
myHeaders.append('Accept', 'application/json');
myHeaders.append('Authorization', 'Bearer ' + token);

const myInit = {
  method: 'GET',
  headers: myHeaders,
};

fetch('https://api.airtable.com/v0/appnxwDTMUtlFZXdI/parts', myInit)
  .then(function(response) { return response.json(); })
  .then(function(data) { 
    parts.render(data.records);
  });