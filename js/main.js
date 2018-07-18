'use strict';

let http = new XMLHttpRequest();

http.onreadystatechange = function () {
  if (http.readyState == 4 && http.status == 200) {
    return;
  }
}

http.open("GET", "js/products.json", false);
http.send();

const products = JSON.parse(http.response);

function itemTemplate(item) {

  function colorClasses(){
    return item.colors.map(color => {
      return `<span class="color ${color}">${color.charAt(0).toUpperCase()}${color.slice(1)}</span>`;
    }).join(' ');
  }
  return `
    <ul class="device-wrapper">
      <li><h2 class="name"><span class="data">${item.name}</span></h2></li>
      <li class="pic"><img src="${item.picture}" alt="device's picture"></li>
      <li><span class="parameter">Weight:</span> <span class="data">${item.weight}</span></li>
      <li><span class="parameter">Size:</span> <span class="data">${item.size}</span></li>
      <li><span class="parameter">Colors:</span><span class="data">${colorClasses()}</span></li>
      <li><span class="parameter">RAM:</span> <span class="data">${item.ram}</span></li>
      <li><span class="parameter">Antutu:</span> <span class="data">${item.antutu}</span></li>    
      <li class="price"><span class="data">${item.cost}</span></li>
      <li><button type="button" class="btn">Add to compare</button></li>
    </ul>    
`}

function addingToCompare(el) {
  const li = el.target.parentNode;
  const list = li.parentNode;
  const span = list.querySelectorAll('.data');
  const table = document.querySelector('.compare-table');
  const tableBody = document.querySelector('.tbody');
  if(table.classList.contains('hidden')) {
    table.classList.remove('hidden');
  }
  const html_to_inject = `
    <tr>${Array.from(span).map(tableTemplate).join('')}<td><button type="button" class="btn remove">Remove</button></td></tr>
  `
  tableBody.insertAdjacentHTML('beforeend', html_to_inject);
  //el.target.removeEventListener('click', addingToCompare);
  el.target.setAttribute('disabled', 'true');
}

const load = function() {
  const btn = document.querySelectorAll('.btn');
  const arrayBtns = Array.from(btn);
  const table = document.querySelector('.compare-table');
  const tableBody = document.querySelector('.tbody');
  arrayBtns.forEach((btns) => {
    btns.addEventListener('click', addingToCompare);    
  });  
  function deleteItem(device) {
    device.parentNode.removeChild(device);
  }

  tableBody.addEventListener('click', function(elem) {
    if(elem.target.classList.contains('remove')) {
      deleteItem(elem.target.parentElement.parentElement);
      if(tableBody.childElementCount === 0) {
        table.classList.add('hidden');
      }
    }
    const nameFromTable = elem.target.parentElement.parentElement.firstElementChild.textContent;
    arrayBtns.forEach((btns) => {
      const nameFromList = btns.parentElement.parentElement.querySelector('.name .data').textContent;
      if(nameFromTable === nameFromList) {
        //btns.addEventListener('click', addingToCompare);
        btns.removeAttribute('disabled');
      }
    });
  });
}

window.onload = load;

function tableTemplate(item) {
  return `
    <td>${item.innerHTML}</td>    
  `
}

document.getElementById('app').innerHTML = `
  <h1 class="title">Devices list (${products.length} results)</h1>
  <p class="subtitle">Add items to compare <span class="mobile-visible">and then check table at the bottom</span></p>
  <div class="lists">${products.map(itemTemplate).join('')}</div>
  <table class="compare-table hidden">
    <thead>
      <tr>
        <th>Name</th>
        <th>Weight</th>
        <th>Size</th>
        <th>Colors</th>
        <th>RAM</th>
        <th>Antutu</th>
        <th>Price</th>
        <th></th>
      </tr>
    </thead>
    <tbody class="tbody"></tbody>    
  </table>
`;

