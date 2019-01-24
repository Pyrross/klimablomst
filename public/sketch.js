var database, storage;
var flowerData = [];
var flowers = [];
var locations = [];
var flowerHistory = [];
var rooms = ["3a1", "3a2"];
var flowerImages = [];
var stemImages = [];
var numFlowers;
var flowerImg, backImg, scaling, arrowImg;
var backbutton, site, fontFlameFetish;

//Funktion der hent tekstfont
function preload() {
    fontFlameFetish = loadFont("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/FlameFetish.ttf?alt=media&token=61d214fd-b336-4673-b4a8-d5ca09eabbee");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  for (let i = 0; i < rooms.length; i++) {
    firebase.database().ref(rooms[i]).orderByKey().limitToLast(1).on('child_added', function(data) {
    var string = data.val().temperature + ' ' + data.val().humidity + ' ' + data.val().score + ' ' + data.val().level + ' ' + data.key + ' ' + data.val().change + ' ' + data.val().CO2;
    flowerData[i] = string.split(" ");
    flowerHistory[i].push(flowerData[i]);
    });
  }
  // Da den første hentning af firebase-data er udefineret benyttes et if-statement til at undvige fejl
  if (typeof flowerData[0] == 'undefined') {
    for (let i = 0; i < rooms.length; i++) {
      flowerData[i] = [];
      flowerHistory[i] = []
      for (let j = 0; j < 6; j++) {
        flowerData[i][j] = 1;
      }
    }
  }

  //Hent filer fra online arkiv
  getImages();
  //Opret en blomst per klasse
  numFlowers = rooms.length;
  if (numFlowers > 5) {
      scaling = height / 7;
      for (let i = 0; i < numFlowers; i++) {
          locations.push(createVector(((i % 5 + 1)) / 6, (ceil((i + 1) / 5) + 0.5) / 5));
          let loc = createVector(locations[i].x * width, locations[i].y * height);
          flowers.push(new Flower(loc, scaling, rooms[i], flowerData[i]));
      }
  } else {
      scaling = height / (1 + numFlowers);

      for (let i = 0; i < numFlowers; i++) {
          locations.push(createVector((i + 1) / (numFlowers + 1), 1 / 2));
          let loc = createVector(locations[i].x * width, locations[i].y * height);
          flowers.push(new Flower(loc, scaling, rooms[i], flowerData[i]));
      }
  }

  //Opret tilbage knap objekt
  backbutton = new Backbutton(backImg);
  site = 'main';
}

function draw() {
    //Opdatering af vinduet således at det passer til skærmstørrelsen
    createCanvas(window.innerWidth, window.innerHeight);
    background(250);

    //Design ændrer sig således at det passer til antallet af blomster.
    if (flowers.length > 5) {
        scaling = height / 7;
    } else scaling = height / (1 + numFlowers);

    //Titel på side - anvender speciel font
    if (site == 'main') {
        textSize(height * 0.09);
        textAlign(LEFT, TOP);
        textFont(fontFlameFetish);
        text('Blomsterhaven', 30, 30);
        textFont('Arial');
        textSize(height * 0.03);

        //Visualiser blomster
        for (let i = 0; i < numFlowers; i++) {
            let loc = createVector(locations[i].x * width, locations[i].y * height);
            flowers[i].update(loc, scaling, flowerData[i]);
            flowers[i].display(flowerImg);
        }
    }

    for (let i = 0; i < flowers.length; i++) {
        if (site == flowers[i].name) {
            let loc = createVector(width / 2, height / 3);
            textAlign(LEFT, TOP);
            textSize(height * 0.05);
            flowers[i].update(loc, height * 0.6, flowerData[i]);
            flowers[i].displayOnly(flowerImg);

            //Viser tilbage knap objektet.
            backbutton.display();
        }
    }
}

//Funktion - bliver musen sluppet?
function mouseReleased() {
    if (backbutton.register()) {
        site = 'main';
    }
    for (let i = 0; i < flowers.length; i++) {
        if (flowers[i].register() && site == 'main') {
            site = flowers[i].name;
            print(flowers[i].name);
        }
    }
}

