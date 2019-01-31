// var c = document.getElementById("myCanvas");
// var ctx = c.getContext("2d");
// var len = c.width/20;


function Cell(x,y){
    this.x=x;
    this.y=y;
    this.isVisited = false;
    this.walls = {
        top:true,
        left:true,
        right:true,
        bottom:true
    }
    this.div = document.createElement("div");
    this.div.classList.add("cell","top","left","right","bottom");
    this.div.style.top = x + 'px';
    this.div.addEventListener("click",(el)=>{
        el.srcElement.classList.toggle("clicked");
    });
    document.getElementById("body").appendChild(this.div);

    this.removeWall = function(wall){
       if(wall === 'top') {
           this.walls.top = false;
           this.div.classList.remove("top");
        }
       if(wall === 'left'){
            this.walls.left = false;
            this.div.classList.remove("left");
       }
       if(wall === 'right'){
            this.walls.right = false;
            this.div.classList.remove("right");
       }
       if(wall === 'bottom') {
           this.walls.bottom = false;
           this.div.classList.remove("bottom");
        }
    }
    this.addWall = function(wall){
        if(wall === 'top') {
            this.walls.top = true;
            this.div.classList.add("top");
         }
        if(wall === 'left'){
             this.walls.left = true;
             this.div.classList.add("left");
        }
        if(wall === 'right'){
             this.walls.right = true;
             this.div.classList.add("right");
        }
        if(wall === 'bottom') {
            this.walls.bottom = true;
            this.div.classList.add("bottom");
         }
    }
}

function generateGrid(){
    var grid = [];
    for(i=0;i<c.width;i+=len){
        for(j=0;j<c.height;j+=len){
            var newCell = new Cell(i,j);
            grid.push(newCell);
        }
    }
    return grid;
}

var cells = [];
for(i=0;i<20;i++){
    cells[i] = [];
}

for(j=0;j<20;j++){
    for(i=0;i<20;i++){
        cells[j].push(new Cell(j,i));
    }
}

// var anim = setInterval(frame,10);
// var indX = 0;
// var indY = 0;
// function frame(){
//     if(indX >= 20 || indY >= 20)
//         clearInterval(anim);
//     else{
//         cells[indY][indX].div.classList.toggle("clicked");
//         if(indX > 0)
//             cells[indY][indX-1].div.classList.toggle("clicked");
//         else if(indY > 0)
//             cells[indY-1][19].div.classList.toggle("clicked");
//     }
//     indX++;
//     if(indX === 20){
//         indX = 0;
//         indY++;
//     }
// };

function removeBorders(currY,currX,chosenY,chosenX){
    if(currX == chosenX && currY == chosenY - 1){
        cells[currY][currX].removeWall('bottom');
        cells[chosenY][chosenX].removeWall('top');
    }
    if(currX == chosenX -1 && currY == chosenY){
        cells[currY][currX].removeWall('right');
        cells[chosenY][chosenX].removeWall('left');
    }
}