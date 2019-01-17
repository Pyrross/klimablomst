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
    text("Level "+ this.level, this.location.x, this.location.y + 0.06*height + this.scaling/2)
    smooth();
    strokeWeight(3);
    rectMode(CORNERS);
    rect(this.location.x - this.scaling/2, 0.12*height+ this.location.y +this.scaling/2 ,this.location.x + this.scaling/2, 0.14*height+ this.location.y+this.scaling/2 );
    stroke(0, 230, 0);
    strokeWeight(scaling/40);
    line(4+this.location.x - this.scaling/2, 0.13*height + this.location.y + this.scaling/2, map(this.score, 0, 50 + this.level*50, 4+this.location.x- this.scaling/2, this.location.x - 4 + this.scaling/2), 0.13*height+ this.location.y + this.scaling/2);

    
  }

  this.display = function(iImg) {
    tint(50, map(this.score, 0, 100, 50, 255), 50, 255);
    imageMode(CENTER);

    if(this.register()) {
	    image(iImg, this.location.x, this.location.y, this.scaling + 5, this.scaling + 5);
    } else image(iImg, this.location.x, this.location.y, this.scaling, this.scaling);

    textAlign(CENTER,[TOP]);
    text(this.name, this.location.x, this.location.y + 10 + this.scaling / 2);
    }
}
