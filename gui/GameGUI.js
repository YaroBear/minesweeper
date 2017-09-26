const GLOBAL_DISPLAY_WIDTH = window.innerWidth/2;
const GLOBAL_DISPLAY_HEIGHT = GLOBAL_DISPLAY_WIDTH;

const GLOBAL_CELL_WIDTH = GLOBAL_DISPLAY_WIDTH / 10;
const GLOBAL_CELL_HEIGHT = GLOBAL_CELL_WIDTH;

const BOMB_IMAGE = "images/bomb.svg";
const SEAL_IMAGE = "images/seal.svg";

const OCEAN_BLUE = "#2d7eff";
const WHITE = "#FFFFFF";


var canvas = document.getElementById('MineSweeperGame');
var ctx = canvas.getContext('2d');
canvas.width = GLOBAL_DISPLAY_WIDTH;
canvas.height = GLOBAL_DISPLAY_HEIGHT;

var game = new Game();
game.grid.distributeMines();
var reset;

var getGameStatus = function(){

	game.checkGameState();

	if(game.gameState == LOSE){
		game = null;
		setTimeout(function(){
			reset = confirm("Ooops, you clicked a bomb! Try again?");
			if(reset)
				location.reload();
		}, 100);
	}
		
	if(game.gameState == WIN) {
		game = null;
		setTimeout(function(){
			reset = confirm("You win!!!");
			if(reset)
				location.reload();
		}, 100);
	}
};

var getMouseClickPosition = function(event){
	var x = Math.floor(event.clientX/GLOBAL_CELL_WIDTH);
	var y = Math.floor(event.clientY/GLOBAL_CELL_WIDTH);
	console.log(x,y);

	if(event.shiftKey)
		game.grid.toggleCell(x, y);
	else {
		game.grid.exposeCell(x, y);
	}

	drawGrid();
	getGameStatus();
};

canvas.addEventListener("click", getMouseClickPosition, false);

drawCell = function(src, x, y){

	if (src == EXPOSED){
		ctx.fillStyle = WHITE;
		ctx.fillRect(x, y, GLOBAL_CELL_WIDTH, GLOBAL_CELL_WIDTH);
	}
	else if (src == UNEXPOSED) {
		ctx.fillStyle = OCEAN_BLUE;
		ctx.fillRect(x, y, GLOBAL_CELL_WIDTH, GLOBAL_CELL_WIDTH);
	}
	else if (Number.isInteger(src)){
		ctx.font =  GLOBAL_CELL_WIDTH + "px Arial";
		ctx.strokeText(src, x, y + GLOBAL_CELL_WIDTH);
	}
	else{
		image = new Image()
		image.onload = function(){
			ctx.drawImage(this, x, y, GLOBAL_CELL_WIDTH, GLOBAL_CELL_WIDTH);
		};
		image.src = src;
	}
};

drawGrid = function(){
	ctx.clearRect(0,0, GLOBAL_DISPLAY_WIDTH, GLOBAL_DISPLAY_HEIGHT);

	for(var i = 0; i < MAX_SIZE; i++) {
		for(var j = 0; j < MAX_SIZE; j++) {
			var xPos = GLOBAL_CELL_WIDTH*i;
			var yPos = GLOBAL_CELL_WIDTH*j;

			ctx.strokeRect(xPos, yPos, GLOBAL_DISPLAY_WIDTH, GLOBAL_DISPLAY_HEIGHT);


			if(game.grid.cellStatus[i][j] == EXPOSED){
				if(game.grid.mines[i][j] == true)
					drawCell(BOMB_IMAGE, xPos, yPos);
				if(game.grid.getAdjacentMinesCount(i,j) > 0)
					drawCell(game.grid.getAdjacentMinesCount(i,j), xPos, yPos);
			}

			if(game.grid.cellStatus[i][j] == SEALED)
				drawCell(SEAL_IMAGE, xPos, yPos);

			if(game.grid.cellStatus[i][j] == UNEXPOSED)
				drawCell(UNEXPOSED, xPos, yPos);

		}
	}
};

window.onload = drawGrid();