//================================================================================
// Node declaration
//================================================================================
function Node(label, x, y) {
	this.label = label;
	this.x = x;
	this.y = y;

	this.drawX = function(context) {
		var delta = 5;

		context.lineWidth = 3;
		context.strokeStyle = "#000000";
		context.lineCap = 'round';

		context.beginPath();

		context.moveTo(this.x - delta, this.y - delta);
		context.lineTo(this.x + delta, this.y + delta);
		
		context.moveTo(this.x + delta, this.y - delta);
		context.lineTo(this.x - delta, this.y + delta);
		
		context.stroke();
		context.closePath();
	}

	this.drawName = function(context) {

	}

	this.draw = function(context) {
		this.drawX(context);
		this.drawName(context);
	}
}

//================================================================================
// Edge declaration
//================================================================================

function Edge(labelOne, labelTwo) {
	this.labelOne = labelOne;
	this.labelTwo = labelTwo;

	this.equals = function(otherEdge) {
		if (otherEdge.labelOne && otherEdge.labelTwo) {
			return (otherEdge.labelOne === this.labelOne && otherEdge.labelTwo === this.labelTwo) || (otherEdge.labelTwo === this.labelOne && otherEdge.labelOne === this.labelTwo);
		}

		return false;
	}

	this.draw = function(context) {

	}
}

//================================================================================
// Graph declaration
//================================================================================
function Graph() {
	this.nodes = new Array();
	this.edges = new Array();

	this.addNode = function(label, x, y) {
		for (var i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].label === label) {
				return false;
			}
		}

		this.nodes.push(new Node(label, x, y));
		return true;
	}

	this.addEdge = function(labelOne, labelTwo) {
		if (labelOne === labelTwo) {
			return false;
		}

		var edge = new Edge(labelOne, labelTwo);
		for (var i = 0; i < this.edges.length; i++) {
			if (this.edges[i].equals(edge)) {
				return false;
			}
		}

		this.edges.push(edge);
		return true;
	}

	this.removeNode = function(label) {
		var i = 0;
		var result = false;
		while (i < this.nodes.length) {
			if (nodes[i].label === label) {
				nodes.splice(i, 1);
				result = true;
			} else {
				i++;
			}
		}

		i = 0;
		while (i < this.edges.length) {
			if (edges[i].labelOne === label || edges[i].labelTwo === label) {
				edges.splice(i, 1);
				result = true;
			} else {
				i++;
			}
		}

		return result;
	}

	this.removeEdge = function(labelOne, labelTwo) {
		var deleteEdge = new Edge(labelOne, labelTwo);
		var i = 0;

		while (i < this.edges.length) {
			if (edges[i].equals(deleteEdge)) {
				edges.splice(i, 1);
				result = true;
			} else {
				i++;
			}
		}

		return result;
	}
}

//================================================================================
// MapCreator declaration
//================================================================================
function MapCreator(canvas) {
	this.graph = new Graph();

	this.canvas = canvas;
	this.context = canvas.getContext('2d');
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

	this.drawGraph = function() {
		this.context.drawImage(this.background, 0, 0);

		for (var i = 0; i < this.graph.nodes.length; i++) {
			this.graph.nodes[i].draw(this.context);
		}

		for (var i = 0; i < this.graph.edges.length; i++) {
			this.graph.edges[i].draw(this.context);
		}
	}

	this.addNode = function(label, x, y) {
		if (!this.graph.addNode(label, x, y)) {
			return false;
		}

		this.drawGraph();
		return true;
	}

	this.addEdge = function(labelOne, labelTwo) {
		if (!this.graph.addEdge(labelOne, labelTwo)) {
			return false;
		}

		this.drawGraph();
		return true;
	}

	this.removeNode = function(label) {
		if (!this.graph.removeNode(label)) {
			return false;
		}

		this.drawGraph();
		return true;
	}

	this.removeEdge = function(labelOne, labelTwo) {
		if (!this.graph.removeEdge(labelOne, labelTwo)) {
			return false;
		}

		this.drawGraph();
		return true;
	}
}
