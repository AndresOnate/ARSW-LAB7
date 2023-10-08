apiclient=(function(){

    var apiBaseUrl = "http://localhost:8080";

	return {
        getBlueprintsByAuthor: function (authname) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: apiBaseUrl + "/blueprints/" + authname,
                    method: "GET",
                    dataType: "json",
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (error) {
                        reject(error);
                    },
                });
            });
        },

        getBlueprintsByNameAndAuthor: function (authname, bpname) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: apiBaseUrl + "/blueprints/" + authname + "/" + bpname,
                    method: "GET",
                    dataType: "json",
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (error) {
                        reject(error);
                    },
                });
            });
        },
        
        updateBlueprint: function (authname, bpname, blueprintData) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: apiBaseUrl + "/blueprints/" + authname + "/" + bpname,
                    method: "PUT",
                    data: JSON.stringify(blueprintData),
                    contentType: "application/json",
                    success: function () {
                        resolve();
                    },
                    error: function (error) {
                        reject(error);
                    },
                });
            });
        }
	}
})();