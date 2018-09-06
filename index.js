//On load of the page, GET fetch, to see the ingredients
//On load of the page, GET fetch, to see the ice creams
//On click on Create Ice Cream, POST fetch, rendering to the DOM
//When clicking on Edit, (make a fetch to ingredients?) changes the ice cream card to be a form
//On Submit, make a PATCH request, rerender the ice cream card
//On click of delete, make a DELETE request, remove that ice cream card form DOM

document.addEventListener('DOMContentLoaded', function(){
  getAndRenderIngredientOntoForm()
  getAndRenderIceCreamOntoDOM()
  let createForm = document.querySelector('#iceCreamForm')
  createForm.addEventListener('submit', createNewIceCream)
})

function createNewIceCream(event){
  event.preventDefault()
  let newIceCreamName = event.target[0].value
  let ingredientsInNewIceCream = []
  for (let i = 1; i < 7; i++) {
    if(event.target[i].checked) {
      ingredientsInNewIceCream.push(event.target[i].dataset.ingredientId)
    }
  }
  if (newIceCreamName) {
    let iceCreamObj = {"name": newIceCreamName, "ingredients": ingredientsInNewIceCream}
    fetch(`http://localhost:3000/ice_cream`, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json',
        "Accept": 'application/json'
      },
      body: JSON.stringify(iceCreamObj)
    })
      .then(response => response.json())
      .then(data => {
        renderIceCream(data)
      })
    event.target.reset()
  } else {
    alert("Please enter a name for your flavor.")
  }
}

function getAndRenderIceCreamOntoDOM(){
  fetch('http://localhost:3000/ice_cream')
  .then(response => response.json())
  .then(data => {
    data.forEach(iceCream => {
      renderIceCream(iceCream)
    })
  })
}

function deleteIceCream(event){
  let id = event.target.id.split("-")[3]
  fetch(`http://localhost:3000/ice_cream/${id}`, {
   method: "DELETE"
  })
  .then(response => response.json())
  .then(data => {
    document.querySelector(`#ice-cream-${id}`).remove()
  })
}

function createEditForm(){
  let id = event.target.id.split("-")[3]
  let div = document.querySelector(`#ice-cream-${id}`)
  let currentName = div.querySelector('h3').innerText
  let currentIngredients = Array.from(div.querySelectorAll('li')).map(li => li.id)
  let nameInput = document.createElement('input')
  let imageElement = document.createElement('img')
  let buttonDiv = document.createElement('div')
  let submitButton = document.createElement('button')
  let ingredientsElement = document.createElement('h4')
  div.innerHTML = ""
  nameInput.type = 'text'
  nameInput.value = currentName
  imageElement.src = "icecream.jpeg"
  submitButton.innerText = 'Submit'
  submitButton.className = 'submitButton'
  submitButton.id = `submit-ice-cream-${id}`
  submitButton.addEventListener('click', updateIceCream)
  ingredientsElement.innerText = "Ingredients:"
  buttonDiv.appendChild(submitButton)
  div.appendChild(nameInput)
  div.appendChild(imageElement)
  div.appendChild(buttonDiv)
  div.appendChild(ingredientsElement)
  let ul = document.querySelector('#iceCreamCheckboxes')
  let clonedList = ul.cloneNode(true)
  let listItems = clonedList.querySelectorAll('li')
  listItems.forEach(ingredient => {
    if (currentIngredients.includes(ingredient.id)) {
      (ingredient.querySelector('input').checked = true)
    }
  })
  div.appendChild(clonedList)
}

function updateIceCream(event){
  let id = event.target.id.split("-")[3]
  let div = document.querySelector(`#ice-cream-${id}`)
  let newName = div.querySelector('input').value
  let newIngredientIds = []
  div.querySelectorAll('li').forEach(li => {
    if (li.querySelector('input').checked) {
      newIngredientIds.push(li.querySelector('input').dataset.ingredientId)
    }
  })
  let editedData = {name: newName, ingredients: newIngredientIds}
  div.innerHTML = ""
  fetch(`http://localhost:3000/ice_cream/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedData),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    renderIceCream(data, div)
  })
}

function renderIceCream(iceCream, div){
  let iceCreamGrid = document.querySelector('#iceCreamGrid')
  let iceCreamDiv
  if (!div) {
    iceCreamDiv = document.createElement('div')
    iceCreamDiv.id = `ice-cream-${iceCream.id}`
  }
  let nameElement = document.createElement('h3')
  let imageElement = document.createElement('img')
  let buttonDiv = document.createElement('div')
  let editButton = document.createElement('button')
  let deleteButton = document.createElement('button')
  let ingredientsElement = document.createElement('h4')
  let ingredientsList = document.createElement('ul')
  let ingredients = iceCream.ingredients
  nameElement.innerText = `${iceCream.name}`
  imageElement.src = "icecream.jpeg"
  editButton.innerText = 'Edit'
  editButton.className = 'editButton'
  editButton.id = `edit-ice-cream-${iceCream.id}`
  editButton.addEventListener('click', createEditForm)
  deleteButton.innerText = 'Delete'
  deleteButton.className = 'deleteButton'
  deleteButton.id = `delete-ice-cream-${iceCream.id}`
  deleteButton.addEventListener('click', deleteIceCream)
  buttonDiv.id = 'editDeleteButtons'
  ingredientsElement.innerText = 'Ingredients:'
  ingredientsList.id = `ul-${iceCream.id}`
  ingredients.forEach(ingredientNumString => {
    let ingredientString = document.querySelector(`#ingredient-${ingredientNumString}`).innerText
    let li = document.createElement('li')
    li.id = `ingredient-${ingredientNumString}`
    li.innerText = ingredientString
    ingredientsList.appendChild(li)
  })
  buttonDiv.appendChild(editButton)
  buttonDiv.appendChild(deleteButton)
  if (div) {
    div.appendChild(nameElement)
    div.appendChild(imageElement)
    div.appendChild(buttonDiv)
    div.appendChild(ingredientsElement)
    div.appendChild(ingredientsList)
  } else {
    iceCreamDiv.appendChild(nameElement)
    iceCreamDiv.appendChild(imageElement)
    iceCreamDiv.appendChild(buttonDiv)
    iceCreamDiv.appendChild(ingredientsElement)
    iceCreamDiv.appendChild(ingredientsList)
    iceCreamGrid.appendChild(iceCreamDiv)
  }
}


function getAndRenderIngredientOntoForm(){
  fetch("http://localhost:3000/ingredient")
  .then(response => response.json())
  .then(data => {
      let ul = document.querySelector('#iceCreamCheckboxes')
      data.forEach(ingredient => {
        let li = document.createElement('li')
        li.innerText = ingredient.name
        li.id = `ingredient-${ingredient.id}`
        let checkbox = document.createElement('input')
        checkbox.dataset.ingredientId = ingredient.id
        checkbox.type = "checkbox"
        li.appendChild(checkbox)
        ul.appendChild(li)
      })
  })
}
