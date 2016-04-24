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
		context.font = "30px Comic Sans MS";
		context.fillStyle = "red";
		context.textAlign = "center";
		context.fillText(this.label, this.x, this.y - 40);
	}

	this.draw = function(context) {
		this.drawX(context);
		this.drawName(context);
	}
}

//================================================================================
// Edge declaration
//================================================================================

function Edge(nodeOne, nodeTwo) {
	this.nodeOne = nodeOne;
	this.nodeTwo = nodeTwo;

	this.equals = function(otherEdge) {
		if (otherEdge.nodeOne && otherEdge.nodeTwo) {
			if (otherEdge.nodeOne.label === nodeOne.label && otherEdge.nodeTwo.label === nodeTwo.label) {
				return true;
			}
	
			if (otherEdge.nodeOne.label === nodeTwo.label && otherEdge.nodeTwo.label === nodeOne.label) {
				return true;
			}
		}

		return false;
	}

	this.draw = function(context) {
		context.lineWidth = 3;
		context.strokeStyle = "#000000";
		context.lineCap = 'round';

		context.beginPath();

		context.moveTo(this.nodeOne.x, this.nodeOne.y);
		context.lineTo(this.nodeTwo.x, this.nodeTwo.y);

		context.stroke();
		context.closePath();
	}
}

//================================================================================
// Graph declaration
//================================================================================
function Graph() {
	this.nodes = new Array();
	this.edges = new Array();

	this.getNodeByLabel = function(label) {
		for (var i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].label === label) {
				return this.nodes[i];
			}
		}

		return null;
	}

	this.addNode = function(label, x, y) {
		if (this.getNodeByLabel(label) !== null) {
			return false;
		}

		this.nodes.push(new Node(label, x, y));
		return true;
	}

	this.addEdge = function(labelOne, labelTwo) {
		if (labelOne === labelTwo) {
			return false;
		}

		var nodeOne = this.getNodeByLabel(labelOne);
		var nodeTwo = this.getNodeByLabel(labelTwo);

		if (nodeOne === null || nodeTwo === null) {
			return false;
		}

		var edge = new Edge(nodeOne, nodeTwo);
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
			if (this.nodes[i].label === label) {
				this.nodes.splice(i, 1);
				result = true;
			} else {
				i++;
			}
		}

		i = 0;
		while (i < this.edges.length) {
			if (this.edges[i].nodeOne.label === label || this.edges[i].nodeTwo.label === label) {
				this.edges.splice(i, 1);
				result = true;
			} else {
				i++;
			}
		}

		return result;
	}

	this.removeEdge = function(labelOne, labelTwo) {
		if (labelOne === labelTwo) {
			return false;
		}

		var nodeOne = this.getNodeByLabel(labelOne);
		var nodeTwo = this.getNodeByLabel(labelTwo);

		if (nodeOne === null || nodeTwo === null) {
			return false;
		}

		var deleteEdge = new Edge(nodeOne, nodeTwo);
		var i = 0;

		var result = false;

		while (i < this.edges.length) {
			if (this.edges[i].equals(deleteEdge)) {
				this.edges.splice(i, 1);
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

	this.generateJSON = function() {
		return JSON.stringify(this.graph);
	}
}
