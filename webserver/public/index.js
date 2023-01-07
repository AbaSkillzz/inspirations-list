function clearEveryTime(){
   document.getElementById("list").innerHTML = ""; //clear eventual previous content
   const form = document.getElementById("form-for-api").hidden = true;
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
   const form = document.getElementById("form-for-api");
   form.hidden = false;
   
   form.addEventListener("submit", (event) => {
      event.preventDefault(); //stop default action of the event(submission)
      sendId();
   });

   function sendId(){
      const id = document.getElementById("id").value;
      //send the id to the api
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function onServerResponse(){ 
         if(this.status==200 && this.readyState==4){
            console.log("OK response from server");
            alert(this.response);
         }
      }
      xhttp.open("DELETE", `http://localhost:8000/inspirations/${id}`, true);
      xhttp.send();
   }
});


//ADD NEW INSPIRATION
document.getElementById("add-inspiration-btn").addEventListener("click", () => {

});