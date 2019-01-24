//Klasse der håndterer tilbage knappen
function Backbutton(iImg) {
    this.location = createVector(30, 30);
    this.img = iImg;

    //Funktion - tjekker om musen er henover knappen. Vektorafstand bruges da det ern en cirkulær figur.
    this.register = function() {
        this.mouseLoc = createVector(mouseX, mouseY);
        if (Distance(this.location, this.mouseLoc) < window.innerWidth / 56) {
            return true;
        } else {
            return false;
        }
    }

    //Funktion - viser tilbage knappen
    this.display = function() {
        noTint();
        imageMode(CENTER);
        if (this.register()) image(this.img, this.location.x, this.location.y, 60 - 1920 / window.innerWidth * 2, 60 - 1920 / window.innerWidth * 2);
        else image(this.img, this.location.x, this.location.y, 42 - 1920 / window.innerWidth * 2, 42 - 1920 / window.innerWidth * 2);
    }
}

//Klasse til bestemmelse af distance mellem to lokationer som vektorer
function Distance(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}
