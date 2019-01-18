//Klasse der håndterer tilbage knappen
function Backbutton(iImg) {
    this.location = createVector(30, 30);
    this.img = iImg;

    //Funktion - tjekker om musen er henover knappen. Vektorafstand bruges da det ern en cirkulær figur.
    this.register = function() {
        this.mouseLoc = createVector(mouseX, mouseY);
        if (Distance(this.location, this.mouseLoc) < window.innerWidth / 56) return true;
        else return false;
    }

    //Funktion - viser tilbage knappen
    this.display = function() {
        noTint();
        imageMode(CENTER);
        if (this.register()) {
            image(this.img, this.location.x, this.location.y, window.innerWidth / 25, window.innerWidth / 25);
        } else image(this.img, this.location.x + Resize(69), this.location.y + Resize(69), Resize(69), Resize(69));
    }
}

//Klasse til bestemmelse af distance mellem to lokationer som vektorer
function Distance(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

function Resize(maxDim) {
  // antager tilnærmelsesvis kvadratisk billededimension
  print(maxDim / Math.max(window.innerWidth, window.innerHeight));
}
