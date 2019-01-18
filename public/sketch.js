var database, storage;
var flowerData = [];
var flowers = [];
var locations = [];
var rooms = ["3a1", "3a2"];
var numFlowers;
var flowerImg, backImg, scaling;
var backbutton, site, fontFlameFetish;

//Funktion der hent tekstfont
function preload() {
    fontFlameFetish = loadFont("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/FlameFetish.ttf?alt=media&token=61d214fd-b336-4673-b4a8-d5ca09eabbee");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  for (let i = 0; i < rooms.length; i++) {
    firebase.database().ref(rooms[i]).orderByKey().limitToLast(1).on('child_added', function(data) {
    var string = data.val().temperature + ' ' + data.val().humidity + ' ' + data.val().score + ' ' + data.val().level + ' ' + data.key + ' ' + data.val().change;
    flowerData[i] = string.split(" ");
    });
  }
  // Da den første hentning af firebase-data er udefineret benyttes et if-statement til at undvige fejl
  if (typeof flowerData[0] == 'undefined') {
    for (let i = 0; i < rooms.length; i++) {
      flowerData[i] = [];
      for (let j = 0; j < 6; j++) {
        flowerData[i][j] = 1;
      }
    }
  }

    //Hent filer fra online arkiv
    flowerImg = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/testBlomst.jpg?alt=media&token=6033f3af-80f1-4a57-88a4-75af12524357");
    backImg = loadImage("https://firebasestorage.googleapis.com/v0/b/test-454bb.appspot.com/o/tilbage.png?alt=media&token=351e1dd3-ee90-44ae-963c-c0f104034546");

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
      print("tampen brænder");
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
