function Flower(iLocation, iScaling, iScore, iName) {
  this.location = iLocation;
  this.scaling = iScaling;
  this.score = iScore;
  this.level = 1;
  this.name = iName;

  this.print = function() {
	  print(this.location);
  };

  this.register = function() {
    if(mouseX < this.location.x + this.scaling / 2 && mouseX > this.location.x - this.scaling / 2) {
      if(mouseY < this.location.y + this.scaling / 2 && mouseY > this.location.y - this.scaling / 2) {
        return true;
      }
    } else return false;
  }

  this.update = function(iLocation, iScaling, iScore, iLevel) {
  	this.location = iLocation;
  	this.scaling = iScaling;
  	this.score = iScore;
    this.level = iLevel;
  }

  this.displayOnly = function(iImg, iTemp) {
    this.display(iImg);
    text("Level "+flowers[i].level, flowers[i].location.x, flowers[i].location.y + 30 + flowers[i].scaling/2)
    strokeWeight(4);
    stroke(51)
    rectMode(CORNERS);
    rect(width/4, height/4, scaling/20+width/4, height*3/4);  
  }

  this.display = function(iImg) {
    tint(50, map(this.score, 0, 100, 50, 255), 50, 255);
    imageMode(CENTER);

    if(this.register()) {
	    image(iImg, this.location.x, this.location.y, this.scaling + 5, this.scaling + 5);
    } else image(iImg, this.location.x, this.location.y, this.scaling, this.scaling);

    textAlign(CENTER,[TOP]);
    text(this.name, this.location.x, this.location.y + 5 + this.scaling / 2);
    }
}
