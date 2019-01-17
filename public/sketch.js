var database, storage;
var score = [];
var flowers = [];
var locations = [];
var lokaler = ["Blomst3a1", "Blomst3a2"];
var numFlowers;
var flowerImg, backImg, scaling;
var backbutton, site, myFont;

function preload() {
  let klar = false;
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCI_InWdB8rCzHey_-QpvmGEigN5NH36NQ",
    authDomain: "test-454bb.firebaseapp.com",
    databaseURL: "https://test-454bb.firebaseio.com",
    projectId: "test-454bb",
    storageBucket: "test-454bb.appspot.com",
    messagingSenderId: "947750622088"
  };
  firebase.initializeApp(config);
  storage = firebase.storage().ref();

  myFont = loadFont("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/FlameFetish.ttf?alt=media&token=61d214fd-b336-4673-b4a8-d5ca09eabbee");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  for (let i = 0; i < lokaler.length; i++) {
    firebase.database().ref(lokaler[i]).orderByKey().limitToLast(1).on('child_added', function(data) {
    var string = data.val().temperature + ' ' + data.val().humidity + ' ' + data.val().score + ' ' + data.val().level;
    score[i] = string.split(" ");
    });
  }
  // Da den første hentning af firebase-data er udefineret benyttes et if-statement til at undvige fejl
  if (typeof score[0] == 'undefined') {
    for (let i = 0; i < lokaler.length; i++) {
      score[i] = [];
      for (let j = 0; j < lokaler.length; j++) {
        score[i][j] = 1;
      }
    }
  }

  flowerImg = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/testBlomst.jpg?alt=media&token=6033f3af-80f1-4a57-88a4-75af12524357");
  backImg = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/tilbage.png?alt=media&token=351e1dd3-ee90-44ae-963c-c0f104034546");

  numFlowers = lokaler.length;

  if(numFlowers > 5){
	  scaling = height / 7;
    for(let i = 0; i < numFlowers; i++) {
      locations.push(createVector(((i % 5 + 1)) / 6, (ceil((i + 1) / 5) + 0.5) / 5));
      let loc = createVector(locations[i].x * width, locations[i].y * height);

      flowers.push(new Flower(loc, scaling, 50, lokaler[i]));
    }
  } else {
    scaling = height / (1 + numFlowers);

    for(let i = 0; i < numFlowers; i++) {
      locations.push(createVector((i + 1)/(numFlowers + 1), 1 / 2));
      let loc = createVector(locations[i].x * width, locations[i].y * height);

      flowers.push(new Flower(loc, scaling, 50, lokaler[i]));
    }
  }
  backbutton = new Backbutton(backImg);
  site = 'main';
}

function draw() {
  // opdatering af vinduet
  createCanvas(window.innerWidth, window.innerHeight);
  background(250);

  if(flowers.length>5) {
    scaling=height/7;
  } else scaling= height / (1 + numFlowers);

  if(site == 'main') {
    textSize(height * 0.09);
    textAlign(LEFT, TOP);
    textFont(myFont);
    text('Blomsterhaven', 30, 30);

    textFont('Arial');
    textSize(height * 0.03);

    for (let i = 0; i < numFlowers; i++){
      let loc = createVector(locations[i].x * width, locations[i].y * height);
      flowers[i].update(loc, scaling, score[i][2], score[i][3]);
      flowers[i].display(flowerImg);
    }
  }
  for (let i = 0; i < flowers.length; i++) {
    if(site == flowers[i].name) {
	    let loc = createVector(width / 2, height / 2);

      textSize(height * 0.05);
    	flowers[i].update(loc, height * 0.6, score[i][2], score[i][3]);
    	flowers[i].display(flowerImg);

    	backbutton.run();
    }
  }
}

function mouseReleased(){
  if(backbutton.register()){
 	    site = 'main';
   }

  for(let i = 0; i < flowers.length; i++) {
    if(flowers[i].register() && site == 'main'){
      	site = flowers[i].name;
      	print(flowers[i].name);
    }
  }
}
