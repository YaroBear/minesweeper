const MAX_SIZE = 10;
const NUMBER_MINES = 10;
                         
const UNEXPOSED = "UNEXPOSED";
const EXPOSED = "EXPOSED";
const SEALED = "SEALED";

const adjCells = [[-1, -1],[-1, 0], [-1, 1],[0, -1], [0, 1],[1, -1],[1, 0], [1, 1]];

var MineSweeper = function(){
	this.height = MAX_SIZE;
	this.width = MAX_SIZE;

	this.cellStatus = new Array(MAX_SIZE);
	this.mines = new Array(MAX_SIZE);

	for(var i = 0; i < MAX_SIZE; i++) { 
		this.cellStatus[i] = new Array(MAX_SIZE);
		this.mines[i] = new Array(MAX_SIZE);

		for(var j = 0; j < MAX_SIZE; j++) {
			this.cellStatus[i][j] = UNEXPOSED;
			this.mines[i][j] = false;
		}
	} 
};

MineSweeper.prototype.checkBounds = function(row, column){
	if (row < 0 || row >= this.height || column < 0 || column  >= this.width)
		throw new Error('Out of row/column range');
};

MineSweeper.prototype.exposeCell = function(row, column){
	this.checkBounds(row,column);

	if(this.mines[row][column] == true && this.cellStatus[row][column] != SEALED){
		this.cellStatus[row][column] = EXPOSED;
		return;
	}

	if(this.isAdjacentCell(row, column) && this.cellStatus[row][column] != SEALED) {
		this.cellStatus[row][column] = EXPOSED;
		return;
	}

	if (this.cellStatus[row][column] == UNEXPOSED){
		this.cellStatus[row][column] = EXPOSED;
		this.exposeNeighborsOf(row, column);
	}
};

MineSweeper.prototype.cellState = function(row, column){
	return this.cellStatus[row][column];
};

MineSweeper.prototype.exposeNeighborsOf = function(row, column){
	for (var i=0;i<adjCells.length;i++){
		var x = adjCells[i][0] + row;
		var y = adjCells[i][1] + column;
		if (x >= 0 && y >= 0 && x < this.height && y < this.width){
			this.exposeCell(x,y);
		}
	}
};

MineSweeper.prototype.toggleCell = function(row, column){
	this.checkBounds(row,column);

	if(this.cellStatus[row][column] == UNEXPOSED)
		this.cellStatus[row][column] = SEALED;
	else if(this.cellStatus[row][column] == SEALED)
		this.cellStatus[row][column] = UNEXPOSED;
};

MineSweeper.prototype.isAdjacentCell = function(row, column){
	this.checkBounds(row,column);

	return this.getAdjacentMinesCount(row,column) > 0;
}

MineSweeper.prototype.getAdjacentMinesCount = function(row, column){
	this.checkBounds(row,column);

	count = 0;

	for (var i=0;i<adjCells.length;i++){
		var x = adjCells[i][0] + row;
		var y = adjCells[i][1] + column;
		if (x >= 0 && y >= 0 && x < this.height && y < this.width){
			if(this.mines[x][y] == true && this.mines[row][column] == false) {
			count += 1;
			}
		}
	}
	return count;
};

MineSweeper.prototype.setMine = function(row, column){
	this.checkBounds(row,column);

	this.mines[row][column] = true;
};

MineSweeper.prototype.distributeMines = function(numberMines) {
	for(var i = 0; i < NUMBER_MINES; i++) {
		var x = Math.floor(Math.random()*MAX_SIZE);
		var y = Math.floor(Math.random()*MAX_SIZE);
		if (this.mines[x][y] == true){
			i -= 1;
		}
		this.setMine(x,y);
	}
};
// dont call in constructor, otherwise some of the expose cell tests may fail as we set static expectations //Venkat: I disobeyed (grin) and called it in the constructor and many tests failed. Nice, tests are the guardian angels. So we can remove the comment line.

const IN_PROGRESS = "IN_PROGRESS";
const WIN = "WIN";
const LOSE = "LOSE";

var Game = function(){

	this.grid = new MineSweeper();
	this.gameState = IN_PROGRESS;

}

Game.prototype.checkGameState = function(){

	var foundMines = 0;
	var exposedCells = 0;
	for(var i = 0; i<MAX_SIZE; i++){
		for(var j = 0; j<MAX_SIZE; j++){
			if(this.grid.cellStatus[i][j] == EXPOSED && this.grid.mines[i][j])
				return this.gameState = LOSE;
			if(this.grid.cellStatus[i][j] == SEALED && this.grid.mines[i][j])
				foundMines++;
			if(this.grid.cellStatus[i][j] == EXPOSED)
				exposedCells++;
		}
	}
	if(foundMines == NUMBER_MINES && exposedCells == MAX_SIZE*MAX_SIZE-NUMBER_MINES) 
		return this.gameState = WIN;

};
