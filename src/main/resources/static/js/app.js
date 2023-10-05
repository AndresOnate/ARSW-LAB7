var app = (function(){

    var author = "";
    var blueprints = [];
    var canvas;
    var ctx;
    var apiFunction = apiclient;

    function setAuthorName(author) {
        author = author;
    }

	function updateBlueprintTable() {
        blueprints.map(function (blueprint) {
            var newRow = "<tr><td>" + blueprint.name + "</td><td>" + blueprint.points.length  + "</td><td><button id=" + encodeURIComponent(blueprint.name) + " onclick='app.getBlueprintsByAuthorAndName(this)'>Open</button></td></tr>";
            $("#blueprint-table tbody").append(newRow);
        });
        var totalPoints = blueprints.reduce(function (accumulator, blueprint) {
            return accumulator + blueprint.points.length;
        }, 0);
        $("#total-points").text("Total user points: " + totalPoints);
    }

	function getBlueprintsByAuthor() {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        author = $("#author").val();
		$("#blueprint-table tbody").empty();
		$("#author-content").text(author + "'s blueprints: ");
        apiFunction.getBlueprintsByAuthor(author, function (data) {
            if(data){
                blueprints = data.map(function (blueprint) {
                    return { name: blueprint.name, points: blueprint.points };
                });
                updateBlueprintTable(); 
            }else{
                alert("El Autor no fue encontrado.");
            }
        });
    }

    function drawBlueprint(blueprint) {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        var points =  blueprint.points;
        blueprint.points.forEach(function (point, index) {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.stroke();
        $("#blueprint-name").text(blueprint.name);
    }
    
    function getBlueprintsByAuthorAndName(selectedBp) {
        author = $("#author").val();
        var blueprintName = selectedBp.id;
        apiFunction.getBlueprintsByNameAndAuthor(author, blueprintName, function (data) {
            if (data) {
                drawBlueprint(data);
            } else {
                alert("El plano no fue encontrado.");
            }
        });
    }
	return {
	    getBlueprintsByAuthor: getBlueprintsByAuthor,
        getBlueprintsByAuthorAndName: getBlueprintsByAuthorAndName,
        setAuthorName: setAuthorName
	}
})();
