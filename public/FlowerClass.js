function Flower(iLocation, iScaling, iScore,iName) {


  /*
  this.location = createVector(width/2, height/2);
  this.scaleing = 1;
  this.score = 5;
  */

  this.location = iLocation;
  this.scaling = iScaling;
  this.score = iScore;
  this.name = iName;



  this.print = function(){
	  print(this.location);
  };

  this.register = function() {
    if(mouseX < this.location.x + this.scaling / 2 && mouseX > this.location.x - this.scaling / 2) {
      if(mouseY < this.location.y + this.scaling / 2 && mouseY > this.location.y - this.scaling / 2) {
        return true;
      }
    } else {
      return false;
    }
  }

  this.update = function(iLocation, iScaling, iScore) {
  	this.location = iLocation;
  	this.scaling = iScaling;
  	this.score = iScore;

  }


  this.display = function(iImg) {
    tint(0,map(this.score, 0, 100, 0, 255), 0, 255);
    imageMode(CENTER);
    if(this.register()){
	    image(iImg, this.location.x, this.location.y, this.scaling + 5, this.scaling + 5);
    } else {
    	image(iImg, this.location.x, this.location.y, this.scaling, this.scaling);
    }
    textAlign(CENTER,[TOP]);
    text(this.name, this.location.x, this.location.y + 5 + this.scaling / 2);
  }

}
