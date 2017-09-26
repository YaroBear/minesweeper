describe('MineSweeper state tests', function() {
	it('canary test', function() {
		expect(true).to.be.true;
	});

	var minesweeper;

	beforeEach(function(){
		minesweeper = new MineSweeper();
	});

	it('expose a cell', function(){
		minesweeper.exposeCell(1, 2);

		expect(minesweeper.cellState(1, 2)).to.eql('EXPOSED');
	});

	it('expose another cell', function(){
		minesweeper.exposeCell(1, 2);

		minesweeper.exposeCell(2, 3);
	
		expect(minesweeper.cellState(2, 3)).to.eql('EXPOSED');
	});


	it('expose an exposed cell', function(){
		minesweeper.exposeCell(1, 2);
		
		minesweeper.exposeCell(1, 2);
		
		expect(minesweeper.cellState(1, 2)).to.eql('EXPOSED'); 
	});

	it('should throw an exception when trying to expose a cell greater than row range', function(){

		var toCall = function() { minesweeper.exposeCell(11, 2); }

		expect(toCall).to.throw("Out of row/column range");
	});

	it('should throw an exception when trying to expose a cell greater than column range', function(){

		var toCall = function() { minesweeper.exposeCell(1, 11); }

		expect(toCall).to.throw("Out of row/column range");
	});

	it('should throw an exception when trying to expose a cell less than row range', function(){

		var toCall = function() { minesweeper.exposeCell(-1, 0); }

		expect(toCall).to.throw("Out of row/column range");
	});

	it('should throw an exception when trying to expose a cell less than column range', function(){

		var toCall = function() { minesweeper.exposeCell(0, -1); }

		expect(toCall).to.throw("Out of row/column range");
	});

	it('exposeCell should expose its neighbors.', function(){

		var exposeNeighborsOfCalledWith = '';
		minesweeper.exposeNeighborsOf = function(row, column) {
			exposeNeighborsOfCalledWith = row + ', ' + column;
		}

		minesweeper.exposeCell(1, 2);
		
		expect(exposeNeighborsOfCalledWith).to.be.equal('1, 2');
	});

	it('exposeCell should not expose neighbor cells if called on an already exposed cell', function(){

		var exposeNeighborsOfCalledWith = '';
		minesweeper.exposeNeighborsOf = function(row, column) {
			exposeNeighborsOfCalledWith = row + ', ' + column;
		}

		minesweeper.exposeCell(1, 2);
		exposeNeighborsOfCalledWith = '...not called...';

		minesweeper.exposeCell(1, 2);

		expect(exposeNeighborsOfCalledWith).to.be.equal('...not called...');
	});
                                            
	it('exposeNeighborsOf should expose all its neighbors', function() {
		var exposeCellCalledWith = [];
		minesweeper.exposeCell = function(row, column) {
			exposeCellCalledWith.push(row);
			exposeCellCalledWith.push(column);
		}

		minesweeper.exposeNeighborsOf(1, 2);

		expect(exposeCellCalledWith).to.be.eql([0, 1, 0, 2, 0, 3, 1, 1, 1, 3, 2, 1, 2, 2, 2, 3]);
	});

	it('should expose neighbors around top left corner cell, skipping over neighbor cells that are out of bounds', function(){
		var exposeCellCalledWith = [];
		minesweeper.exposeCell = function(row, column) {
			exposeCellCalledWith.push(row);
			exposeCellCalledWith.push(column);
		}

		minesweeper.exposeNeighborsOf(0, 0);
		                                
		expect(exposeCellCalledWith).to.be.eql([0, 1, 1, 0, 1, 1]);
	});

	it('should expose neighbors around a cell on the top edge, skipping over neighbor cells that are out of bounds', function(){
		var exposeCellCalledWith = [];
		minesweeper.exposeCell = function(row, column) {
			exposeCellCalledWith.push(row);
			exposeCellCalledWith.push(column);
		}

		minesweeper.exposeNeighborsOf(0, 1);
		                                
		expect(exposeCellCalledWith).to.be.eql([0, 0, 0, 2, 1, 0, 1, 1, 1, 2]);
	});

	it('should expose neighbors around a cell on the right edge, skipping over neighbor cells that are out of bounds', function(){
		var exposeCellCalledWith = [];
		var width = minesweeper.width-1;
		minesweeper.exposeCell = function(row, column) {
			exposeCellCalledWith.push(row);
			exposeCellCalledWith.push(column);
		}

		minesweeper.exposeNeighborsOf(1, width);
		                                
		expect(exposeCellCalledWith).to.be.eql([0, width-1, 0, width, 1, width-1, 2, width-1, 2, width]);
	});

	it('should expose neighbors around a cell on the bottom edge, skipping over neighbor cells that are out of bounds', function(){
		var exposeCellCalledWith = [];
		var height = minesweeper.height-1;
		minesweeper.exposeCell = function(row, column) {
			exposeCellCalledWith.push(row);
			exposeCellCalledWith.push(column);
		}

		minesweeper.exposeNeighborsOf(height, 1);
		                                
		expect(exposeCellCalledWith).to.be.eql([height-1, 0, height-1, 1, height-1, 2, height, 0, height, 2]);
	});

	it('should expose neighbors around a cell on the left edge, skipping over neighbor cells that are out of bounds', function(){
		var exposeCellCalledWith = [];
		minesweeper.exposeCell = function(row, column) {
			exposeCellCalledWith.push(row);
			exposeCellCalledWith.push(column);
		}

		minesweeper.exposeNeighborsOf(1, 0);
		                                
		expect(exposeCellCalledWith).to.be.eql([0, 0, 0, 1, 1, 1, 2, 0, 2, 1]);
	});

	it('should seal a cell', function(){
		minesweeper.toggleCell(0,0); 
                             
    expect(minesweeper.cellState(0, 0)).to.eql('SEALED');         
	});

	it('Sealing or unsealing a cell by calling toggleCell calls checkBounds', function(){
		var called = false;
		minesweeper.checkBounds = function(row, column){
			called = true;
		}

		minesweeper.toggleCell(0, 0);

		expect(called).to.eql(true);
	});

	it('unsealing a sealed cell leaves it unexposed', function(){  
		minesweeper.toggleCell(0,0); 

		minesweeper.toggleCell(0,0);     

		expect(minesweeper.cellState(0, 0)).to.eql('UNEXPOSED');
	});

	it('should not seal an exposed cell', function(){
		minesweeper.exposeCell(0,0); 

		minesweeper.toggleCell(0,0);

		expect(minesweeper.cellState(0, 0)).to.eql('EXPOSED');
	});

	it('should not expose a sealed cell', function(){
		minesweeper.toggleCell(0,0);

		minesweeper.exposeCell(0,0); 

		expect(minesweeper.cellState(0, 0)).to.eql('SEALED');
	});

	it('exposing a sealed cell should not expose any neighbors', function(){
		var called = false;
		minesweeper.exposeNeighborsOf = function(row, column) {
			called = true;
		}

		minesweeper.toggleCell(0,0);

		minesweeper.exposeCell(0,0); 

		expect(called).to.eql(false);
	});

	it('should set a mine at a location', function(){
		minesweeper.setMine(0,0);

		expect(minesweeper.mines[0][0]).to.be.true;
	});

	it('should verify if a cell with a mine is not an adjacent cell', function(){
		minesweeper.setMine(0, 0);

		expect(minesweeper.isAdjacentCell(0,0)).to.be.false;
	});

	
	it('should set a mine at a location and checks if a cell is adjacent to the mine', function(){
		minesweeper.setMine(0, 0);

		expect(minesweeper.isAdjacentCell(0, 1)).to.be.true; 
	});

	it('should set a mine at another location and checks if a cell is adjacent to the mine', function(){
		minesweeper.setMine(5, 0);

		expect(minesweeper.isAdjacentCell(6, 0)).to.be.true; 
	});

	it('should not consider a mined location to be an adjacent cell', function(){
		minesweeper.setMine(5, 0);

		expect(minesweeper.isAdjacentCell(5,0)).to.be.false; 
	});

	it('should set an adjacent cell in the top-left corner', function(){
		minesweeper.setMine(1, 0);

		expect(minesweeper.isAdjacentCell(0,0)).to.be.true; 
	});

	it('should set an adjacent cell in the top-right corner', function(){
		minesweeper.setMine(0, 8);

		expect(minesweeper.isAdjacentCell(0,9)).to.be.true; 
	});

	it('should set an adjacent cell in the bottom-left corner', function(){
		minesweeper.setMine(9, 1);

		expect(minesweeper.isAdjacentCell(9, 0)).to.be.true; 
	});

	it('should set an adjacent cell in the bottom-right corner', function(){
		minesweeper.setMine(9,8);

		expect(minesweeper.isAdjacentCell(9,9)).to.be.true; 
	});

	it('should not consider a location with a mine that is adjacent to another mine to be an adjacent cell', function(){
		minesweeper.setMine(5, 0);
		minesweeper.setMine(5, 1);

		expect(minesweeper.isAdjacentCell(5,0)).to.be.false; 
	});

	it('should not expose any neighbors when exposing a mined cell', function(){  
		minesweeper.setMine(5, 0);
		var called = false;

		minesweeper.exposeNeighborsOf = function(row, column) {
			called = true;
		}

		minesweeper.exposeCell(5, 0);

		expect(called).to.be.false;
	});

	it('should not expose any neighbors when exposing an adjacent cell', function(){
		minesweeper.setMine(5,0);
		var called = false;

		var exposeCellCalledWith = [];
		minesweeper.exposeNeighborsOf = function(row, column) {
			called = true;
		}

		minesweeper.exposeCell(5, 1);
		                                
		expect(called).to.be.false;
	});

	it('should return the correct number of mines when a cornered adjacent cell is exposed', function(){
		minesweeper.setMine(0, 1);
		minesweeper.setMine(1, 1);
		minesweeper.setMine(1, 0);

		minesweeper.exposeCell(0,0);

		expect(minesweeper.getAdjacentMinesCount(0,0)).to.be.eql(3); 
	});

	it('should return the correct number of mines when another adjacent cell is exposed', function(){
		minesweeper.setMine(4, 5);
		minesweeper.setMine(4, 6);
		minesweeper.setMine(5, 5);
		minesweeper.setMine(5, 7);
		minesweeper.setMine(6, 6);

		minesweeper.exposeCell(5,6);

		expect(minesweeper.getAdjacentMinesCount(5,6)).to.be.eql(5); 
	});

	it('should place 10 mines on the grid', function(){
		minesweeper.distributeMines(NUMBER_MINES);

		var count = 0;

		for(var i = 0; i< MAX_SIZE; i++)
			for(var j = 0; j< MAX_SIZE; j++)
				if (minesweeper.mines[i][j]  == true) 
					count +=1;

		expect(count).to.be.eql(10);
	});

	it('should have placed 10 mines randomly', function(){
		minesweeper.distributeMines(NUMBER_MINES);

		var anotherInstance = new MineSweeper();
		anotherInstance.distributeMines(NUMBER_MINES);

		var similarCount = 0;

		for (var i = 0; i < MAX_SIZE; i++) {
			for(var j = 0; j < MAX_SIZE; j++) {
				if (minesweeper.mines[i][j] == true && anotherInstance.mines[i][j] == true) {
					similarCount++;
				}
			}
		}

		var isRandom = (similarCount < NUMBER_MINES);
		
		expect(isRandom).to.be.true;
	});
});


