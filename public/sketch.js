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
  flowerImages[0] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_1-640x640.png?alt=media&token=d124b445-a144-40fe-8c00-0bb063e25f19");
  flowerImages[1] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_2-640x640.png?alt=media&token=dcb0c466-2e46-4d74-9118-b8f00392bf23");
  flowerImages[2] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_3-640x640.png?alt=media&token=89df246c-b503-4e96-81fb-ec1f63b503d4");
  flowerImages[3] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_4-640x640.png?alt=media&token=50e7303e-af87-4987-95c3-487dd69a27f69");
  flowerImages[4] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_5-640x640.png?alt=media&token=1f550e3c-126d-4667-8c5e-7630681cad78");
  flowerImages[5] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_6-640x640.png?alt=media&token=6eb0be56-dca0-4349-a02f-88739b0cd33d");
  flowerImages[6] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_7-640x640.png?alt=media&token=e65d49b9-2ed9-4c4c-bd01-5f223e24b381");
  flowerImages[7] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_8-640x640.png?alt=media&token=8e10ff94-ed36-4561-98c5-93b5a22787bd");
  flowerImages[8] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_9-640x640.png?alt=media&token=4265fb4b-4d75-4db3-98ad-b2680706b04d");
  flowerImages[9] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_10-640x640.png?alt=media&token=7d7c6bd8-6bef-44fd-a878-8ba2aa149659");
  // hent stilk-billeder
  stemImages[0] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_1-640x640.png?alt=media&token=2b2c5b2d-65ff-48cc-9318-5585ef65a5e0");
  stemImages[1] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_2-640x640.png?alt=media&token=af9c7e29-b6ab-4306-bab9-a9d745063d53");
  stemImages[2] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_3-640x640.png?alt=media&token=ed763763-b411-4a5b-b6f8-5346eafdd293");
  stemImages[3] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_4-640x640.png?alt=media&token=139bf028-a855-4e4f-a82a-41463e8ebbb4");
  stemImages[4] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_5-640x640.png?alt=media&token=c8c112d3-3d37-4d79-8baa-eda36569e149");
  stemImages[5] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_6-640x640.png?alt=media&token=e0cec64e-4e0b-43d5-9d7f-00edb2e5b93d");
  stemImages[6] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_7-640x640.png?alt=media&token=6ee032bb-eb8a-4ea2-ab91-6c891e12034f");
  stemImages[7] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_8-640x640.png?alt=media&token=e50432fa-a5a8-4300-9e8d-10963d8ebafe");
  stemImages[8] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_9-640x640.png?alt=media&token=92867cb2-55ef-4b33-a1db-cf4c497831b2");
  stemImages[9] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_10-640x640.png?alt=media&token=9bca6ed6-e7ed-434a-9a28-668c98fbb6ea");
}
