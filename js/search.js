var currentUser = Parse.User.current();

searchonload = function(){ 
    $("#search-link").addClass("active");

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
        var queryFirstname = new Parse.Query(Patient);
        var queryLastname = new Parse.Query(Patient);
        var queryMedicare = new Parse.Query(Patient);
        // NOTE: we may have to uppercase the first character before passing it into the query!
        var queryVal = capitaliseFirstLetter(getURLParameter("q"));
        if (queryVal == null) queryVal = "";
        
        queryFirstname.startsWith("First_Name", queryVal);
        queryFirstname.limit(5);
        
        queryLastname.startsWith("Last_Name", queryVal);
        queryLastname.limit(5);
        
        queryMedicare.equalTo("Medicare_No", Number(queryVal));
        queryMedicare.limit(1);
        
        var mainQuery = Parse.Query.or(queryFirstname, queryLastname, queryMedicare);
        mainQuery.find({
            success: function(results){
                for (var i=0; i<results.length; i++){
                    var object = results[i];
                    
                    $("#search-results-table").append("<tr><td>" + i + "</td><td><a class='patient-result' href='patient.html?patientID=" + object.id + "' data-toggle='tooltip' data-placement='right' title='See patient details'>" + object.get('First_Name') + "</a></td><td>" + object.get('Last_Name') + "</td><td>" + object.get('Medicare_No') + "</td></tr>");
                }
                $('.patient-result').tooltip();
            },
            error: function(error){
                alert("No Patients Found");
            }
        });       
    }
};

addLoadEvent(searchonload);