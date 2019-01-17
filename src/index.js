const addBtn = document.querySelector('#new-toy-btn');
const toyForm = document.querySelector('.container');
const toySubmitForm = document.querySelector('.add-toy-form');
const toyListEl = document.querySelector('#toy-collection');
const toyNameInputEl = document.querySelector('[name="name"]');
const toyImageInputEl = document.querySelector('[name="image"]');

let addToy = false;

addBtn.addEventListener('click', () => {
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
  } else {
    toyForm.style.display = 'none'
  }
})

function fetchToyApi() {
  return fetch('http://localhost:3000/toys/')
    .then(response => response.json())
}

function andysToys() {
  fetchToyApi().then(data => {
    data.forEach(toy => {
      toyListEl.innerHTML += renderToyCard(toy);
    })
  })
}

function renderToyCard(toy) {
   return `<div class="card">
            <h2>${toy.name}</h2>
            <img src=${toy.image} class="toy-avatar" />
            <p>${toy.likes} Likes </p>
            <button data-id=${toy.id} class="like-btn">Like <3</button>
            <button data-id=${toy.id} class="delete-btn">Delete :(</button>
          </div>`
}

function createNewToy(event) {
  event.preventDefault();
  const newToy = {
    name: toyNameInputEl.value,
    image: toyImageInputEl.value,
    likes: 0
  }
  let id = document.querySelectorAll('.like-btn').length
  newToy.id = id +1
  const newToyItem = renderToyCard(newToy);
  toyListEl.innerHTML += newToyItem;
  const a = saveToyToApi(newToy);
  toySubmitForm.reset();
}

function saveToyToApi(newToy) {
  fetch('http://localhost:3000/toys/', {
    method: 'POST',
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(newToy)
  }).then(response => response.json())
}


document.addEventListener('click', (e) => {
  if (e.target.className === "like-btn") {
    let id = e.target.dataset.id
    let likesP = e.target.previousElementSibling;
    let likesCount = parseInt(likesP.innerText);
    likesP.innerText = `${++likesCount} likes`;
    fetch('http://localhost:3000/toys/' + `${id}`, {
      method: 'PATCH',
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({likes: likesCount})
    }).then(res => res.json())
  }
})



document.addEventListener('click', (e) => {
  if (e.target.className === "delete-btn") {
    let id = e.target.dataset.id
    fetch('http://localhost:3000/toys/' + `${id}`, {
      method: 'DELETE',
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify()
    }).then(res => res.json())
    e.target.parentElement.outerHTML = ""
  }
})

toySubmitForm.addEventListener('submit', createNewToy)

document.addEventListener('DOMContentLoaded', andysToys);
