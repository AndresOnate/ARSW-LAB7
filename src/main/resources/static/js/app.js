var app = (function(){

    var author = "";
    var blueprints = [];
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

	function getBlueprintsByAuthor() {
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

    function drawBlueprint(points) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        points.forEach(function (point, index) {
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
        var blueprintName = selectedBp.id;
        apiFunction.getBlueprintsByNameAndAuthor(author, blueprintName, function (blueprint) {
            if (blueprint) {
                drawBlueprint(blueprint.points);
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
            alert('pointerdown at '+(event.pageX - offset.left) +','+ (event.pageY-offset.top));
          });
        }
        else {
          canvas.addEventListener("mousedown", function(event){
                      alert('mousedown at '+ (event.pageX - offset) +','+ (event.pageY-offset));
            }
          );
        }
    }
	return {
	    getBlueprintsByAuthor: getBlueprintsByAuthor,
        getBlueprintsByAuthorAndName: getBlueprintsByAuthorAndName,
        setAuthorName: setAuthorName,
        initCanvas: initCanvas
	}
})();
