function clearEveryTime(){
   document.getElementById("list").innerHTML = ""; //clear eventual previous content
   const deleteForm = document.getElementById("delete-form-for-api");
   deleteForm.hidden = true;
   deleteForm.reset(); //clear previous data in form fields
   const addForm = document.getElementById("add-form-for-api")
   addForm.hidden = true;
   addForm.reset(); 
   const updateForm = document.getElementById("update-form-for-api");
   updateForm.hidden = true;
   updateForm.reset();
}

//LIST INSPIRATION BUTTON
document.getElementById("list-inspirations-btn").addEventListener("click", () => {
   clearEveryTime();

   const xhttp = new XMLHttpRequest();

   xhttp.onreadystatechange = function onServerResponse(){
      if(this.readyState==4 && this.status==200){
         const response = JSON.parse(this.response);

         const listDiv = document.getElementById("list");
         for(let i=0; i<response.length; i++){
            //a div for each inspiration
            const newDiv = document.createElement("div");
            newDiv.style.marginTop = "20px";

            //everything inside each inspiration's div
            let div = document.createElement("div");

            const h2 = document.createElement("h2");
            h2.innerText = response[i].name
            h2.style.color = "gold";
            h2.style.display = "inline";
            let p = document.createElement("p");
            p.innerText = `id: ${response[i]._id}`;
            p.style.display = "inline";
            div.appendChild(h2);
            div.appendChild(p)
            newDiv.appendChild(div); // add inner things to single inspiration's div

            //image
            div = document.createElement("div");
            let image = document.createElement("img");
            image.src = response[i].image;
            div.appendChild(image);
            newDiv.appendChild(div);

            div = document.createElement("div");
            let h3 = document.createElement("h3");
            h3.style.display = "inline";
            h3.innerText = "Description: ";
            p = document.createElement("p");
            p.style.display = "inline";
            p.innerText = response[i].description;
            div.appendChild(h3);
            div.appendChild(p);
            newDiv.appendChild(div);

            div = document.createElement("div");
            h3 = document.createElement("h3");
            h3.style.display = "inline";
            h3.innerText = "Fields of influence: ";
            p = document.createElement("p");
            p.style.display = "inline";
            p.innerText = response[i].influenceField;
            div.appendChild(h3);
            div.appendChild(p);
            newDiv.appendChild(div);

            //add new_div to list_div in html file
            listDiv.appendChild(newDiv);
         }
      }
   };
   
   xhttp.open("GET", "http://localhost:8000/inspirations/", true);
   xhttp.send();
});


//DELETE INSPIRATION BUTTON
document.getElementById("delete-inspiration-btn").addEventListener("click", () => {
   clearEveryTime();
   //show the form
   const form = document.getElementById("delete-form-for-api");
   form.hidden = false;
   
   form.addEventListener("submit", (event) => {
      event.preventDefault(); //stop default action of the event(submission)
      sendId();
   });

   function sendId(){
      const id = document.getElementById("delete-id").value;
      //send the id to the api
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function onServerResponse(){ 
         if(this.status==200 && this.readyState==4){
            console.log("OK response from server, deleted inspiration.");
            alert(this.response);
         }
      }
      xhttp.open("DELETE", `http://localhost:8000/inspirations/${id}`, true);
      xhttp.send();
   }
});


//ADD NEW INSPIRATION
document.getElementById("add-inspiration-btn").addEventListener("click", () => {
   clearEveryTime();

   const form = document.getElementById("add-form-for-api");
   form.hidden = false;

   form.addEventListener("submit", (event) => {
      event.preventDefault(); 
      sendData();
   });

   function sendData(){
      const name = document.getElementById("add-name").value;
      const description = document.getElementById("add-description").value;
      const influenceField = document.getElementById("add-influenceField").value;
      //image 
      const imageFile = document.getElementById("add-image").files[0];
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("influenceField", influenceField);
      formData.append("image", imageFile);
      
      //request to api
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(){
         if(this.status==200 && this.readyState==4){
            const response = this.responseText;
            alert(response);
            console.log(`Response received, ${response}`);

         }
      }
      xhttp.open("POST", "http://localhost:8000/inspirations", true);
      //xhttp.setRequestHeader("Content-type", "multipart/form-data");
      xhttp.send(formData);
   }
});


//UPDATE AN INSPIRATION
document.getElementById("update-inspiration-btn").addEventListener("click", () => {
   clearEveryTime();
   
   const form = document.getElementById("update-form-for-api");
   form.hidden = false;

   //wait for submit event
   form.addEventListener("submit", (event) => {
      event.preventDefault();
      sendData();
   });

   function sendData(){
      const id = document.getElementById("update-id").value;
      const description = document.getElementById("update-description").value;
      //convert to json to send 
      const obj = {
         "description": description
      }
      const json = JSON.stringify(obj);

      //ajax request 
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(){
         if(this.status==200 && this.readyState==4){
            console.log(`Response received, ${this.response}`);
            alert(this.responseText);
         }
      }
      xhttp.open("PATCH",`http://localhost:8000/inspirations/${id}`, true);
      xhttp.setRequestHeader("Content-type", "application/json"); //to let server know that is receiving json
      xhttp.send(json);
   }
});