describe('MineSweeper game layer tests', function(){

	var game;

	beforeEach(function(){
		game = new Game();
	});

	it('game status is in progress when no cells are exposed and no cells sealed', function(){
		expect(game.gameState).to.eql(IN_PROGRESS);
	});

	it('game status is in progress when there is at least one unexposed or unsealed cell', function(){

		game.grid.toggleCell(0,0);

		for(var i=0; i<MAX_SIZE; i++){
			for(var j=0; j<MAX_SIZE; j++){
				game.grid.exposeCell(i, j);
			}
		}

		game.grid.toggleCell(0,0);

		expect(game.gameState).to.eql(IN_PROGRESS);
	});

	it('game status lost if a mine has been exposed', function(){
		game.grid.setMine(5, 0);
		game.grid.exposeCell(5, 0);

		game.checkGameState();

		expect(game.gameState).to.eql(LOSE);
	});

	it('game status won when all mines sealed and all other cells exposed', function(){
		for(var i=0;i<MAX_SIZE;i++){
			game.grid.setMine(i, i);
			game.grid.toggleCell(i, i);
		}

		for(var i=0; i<MAX_SIZE; i++){
			for(var j=0; j<MAX_SIZE; j++){
				if (i != j)
					game.grid.exposeCell(i, j);
			}
		}

		game.checkGameState();

		expect(game.gameState).to.eql(WIN);
	});
});