function keyPressed() {
  if (keyCode == ESCAPE || keyCode == DOWN_ARROW) {
    site = 'main';
  }
  else if (keyCode == LEFT_ARROW && site != flowers[0].name) {
    var nextSite;
    for (let i = 0; i < rooms.length; i++) {
      if (flowers[i].name == rooms[i]) {
        nextSite = i - 1;
      }
    }
    site = flowers[nextSite].name;
  }
  else if (keyCode == RIGHT_ARROW && site != flowers[rooms.length - 1]) {
    var nextSite;
    for (let i = 0; i < rooms.length; i++) {
      if (flowers[i].name == rooms[i]) {
        nextSite = i + 1;
        site = flowers[nextSite].name;
        break;
      }
    }
  }
}

function IsFresh(key) {
  var now = new Date();
  if (typeof key == 'string') {
    if ((parseInt(key.slice(0,4)) == now.getFullYear()) && (parseInt(key.slice(4,6)) == now.getMonth() + 1) && (parseInt(key.slice(6,8)) == now.getDate()) && (parseInt(key.slice(8,10)) + 1 == now.getHours())) {
      if (now.getMinutes() - parseInt(key.slice(10,11)) < 30) {
        return true;
      }
      else return false;
    }
    else return false;
  }
}

function TimeOfMeasurement(key) {
  if (typeof key == 'string') {
    var time = key.slice(6,8) + "/" + key.slice(4,6) + "-" + key.slice(0,4) + ", " + key.slice(8,10) + ":" + key.slice(10,12) + ":" + key.slice(12,14);
    return time;
  }
}

function getImages() {
  flowerImg = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/testBlomst.jpg?alt=media&token=6033f3af-80f1-4a57-88a4-75af12524357");
  backImg = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/tilbage.png?alt=media&token=351e1dd3-ee90-44ae-963c-c0f104034546");
  arrowImg = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/pihl.png?alt=media&token=a71cbedc-bb11-4354-a604-61406a2ff618&fbclid=IwAR30B0QTeWFOvAirK2AgGD71qpG00KeA7f2skIldkFHO9OIzUeTC8THIMqk");
  // hent blomster-billeder
  flowerImages[0] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_1.png?alt=media&token=d3de177f-f1d4-47cd-8fa4-19fc28409cc2");
  flowerImages[1] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_2.png?alt=media&token=a29daef5-b7b0-4b6a-bc5c-4cd8dac2a9e9");
  flowerImages[2] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_3.png?alt=media&token=613dac43-83fa-437a-a21c-f9ee89df8338");
  flowerImages[3] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_4.png?alt=media&token=e255860a-6525-4fec-89b0-717b382097c9");
  flowerImages[4] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_5.png?alt=media&token=7ddae4b3-f00a-4e6d-a51c-1aac7d32af64");
  flowerImages[5] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_6.png?alt=media&token=520f4dc8-37ca-46c4-b751-c4cc8c77f0c1");
  flowerImages[6] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_7.png?alt=media&token=363e757d-330d-42dd-8b79-2843864e9589");
  flowerImages[7] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_8.png?alt=media&token=aa8367e2-f97d-4600-ad83-366e76c6f201");
  flowerImages[8] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_9.png?alt=media&token=41a19f75-ae41-4273-83a3-0a6e8c5b67e2");
  flowerImages[9] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_10.png?alt=media&token=efec1b2c-8625-4ace-954f-75ec5cc3639e");
  // hent stilk-billeder
  stemImages[0] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_1.png?alt=media&token=97729e21-bee6-438e-9e6e-8ad797a80a38");
  stemImages[1] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_2.png?alt=media&token=87928fc0-5d52-46aa-a42c-c51f352d4366");
  stemImages[2] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_3.png?alt=media&token=6913d822-ba00-4d04-ad0e-c33278289442");
  stemImages[3] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_4.png?alt=media&token=90ac8db4-dfd2-4c5e-9b07-ad2161fd4035");
  stemImages[4] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_5.png?alt=media&token=2f9600d7-d8d6-45e3-aaeb-ebf0d090fea0");
  stemImages[5] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_6.png?alt=media&token=55cfc073-612a-40b9-be9e-6bfcc32d991a");
  stemImages[6] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_7.png?alt=media&token=03b1b53f-55dd-4ab9-b271-17384a18dc46");
  stemImages[7] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_8.png?alt=media&token=2fba691a-471d-4273-b75c-3283366a8b54");
  stemImages[8] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_9.png?alt=media&token=25bf45a3-2094-4949-859e-4864fbd94048");
  stemImages[9] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_10.png?alt=media&token=1aab7771-b059-482a-8b6d-95ce76012d4d");
}
