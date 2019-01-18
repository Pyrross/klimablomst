//Klasse der håndterer tilbage knappen
function Backbutton(iImg) {
    this.location = createVector(5, 5);
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
            image(this.img, this.location.x + Resize(80) / 2, this.location.y + Resize(80) / 2, Resize(100), Resize(100));
        } else image(this.img, this.location.x + Resize(80) / 2, this.location.y + Resize(80) / 2, Resize(80), Resize(80));
    }
}

//Klasse til bestemmelse af distance mellem to lokationer som vektorer
function Distance(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

function Resize(maxDim) {
  // antager tilnærmelsesvis kvadratisk billededimension. Ville være mere hensigtsmæssigt med en aftangede eksponentialfunktion.
  return Math.min(window.innerWidth, window.innerHeight) * maxDim / 1920;
}
