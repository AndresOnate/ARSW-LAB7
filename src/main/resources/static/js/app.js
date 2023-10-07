var app = (function(){

    var author = "";
    var blueprintName = "";
    var blueprints = [];
    var currentCanvasPoints = [];
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
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

    function clear(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        currentCanvasPoints = [];
        $("#author-content").text("Author Name");
        $("#total-points").text("Total user points: ");
        $("#blueprint-table tbody").empty();
        $("#blueprint-name").text("Blueprint Name");
    }

	function getBlueprintsByAuthor() {
        clear();
        author = $("#author").val();
        apiFunction.getBlueprintsByAuthor(author, function (data) {
            if(data){
                blueprints = data.map(function (blueprint) {
                    return { name: blueprint.name, points: blueprint.points };
                });
                $("#author-content").text(author + "'s blueprints: ");
                updateBlueprintTable(); 
            }else{
                alert("El Autor no fue encontrado.");
            }
        });
    }

    function drawBlueprint() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        currentCanvasPoints.forEach(function (point, index) {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.stroke();
    }

    function getBlueprintsByAuthorAndName(selectedBp) {
        author = $("#author").val();
        blueprintName = selectedBp.id;
        apiFunction.getBlueprintsByNameAndAuthor(author, blueprintName, function (blueprint) {
            if (blueprint) {
                currentCanvasPoints = blueprint.points;
                drawBlueprint();
                $("#blueprint-name").text(blueprint.name);
            } else {
                alert("El plano no fue encontrado.");
            }
        });
    }

    function getOffset(obj) {
        var offsetLeft = 0;
        var offsetTop = 0;
        do {
          if (!isNaN(obj.offsetLeft)) {
              offsetLeft += obj.offsetLeft;
          }
          if (!isNaN(obj.offsetTop)) {
              offsetTop += obj.offsetTop;
          }   
        } while(obj = obj.offsetParent );
        return {left: offsetLeft, top: offsetTop};
    } 

    function initCanvas(){
        var offset  = getOffset(canvas);
        if(window.PointerEvent) {
            canvas.addEventListener("pointerdown", function(event){
                if(currentCanvasPoints.length > 0){
                    var x = event.pageX - offset.left;
                    var y = event.pageY - offset.top;
                    currentCanvasPoints.push({ x: x, y: y });
                    drawBlueprint();
                }
            });
        } else {
            canvas.addEventListener("mousedown", function(event){
                if(currentCanvasPoints.length > 0){
                    var x = event.pageX - offset.left;
                    var y = event.pageY - offset.top;
                    currentCanvasPoints.push({ x: x, y: y });
                    drawBlueprint();
                }
            });
        }
    }  
    
    function saveOrUpdateBlueprint() {
        if (currentCanvasPoints.length > 0) {
            var updatedBlueprint = {
                author: author,
                points: currentCanvasPoints,
                name: blueprintName
            };
            apiFunction.updateBlueprint(author, blueprintName, updatedBlueprint, function (response) {
                alert("Blueprint updated successfully!");
                apiFunction.getBlueprintsByAuthor(author, function (data) {
                    if (data) {
                        blueprints = data.map(function (blueprint) {
                            return { name: blueprint.name, points: blueprint.points };
                        });
                        updateBlueprintTable();
                    } else {
                        alert("Error fetching blueprints.");
                    }
                });
                    // Calcula nuevamente los puntos totales del usuario
                var totalPoints = blueprints.reduce(function (accumulator, blueprint) {
                    return accumulator + blueprint.points.length;
                }, 0);
                $("#total-points").text("Total user points: " + totalPoints);
            });
        } else {
            alert("No points to save/update.");
        }
    }
    
	return {
	    getBlueprintsByAuthor: getBlueprintsByAuthor,
        getBlueprintsByAuthorAndName: getBlueprintsByAuthorAndName,
        setAuthorName: setAuthorName,
        initCanvas: initCanvas,
        saveOrUpdateBlueprint: saveOrUpdateBlueprint
	}
})();
