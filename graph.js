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

    this.addToTable = function(table) {
        var rowCode = "<tr>";
        rowCode += "<td>" + this.label + "</td>";
        rowCode += "<td>" + this.x     + "</td>";
        rowCode += "<td>" + this.y     + "</td>";
        rowCode += "<td> <button onclick='removeNode(\"" + this.label + "\")'> Remove </button> </td>";
        rowCode += "</tr>";

        $(table).append(rowCode);
    }

    this.toJSON = function() {
        return '{"label": "' + this.label + '", "x" : "' + this.x + '", "y": "' + this.y + '"}';
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

    this.addToTable = function(table) {
        var rowCode = "<tr>";
        rowCode += "<td>" + this.nodeOne.label + "</td>";
        rowCode += "<td>" + this.nodeTwo.label + "</td>";
        rowCode += "<td> <button onclick='removeEdge(\"" + this.nodeOne.label + "\", \"" + this.nodeTwo.label + "\")'> Remove </button> </td>";

        $(table).append(rowCode);
    }

    this.toJSON = function() {
        return '{"labelOne" : "' + this.nodeOne.label + '", "labelTwo": "' + this.nodeTwo.label + '"}';
    }
}

//================================================================================
// Graph declaration
//================================================================================
function Graph() {
    this.nodes = [];
    this.edges = [];

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

    this.clear = function() {
        this.nodes = [];
        this.edges = [];
    }

    this.draw = function(context) {
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].draw(context);
        }

        for (var i = 0; i < this.edges.length; i++) {
            this.edges[i].draw(context);
        }
    }

    this.fillTable = function(nodesTable, edgesTable) {
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].addToTable(nodesTable);
        }

        for (var i = 0; i < this.edges.length; i++) {
            this.edges[i].addToTable(edgesTable);
        }
    }

    this.toJSON = function() {
        var nodesJSON = "";
        for (var i = 0; i < this.nodes.length; i++) {
            nodesJSON += this.nodes[i].toJSON();
            if (i + 1 != this.nodes.length) {
                nodesJSON += ",";
            }
        }

        var edgesJSON = "";
        for (var i = 0; i < this.edges.length; i++) {
            edgesJSON += this.edges[i].toJSON();
            if (i + 1 != this.edges.length) {
                edgesJSON += ",";
            }
        }

        return '{"nodes": [' + nodesJSON + '], "edges": [' + edgesJSON + '] }';
    }
}
