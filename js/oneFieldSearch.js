var currentUser = Parse.User.current();

searchonload = function(){ 
    $("#login-section").addClass("active");

    if (currentUser) {
        // YOU ARE LOGGED IN

        searchPatientParse();

    } else {
        // YOU ARE NOT LOGGED IN
        window.location.href = "index.html";
    }
    
    
    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
    }

    function searchPatientParse() {        
        var Patient = Parse.Object.extend("Patient");  
        var query = new Parse.Query(Patient);
        // NOTE: we may have to uppercase the first character before passing it into the query!
        var patientFirstName = getURLParameter("firstName");
        var patientLastName = getURLParameter("lastName");
        if (patientFirstName == null) patientFirstName = "";
        if (patientLastName == null) patientLastName = "";
        query.startsWith("First_Name", patientFirstName);
        query.startsWith("Last_Name", patientLastName);
        query.limit(10);
        query.find({
            success: function(results){
                for (var i=0; i<results.length; i++){
                    var object = results[i];
                    
                    $("#patient-search-results-section").append("<div name='patientResultsForm'>First name:<input id='searched_first_name" + i + "' type='text' name='firstname'>Last name:<input id='searched_last_name" + i + "' type='text' name='lastname'></div>");
                    $("#searched_first_name" + i + "").val(results[i].get('First_Name'));
                    $("#searched_last_name" + i + "").val(results[i].get('Last_Name'));
                }          
            },
            error: function(error){
                alert("No Patients Found");
            }
        });       
    }
};

addLoadEvent(searchonload);