const firebaseConfig = {
 apiKey: "PASTE_HERE",
 authDomain: "PASTE_HERE",
 databaseURL: "PASTE_HERE",
 projectId: "PASTE_HERE"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let foundCount = 0;
let treasures = [];
let hintsUsed = {};

const gameDiv = document.getElementById("game");

db.ref("treasures").on("value", snap => {

 gameDiv.innerHTML = "";
 treasures = [];

 snap.forEach(child => {
   let t = child.val();
   t.id = child.key;
   treasures.push(t);
 });

 treasures.forEach((t,index)=>{

   if(t.found) return;

   let div = document.createElement("div");

   div.innerHTML = `
   <h3>${t.name}</h3>
   <button onclick="showHint('${t.id}')">Help</button>
   <div id="hint-${t.id}"></div>
   `;

   gameDiv.appendChild(div);

 });

 checkFinish();

});

function showHint(id){

 let t = treasures.find(x=>x.id===id);

 let container = document.getElementById("hint-"+id);

 if(!hintsUsed[id]){
   container.innerHTML += `<img src="${t.photo1}">`;
   hintsUsed[id] = 1;
 }else{
   container.innerHTML += `<img src="${t.photo2}">`;
   document.getElementById("map").style.display="block";
 }

}

navigator.geolocation.watchPosition(pos=>{

 let lat = pos.coords.latitude;
 let lng = pos.coords.longitude;

 treasures.forEach(t=>{

   if(t.found) return;

   let d = distance(lat,lng,t.lat,t.lng);

   if(d < 0.02){

     db.ref("treasures/"+t.id).update({
       found:true
     });

     showFireworks();

   }

 });

});

function distance(lat1,lon1,lat2,lon2){

 let R=6371;

 let dLat=(lat2-lat1)*Math.PI/180;
 let dLon=(lon2-lon1)*Math.PI/180;

 let a=
 Math.sin(dLat/2)**2+
 Math.cos(lat1*Math.PI/180)*
 Math.cos(lat2*Math.PI/180)*
 Math.sin(dLon/2)**2;

 let c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

 return R*c;

}

function showFireworks(){
 alert("🎆 Found!");
}

function checkFinish(){

 let remaining = treasures.filter(t=>!t.found);

 if(remaining.length === 0){

   gameDiv.innerHTML = `
   <h2>All found!</h2>
   <img src="FINAL_IMAGE_URL">
   `;

 }

}
