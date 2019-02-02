// var c = document.getElementById("myCanvas");
// var ctx = c.getContext("2d");
// var len = c.width/20;
Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

Array.prototype.randomMinMark = function () {
    var zeros = [];
    var nonzeros = [];
    this.forEach(element => {
        if(element.markCount === 0){
            zeros.push(element);
        }else{
            nonzeros.push(element);
        }
    });
    if(zeros.length > 0){
        return zeros[Math.floor((Math.random()*zeros.length))];
    }else{
        return nonzeros[Math.floor((Math.random()*nonzeros.length))];
    }
}

var isStartSet = false;
var isEndSet = false;
var startCell = null;
var endCell = null;
function Cell(y,x){
    this.x=x;
    this.y=y;
    this.isStart = false;
    this.isEnd = false;
    this.isVisited = false;
    this.markCount = 0;
    this.deadEnd = false;
    this.walls = {
        top:true,
        left:true,
        right:true,
        bottom:true
    }
    this.div = document.createElement("div");
    this.div.classList.add("cell","top","left","right","bottom");
    this.div.style.top = y*30 + 'px';
    this.div.style.left = x*30 + 'px';
    this.div.addEventListener("click",(el)=>{
        if(!(isStartSet && isEndSet && !(this.isStart || this.isEnd))){
            if(!isStartSet){
                isStartSet = true;
                this.isStart = true;
                el.srcElement.classList.toggle("startCell");
                startCell = this;
            }else{
                if(this.isStart){
                    isStartSet = false;
                    this.isStart = false;
                    el.srcElement.classList.toggle("startCell");
                    startCell = null; 
                }else if(!isEndSet){
                    isEndSet = true;
                    this.isEnd = true;
                    el.srcElement.classList.toggle("endCell");
                    endCell = this;
                }else{
                    isEndSet = false;
                    this.isEnd = false;
                    el.srcElement.classList.toggle("endCell");
                    endCell = null;
                }
            }
        }
        // el.srcElement.classList.toggle("clicked");
    });
    document.getElementById("maze").appendChild(this.div);

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

var cells = [];
for(i=0;i<20;i++){
    cells[i] = [];
}

for(j=0;j<20;j++){
    for(i=0;i<20;i++){
        cells[j].push(new Cell(j,i));
    }
}


function removeBorders(current,chosen){
    if(current.x == chosen.x && current.y == chosen.y - 1){
        current.removeWall('bottom');
        chosen.removeWall('top');
    }
    if(current.x == chosen.x -1 && current.y == chosen.y){
        current.removeWall('right');
        chosen.removeWall('left');
    }
    if(current.x == chosen.x && current.y == chosen.y + 1){
        current.removeWall('top');
        chosen.removeWall('bottom');
    }
    if(current.x == chosen.x + 1 && current.y == chosen.y){
        current.removeWall('left');
        chosen.removeWall('right');
    }
}


function isEdgeCell(cell){
    return (cell.x === 0 || cell.x === 19 || cell.y === 0 || cell.y === 19);
}

function checkUnvisitedNeighbours(neigbours){
    var unvisited = [];
    neigbours.forEach(element => {
        if(!element.isVisited){
            unvisited.push(element);
        }
    });
    return unvisited;
}

function getEdgeNeighbours(cell){
    if(!cell) return null;
    var neigbours = [];
    if(cell.x === 0 && cell.y ===0){
        return checkUnvisitedNeighbours([cells[cell.y+1][cell.x],cells[cell.y][cell.x+1]]);
    }else if(cell.x === 0 && cell.y === 19){
        return checkUnvisitedNeighbours([cells[cell.y-1][cell.x],cells[cell.y][cell.x+1]]);
    }else if(cell.x === 19 && cell.y === 0){
        return checkUnvisitedNeighbours([cells[cell.y+1][cell.x],cells[cell.y][cell.x-1]]);
    }else if(cell.x === 19 && cell.y === 19){
        return checkUnvisitedNeighbours([cells[cell.y-1][cell.x],cells[cell.y][cell.x-1]]);
    }else if(cell.x === 0){
        return checkUnvisitedNeighbours([cells[cell.y-1][cell.x],cells[cell.y][cell.x+1],cells[cell.y+1][cell.x]]);
    }
    else if(cell.y === 0){
        return checkUnvisitedNeighbours([cells[cell.y][cell.x-1],cells[cell.y][cell.x+1],cells[cell.y+1][cell.x]]);
    }
    else if(cell.x === 19){
        return checkUnvisitedNeighbours([cells[cell.y-1][cell.x],cells[cell.y][cell.x-1],cells[cell.y+1][cell.x]]);
    }else if(cell.y === 19){
        return checkUnvisitedNeighbours([cells[cell.y][cell.x-1],cells[cell.y][cell.x+1],cells[cell.y-1][cell.x]]);
    }
    return neigbours;
}

function getUnvisitedNeighbours(cell){
    var neigbours = [];
    if(!isEdgeCell(cell)){
        var top = cells[cell.y-1][cell.x];
        if(top){
            if(!top.isVisited){
                neigbours.push(top);
            }
        }
        var left = cells[cell.y][cell.x-1];
        if(left){
            if(!left.isVisited){
                neigbours.push(left);
            }
        }
        var right = cells[cell.y][cell.x+1];
        if(right){
            if(!right.isVisited){
                neigbours.push(right);
            }
        }
        var bottom = cells[cell.y+1][cell.x];
        if(bottom){
            if(!bottom.isVisited){
                neigbours.push(bottom);
            }
        }
    }else{
        var unvisited = getEdgeNeighbours(cell);
        unvisited.forEach(element => {
            neigbours.push(element);
        });
    }
    return neigbours;
}
function hasUnvisitedNeighbours(cell){
    var unvisited = getUnvisitedNeighbours(cell);
    return (unvisited.length > 0)?true:false;
}

function areThereUnvisited(){
    for(i=0;i<20;i++){
        for(j=0;j<20;j++){
            if(!cells[i][j].isVisited) return true;
        }
    }
    return false;
}
function visitedCount(){
    var count = 0;
    for(i=0;i<20;i++){
        for(j=0;j<20;j++){
            if(cells[i][j].isVisited) count++;
        }
    }
    return count;
}

function generateMaze(){
    var initial = cells[0][0];
    var current = initial;
    current.div.classList.add('current');
    var stack = [];
    current.isVisited = true;
    
    var interval = setInterval(() => {
        if(areThereUnvisited()){
            if(hasUnvisitedNeighbours(current)){
                var chosen = getUnvisitedNeighbours(current).random();
                stack.push(current);
                removeBorders(current,chosen);
                current.div.classList.remove('current');
                current = chosen;
                current.div.classList.add('current');
                current.isVisited = true;
            }else{
                if(stack.length > 0){
                    current.div.classList.remove('current');
                    current = stack.pop();
                    current.div.classList.add('current');
                }
            }
        }else{
            current.div.classList.remove('current');
            clearInterval(interval);
            console.log('done');
        }
    }, 10);
}


var genButton = document.getElementById('Generate');
genButton.addEventListener('click',()=>{
    genButton.style.display = 'none';
    generateMaze();
});
var solButton = document.getElementById('Solve');
solButton.addEventListener('click',()=>{
    if(!isStartSet || !isEndSet){
        console.log('Error: Both start and end cells need to be set!')
    }else{
        solButton.style.display = 'none';
        solveMaze();
    }
});

function isDeadEnd(cell){
    return (cell.markCount >= 2 || cell.deadEnd)?true:false;
}

function getPossiblePaths(cell,previous){
    var paths = [];
    if(!cell.walls.top){
        var top = cells[cell.y-1][cell.x];
        if((top != previous) && !isDeadEnd(top)){
            paths.push(top);
        }
    }
    
    if(!cell.walls.left){
        var left = cells[cell.y][cell.x-1];
        if((left != previous) && !isDeadEnd(left)){
            paths.push(left);
        }
    }
    
    if(!cell.walls.right){
        var right = cells[cell.y][cell.x+1]
        if((right != previous) && !isDeadEnd(right)){
            paths.push(right);
        }
    }
    if(!cell.walls.bottom){
        var bottom = cells[cell.y+1][cell.x];
        if((bottom != previous) && !isDeadEnd(bottom)){
            paths.push(bottom);
        }
    }
    return paths;
}

function solveMaze(){
    var initial = startCell;
    var target = endCell;
    var current = initial;
    var previous = null;
    var stack = [];
    var trail = [];
    var interval = setInterval(() => {
        if(current != target){
            if(current.markCount === 0){
                current.markCount++;
                if(current.markCount === 1 && !trail.includes(current)){
                    trail.push(current);
                    if(current != initial){
                        current.div.classList.add('trail');
                    }
                }
            }
            var chosen = getPossiblePaths(current,previous).randomMinMark();
            if(chosen){
                stack.push(current);
                stack.push(previous);
                previous = current;
                current = chosen;
            }
            else{
                current.deadEnd = true;
                current.div.classList.remove('trail');
                // current.div.classList.add('dead');
                trail.pop();
                if(stack.length >0){
                    previous = stack.pop();
                    current = stack.pop();
                }
            }
        }else{
            clearInterval(interval);
            console.log('Solved!');
            var audio = new Audio('tada.mp3');
            audio.play();
            document.getElementById('applause').classList.remove('none');
        }
    }, 10);
}