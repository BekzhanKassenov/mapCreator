//================================================================================
// MapCreator declaration
//================================================================================
function MapCreator(canvas, nodesTable, edgesTable) {
    this.graph = new Graph();

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.nodesTable = nodesTable;
    this.edgesTable = edgesTable;

    this.canvasBackground = null;

    this.setCanvasBackground = function(imageName, onFinished) {
        this.canvasBackground = new Image();
        this.canvasBackground.src = imageName;

        var canvas = this.canvas;
        var context = this.context;
        
        this.canvasBackground.onload = function() {
            canvas.width = this.width;
            canvas.height = this.height;
            context.drawImage(this, 0, 0);
            onFinished();
        }
    }

    this.updateCanvas = function() {
        this.context.drawImage(this.canvasBackground, 0, 0);
        this.graph.draw(this.context);
    }

    this.updateTables = function() {
        $(this.nodesTable).children("tbody").empty();
        $(this.edgesTable).children("tbody").empty();
        
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

    this.readGraph = function(graphJSON) {
        console.log(graphJSON);
        var obj = JSON.parse(graphJSON);
        this.graph.clear();

        for (var i = 0; i < obj.nodes.length; i++) {
            var node = obj.nodes[i];

            if (!this.graph.addNode(node.label, parseInt(node.x), parseInt(node.y))) {
                return false;
            }
        }

        for (var i = 0; i < obj.edges.length; i++) {
            var edge = obj.edges[i];
            if (!this.graph.addEdge(edge.labelOne, edge.labelTwo)) {
                return false;
            }
        }

        this.updateViews();
        return true;
    }

    this.generateJSON = function() {
        return this.graph.toJSON();
    }
}
