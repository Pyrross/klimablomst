function Backbutton(iImg) {
  this.location = createVector(30, 30);
  this.img = iImg;

  // tjekker om musen er henover. Vektorafstand bruges da det ern en cirkulær figur.
  this.register = function() {
    this.mouseLoc = createVector(mouseX, mouseY);
    if(Distance(this.location, this.mouseLoc) < window.innerWidth / 56) {
        return true;
      } else {
      return false;
    }
  }

  this.display = function() {
   noTint();
   imageMode(CENTER);
   if(this.register()) {
     image(this.img, this.location.x, this.location.y, window.innerWidth/25, window.innerWidth/25);
   } else image(this.img, this.location.x, this.location.y, window.innerWidth/28, window.innerWidth/28);
  }

  this.run = function() {
    this.display();
  }
}

function Distance(a, b) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}
