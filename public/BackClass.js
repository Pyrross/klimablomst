function Backbutton(iImg) {

  this.location = createVector(30, 30);
  this.img = iImg;

  this.register = function() {
    if(mouseX < window.innerWidth/25 && mouseX > 1) {
      if(mouseY < window.innerWidth/25 && mouseY > 1) {
        return true;
      }
    } else {
      return false;
    }
  }

  this.display = function() {
   noTint();
   imageMode(CENTER);
   if(this.register()) {
     image(this.img, this.location.x, this.location.y, window.innerWidth/25, window.innerWidth/25);
   } else {
    image(this.img, this.location.x, this.location.y, window.innerWidth/28, window.innerWidth/28);
   }
  }


  this.run = function() {
    this.display();
  }


}
