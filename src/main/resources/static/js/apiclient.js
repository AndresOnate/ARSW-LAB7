apiclient=(function(){

    var apiBaseUrl = "http://localhost:8080";

	return {
        getBlueprintsByAuthor: function (authname, callback) {
            $.ajax({
                url: apiBaseUrl + "/blueprints/" + authname,
                method: "GET",
                dataType: "json",
                success: function (data) {
                    callback(data);
                },
            });
		},

		getBlueprintsByNameAndAuthor:function(authname,bpname,callback){
            $.ajax({
                url: apiBaseUrl + "/blueprints/" + authname + "/" + bpname,
                method: "GET",
                dataType: "json",
                success: function (data) {
                    callback(data);
                },
            });
		},

        updateBlueprint: function (authname, bpname, blueprintData, callback) {
            $.ajax({
                url: apiBaseUrl + "/blueprints/" + authname + "/" + bpname,
                method: "PUT",
                data: JSON.stringify(blueprintData),
                contentType: "application/json",
                success: function (data) {
                    callback(data);
                },
            });
        }
	}
})();