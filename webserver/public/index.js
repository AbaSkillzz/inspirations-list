//LIST INSPIRATION BUTTON
document.getElementById("list-inspirations-btn").addEventListener("click", () => {
   const xhttp = new XMLHttpRequest();

   xhttp.onreadystatechange = function onServerResponse(){
      if(this.readyState==4 && this.status==200){
         const response = JSON.parse(this.response);
   
         for(let i=0; i<response.length; i++){
            const listDiv = document.getElementById("list");
            //a div for each inspiration
            const newDiv = document.createElement("div");
            
            //everithing inside each inspiration's div
            const h2 = document.createElement("h2");
            h2.innerText = response[i].name
            h2.style.color = "gold";
            newDiv.appendChild(h2); // add inner things to single inspiration's div

            let div = document.createElement("div");
            let h3 = document.createElement("h3");
            h3.style.display = "inline";
            h3.innerText = "Description: ";
            let p = document.createElement("p");
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
   
});
