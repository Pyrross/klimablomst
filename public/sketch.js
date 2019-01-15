var database, storage;
var score = [];
var lokaler[] = ["Blomst3a1", "Blomst3a2"];

var numFlowers;
var scaling;

var flowers = [];
var locations = [];

var flowerImg;
var backImg;


var backbutton;

var site;

var myFont;

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

  if(flowers.length>5){
    scaling=height/7;
  } else {
    scaling= height / (1 + numFlowers);
  }

  if(site == 'main') {
    textSize(height * 0.09);
    textAlign(LEFT, TOP);
    textFont(myFont);
    text('Your Garden', 30, 30);

    textFont('Arial');
    textSize(height * 0.03);

    for(let i = 0; i < numFlowers; i++){
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

function mouseReleased() {

  if(backbutton.register()){
 	    site = 'main';
  	  print('bop');
   }

  for(let i = 0; i < flowers.length; i++) {
    if(flowers[i].register() && site == 'main'){
      	site = flowers[i].name;
      	print(flowers[i].name);
    }

  }
}

/*
var scaling1;
var origin1;
var rating1;
var flower1;

var scaling2;
var origin2;
var rating2;
var flower2;
*/

/*
  scaling1= 50;
  rating1= 50;
  origin1= createVector(width*1/4,height/4);
  flower1= new Flower(origin1, scaling1,rating1,'flower 1');

  scaling2 = 50;
  rating2 = 20;
  origin2 = createVector(width*3/4,height/4);
  flower2 = new Flower(origin2, scaling2,rating2, 'flower 2');
  */


 /*
  	origin1= createVector(width*1/4,height/4);
  	origin2= createVector(width*3/4,height/4);

    scaling1 = 50;
    scaling2 = 50;

  	flower1.update(origin1, scaling1, rating1);
  	flower2.update(origin2, scaling2, rating2);

  	flower1.display(flowerImg);
  	flower2.display(flowerImg);
    */


/*
  else if (site == 'flower1'){
    origin1 = createVector(width/2,height/2);
    scaling1 = height*0.75;

    flower1.update(origin1, scaling1, rating1);
    flower1.display(flowerImg);

    backbutton.run();

  } else if (site == 'flower2'){
    origin2 = createVector(width/2,height/2);
    scaling2 = height*0.75;

    flower2.update(origin2, scaling2, rating2);
    flower2.display(flowerImg);

    backbutton.run();
  }
  */
  /*
  else if (flower1.register()) {
    site = 'flower1';
    print('yep');
  } else if (flower2.register()) {
    site = 'flower2';
    print('waaa');
  }
  */
