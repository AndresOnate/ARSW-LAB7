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
        apiFunction.getBlueprintsByAuthor(author)
        .then(function (data) {
            if (data) {
                blueprints = data.map(function (blueprint) {
                    return { name: blueprint.name, points: blueprint.points };
                });
                $("#author-content").text(author + "'s blueprints: ");
                updateBlueprintTable();
            } else {
                alert("El Autor no fue encontrado.");
            }
        })
        .catch(function (error) {
            console.error("Error al obtener los planos por autor:", error);
            alert("Error al obtener los planos por autor.");
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
        apiFunction.getBlueprintsByNameAndAuthor(author, blueprintName)
        .then( function (blueprint) {
            if (blueprint) {
                currentCanvasPoints = blueprint.points;
                drawBlueprint();
                $("#blueprint-name").text(blueprint.name);
            } else {
                alert("El plano no fue encontrado.");
            }
        })
        .catch(function (error) {
            console.error("Error al obtener los planos por autor y nombre:", error);
            alert("Error al obtener los planos por autor.");
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
                name: decodeURIComponent(blueprintName)
            };
            apiFunction.updateBlueprint(author, blueprintName, updatedBlueprint)
            .then(function () {
                return apiFunction.getBlueprintsByAuthor(author);
            })
            .then(function (newBlueprints) {
                blueprints = newBlueprints.map(function (blueprint) {
                    return { name: blueprint.name, points: blueprint.points };
                });
                $("#blueprint-table tbody").empty();
                updateBlueprintTable();
            })
            .catch(function (error) {
                console.error("Error en la solicitud PUT:");
                console.error("Status:", error.status);
                console.error("Status Text:", error.statusText);
                console.error("Response Text:", error.responseText);
                alert("Error al actualizar el plano.");
            });
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
