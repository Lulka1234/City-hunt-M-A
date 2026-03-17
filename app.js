const firebaseConfig = {
 apiKey: "AIzaSyCZUQZ4qSxcdjP6uSv0o62jXDpz8SZqLBs",
 authDomain: "city-hunt-m-a.firebaseapp.com",
 databaseURL: "https://city-hunt-m-a-default-rtdb.europe-west1.firebasedatabase.app",
 projectId: "city-hunt-m-a"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let treasures = [];

const gameDiv = document.getElementById("game");
const mapDiv = document.getElementById("map");

let map = null;

db.ref("treasures").on("value", snap => {

 gameDiv.innerHTML = "";
 treasures = [];

 snap.forEach(child => {
   let t = child.val();
   t.id = child.key;
   treasures.push(t);
 });

 treasures.forEach(t => {

   if(t.approved) return;

   let div = document.createElement("div");

   div.innerHTML = `
   <h3>${t.name}</h3>

   <button onclick="hint1('${t.id}')">Clue 1</button>
   <button onclick="hint2('${t.id}')">Clue 2</button>

   <div id="h-${t.id}"></div>

   <button onclick="found('${t.id}')">I FOUND IT</button>
   <p>Status: ${t.status || "Not found"}</p>
   `;

   gameDiv.appendChild(div);

 });

});

function hint1(id){
 let t = treasures.find(x=>x.id===id);
 document.getElementById("h-"+id).innerHTML =
 `<img src="${t.photo1}" width="250">`;
}

function hint2(id){

 let t = treasures.find(x=>x.id===id);

 document.getElementById("h-"+id).innerHTML +=
 `<img src="${t.photo2}" width="250">`;

 mapDiv.style.display = "block";

 if(!map){
   map = L.map('map').setView([t.lat,t.lng],14);
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
 }

}

function found(id){

 db.ref("treasures/"+id).update({
   status:"pending"
 });

 alert("Waiting for admin approval...");

}
