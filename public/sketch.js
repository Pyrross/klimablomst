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
            flowers[i].display();
        }
    }

    for (let i = 0; i < flowers.length; i++) {
        if (site == flowers[i].name) {
            let loc = createVector(width / 2, height / 3);
            textAlign(LEFT, TOP);
            textSize(height * 0.05);
            flowers[i].update(loc, height * 0.6, flowerData[i]);
            flowers[i].displayOnly();

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
    if ((parseInt(key.slice(0,4)) == now.getFullYear()) && (parseInt(key.slice(4,6)) == now.getMonth() + 1) && (parseInt(key.slice(6,8)) == now.getDate()) && (abs(parseInt(key.slice(8,10)) + 1 - now.getHours())) <= 1) {
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
  flowerImages[0] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_1.png?alt=media&token=37ac1270-7287-45cb-8413-3e64ce84afb4");
  flowerImages[1] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_2.png?alt=media&token=0f6121ad-679b-41ad-adcf-fc2ace8a28ad");
  flowerImages[2] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_3.png?alt=media&token=0d31649d-5a01-4ad5-b817-fe3df0e812ce");
  flowerImages[3] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_4.png?alt=media&token=a190538f-2fc1-4b64-ad16-947ec3329f28");
  flowerImages[4] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_5.png?alt=media&token=b1347359-4eb6-4bf6-8122-a83751153f76");
  flowerImages[5] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_6.png?alt=media&token=a7416ba5-d2f1-48f9-88e4-fe017c366e1a");
  flowerImages[6] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_7.png?alt=media&token=1e2ea7de-b8a2-43fc-b3f4-92d95994735a");
  flowerImages[7] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_8.png?alt=media&token=829c55b7-1649-4aba-885c-892430c67c8d");
  flowerImages[8] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_9.png?alt=media&token=8c44872f-6b77-4c01-b14a-5bc0a880d17a");
  flowerImages[9] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2FBlomst_10.png?alt=media&token=f2316c19-16c1-40a8-8800-de5bb7bebeb9");
  // hent stilk-billeder
  stemImages[0] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_1.png?alt=media&token=278a0261-794b-4dca-b89b-569b22bcc0b9");
  stemImages[1] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_2.png?alt=media&token=7f985cde-7396-48d9-880c-75190c7ee1a0");
  stemImages[2] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_3.png?alt=media&token=93bf4ba2-8358-4234-89c6-0e40c8df35a6");
  stemImages[3] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_4.png?alt=media&token=e98cc1d8-0e0a-4dba-b34b-2cd1473450a0");
  stemImages[4] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_5.png?alt=media&token=82a531e5-a98b-4555-89f2-22cf1cd7de43");
  stemImages[5] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_6.png?alt=media&token=f3aaa9ed-9612-46f8-be3f-8e0b94f5e2a7");
  stemImages[6] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_7.png?alt=media&token=c3470dc0-bd32-4bfa-b0ba-a7fa122ddc8d");
  stemImages[7] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_8.png?alt=media&token=8da41ddc-110f-44a1-8479-fe467283b6bf");
  stemImages[8] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_9.png?alt=media&token=e41e7406-53ba-49ae-b513-9df06220742e");
  stemImages[9] = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/blomst%2Fstilk_10.png?alt=media&token=361295ab-f88e-46e4-a64a-ab5b870146cb");
}
