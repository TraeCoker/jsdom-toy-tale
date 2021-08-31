let addToy = false;


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchToys();
});

function fetchToys() {
  fetch("http://localhost:3000/toys")
  .then(function(response) {
    return response.json();
    }).then(function(json) {
      for (const toyObject of json) {
        addToyToCollection(toyObject);
      };
    });
}

function addToyToCollection(toy){
  const toyCollection = document.getElementById("toy-collection");

  const toyCard = document.createElement("div");
  toyCard.className = "card";

  const name = document.createElement("h2");
  name.innerHTML = toy.name;

  const img = document.createElement("img");
  img.src = toy.image;
  img.className = "toy-avatar"

  const likes = document.createElement("p");
  likes.innerHTML = `${toy.likes} likes`; 

  const btn = document.createElement("button");
  btn.className = "like-btn";
  btn.innerHTML = "Like";
  btn.id = toy.id 

  toyCard.appendChild(name);
  toyCard.appendChild(img);
  toyCard.appendChild(likes);
  toyCard.appendChild(btn);

  toyCollection.appendChild(toyCard);

  btn.addEventListener('click', function(event){
    let currentLikes = event.target.parentElement.getElementsByTagName("p")[0].innerHTML
    currentLikes = parseInt(currentLikes)
  
    fetch(`http://localhost:3000/toys/${event.target.id}`, {

        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
          "likes": currentLikes += 1
        })
    }) 
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      event.target.parentElement.getElementsByTagName("p")[0].innerHTML = `${currentLikes} likes`
    });
    

  })

}

const form = document.querySelector(".add-toy-form")

form.addEventListener('submit', function(event) {
  const nameInput = document.getElementsByClassName("input-text")[0].value;
  const imageInput = document.getElementsByClassName("input-text")[1].value;

  const toyObject= {
    name: nameInput, 
    image: imageInput, 
    likes: 0
  }

  fetch("http://localhost:3000/toys", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(toyObject)
    }) 
    .then(function(response) {
        return response.json();
      })
      .then(function(object) {
       addToyToCollection(object);
      })
      .catch(function(error) {
        const errorMessage = document.createElement("h1");
        const body = document.querySelector("body");
        errorMessage.innerHTML = error.message;

        body.appendChild(errorMessage);

      });
})
