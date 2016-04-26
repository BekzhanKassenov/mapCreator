//================================================================================
// MapCreator declaration
//================================================================================
function MapCreator(canvas, nodesTable, edgesTable) {
	this.graph = new Graph();

	this.canvas = canvas;
	this.context = canvas.getContext('2d');

	this.nodesTable = nodesTable;
	this.edgesTable = edgesTable;

	this.background = null;

	this.setCanvasBackground = function(imageName) {
		this.background = new Image();
		this.background.src = imageName;

		var canvas = this.canvas;
		var context = this.context;
		
		this.background.onload = function() {
			canvas.width = this.width;
			canvas.height = this.height;
			context.drawImage(this, 0, 0);
		}
	}

	this.updateCanvas = function() {
		this.context.drawImage(this.background, 0, 0);
		this.graph.draw(this.context);
	}

	this.updateTables = function() {
		//$(this.nodesTable).children("tbody").empty();
		//$(this.edgesTable).children("tbody").empty();
		
		$(this.nodesTable).empty();
		$(this.edgesTable).empty();
	
		this.graph.fillTable(this.nodesTable, this.edgesTable);
	}

	this.updateViews = function() {
		this.updateCanvas();
		this.updateTables();
	}

	this.addNode = function(label, x, y) {
		if (!this.graph.addNode(label, x, y)) {
			return false;
		}

		this.updateViews();
		return true;
	}

	this.addEdge = function(labelOne, labelTwo) {
		if (!this.graph.addEdge(labelOne, labelTwo)) {
			return false;
		}

		this.updateViews();
		return true;
	}

	this.removeNode = function(label) {
		if (!this.graph.removeNode(label)) {
			return false;
		}

		this.updateViews();
		return true;
	}

	this.removeEdge = function(labelOne, labelTwo) {
		if (!this.graph.removeEdge(labelOne, labelTwo)) {
			return false;
		}

		this.updateViews();
		return true;
	}

	this.generateJSON = function() {
		return JSON.stringify(this.graph);
	}
}
