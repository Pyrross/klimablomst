//Klasse til blomsterne
function Flower(iLocation, iScaling, iName, iData) {
    this.location = iLocation;
    this.scaling = iScaling;
    this.name = iName;
    this.data = iData;
    //Funktion der holder øje med musen. Er den over blomsten?
    this.register = function() {
        if (mouseX < this.location.x + this.scaling / 2 && mouseX > this.location.x - this.scaling / 2) {
            if (mouseY < this.location.y + this.scaling / 2 && mouseY > this.location.y - this.scaling / 2) {
                return true;
            }
        } else return false;
    }

    //Funktion der opdaterer lokation, skalering, score og level
    this.update = function(iLocation, iScaling, iData) {
        this.location = iLocation;
        this.scaling = iScaling;
        this.data = iData;
    }

  this.displayOnly = function(iImg) {
    this.display(iImg);
    text("Level "+ this.data[3], this.location.x, this.location.y + 0.06 * height + this.scaling / 2)
    this.displayData();
  }

  this.displayData = function(){
    smooth();
    strokeWeight(3);
    stroke(0);
    rectMode(CORNERS);
    rect(this.location.x - this.scaling / 2, 0.12 * height + this.location.y + this.scaling / 2 , this.location.x + this.scaling / 4, 0.14 * height + this.location.y + this.scaling / 2);
    stroke(0, 230, 0);
    strokeWeight(scaling/40);
    line(4+this.location.x - this.scaling/2, 0.13*height + this.location.y + this.scaling/2, map(this.data[2], 0, 50 + this.data[3]*50, 4+this.location.x- this.scaling/2, this.location.x - 4 + this.scaling/4), 0.13*height+ this.location.y + this.scaling/2);
    noStroke();

    //tilføj symboler efter ændring
    if(!IsFresh(this.data[4]) || this.data[5] == 0){
      textSize(0.10*height);
      textAlign(CENTER,CENTER);
      text("—", this.location.x + this.scaling*3/8, 0.13*height + this.location.y + this.scaling/2 );
    } else if (this.data[5]>0){
      imageMode(CENTER);
      tint(50, 240, 50);
      push();
      translate(this.location.x + this.scaling * 3.5 / 8, 0.13 * height + this.location.y + this.scaling*0.96/2);
      rotate(PI);
      image(arrowImg, 0, 0,  this.scaling*1/8, -this.scaling*1/8);
      pop();
      textSize(0.08*height);
      textAlign(CENTER,CENTER);
      text(this.data[5], this.location.x + this.scaling * 2.7 / 8, 0.13 * height + this.location.y + this.scaling / 2);
} else if (this.data[5]<0){
      imageMode(CENTER);
      tint(240, 50, 50);
      image(arrowImg, this.location.x + this.scaling * 3.5 / 8, 0.13 * height + this.location.y + this.scaling / 2,  this.scaling * 1 / 8, this.scaling * 1 / 8);
      textSize(0.08*height);
      textAlign(CENTER,CENTER);
      text(abs(this.data[5]), this.location.x + this.scaling*2.7 / 8, 0.13 * height + this.location.y + this.scaling / 2);
    }

  }

  this.display = function(iImg) {
    tint(map(this.data[2], 0, 50 + this.data[3] * 50, 50, 50 + (this.data[3]-1)%5 * 50) , 50, map(this.data[2], 0, 50 + this.data[3] * 50, 50, 250 - (this.data[3] - 1)%5 * 50));
    imageMode(CENTER);

        //Er musen over blomsterne? Hvis ja, highlight blomsten.
        if (this.register()) {
            image(iImg, this.location.x, this.location.y, this.scaling + 5, this.scaling + 5);
        } else image(iImg, this.location.x, this.location.y, this.scaling, this.scaling);

    textAlign(CENTER,[TOP]);
    text(this.name, this.location.x, this.location.y + 10 + this.scaling / 2);
    }
}
