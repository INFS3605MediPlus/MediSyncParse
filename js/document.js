var currentUser = Parse.User.current();

documentonload = function(){ 
    $("#search-link").addClass("active");

    if (currentUser) {
        // YOU ARE LOGGED IN

        searchDocumentParse();

    } else {
        // YOU ARE NOT LOGGED IN
        window.location.href = "index.html";
    }

    
    
    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
    }

    function searchDocumentParse() {
        var documents = Parse.Object.extend("Document");  
        var query = new Parse.Query(documents);
        var appointmentID = getURLParameter("id");
        query.equalTo("Appointment_ID", appointmentID);
        query.find({
            success: function(results){
                for (var i=0; i<results.length; i++){
                    var object = results[i];

                    $("#document-results-table").append("<tr><td>" + i + object.get('Document_Type') + "</td><td>" + object.get('Document_Description') + "</td></tr>");
            }},
            error: function(error){
                alert(error.message);
            }
        });
    };
    
};

addLoadEvent(documentonload);