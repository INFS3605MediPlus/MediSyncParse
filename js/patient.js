var currentUser = Parse.User.current();

patientonload = function(){ 

    if (currentUser) {
        // YOU ARE LOGGED IN

        searchSinglePatientParse();

    } else {
        // YOU ARE NOT LOGGED IN
        window.location.href = "index.html";
    }
    
    
    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
    }

    function searchSinglePatientParse() {        
        var Patient = Parse.Object.extend("Patient");  
        var query = new Parse.Query(Patient);
        var patientID = getURLParameter("patientID");
        if (patientID == null) patientID = "";
        query.equals("objectId", patientID);
        query.find({
            success: function(results){
                // do stuff with patient
                var object = results[0];
            },
            error: function(error){
                alert("No Patients Found");
            }
        });       
    }
};

addLoadEvent(patientonload);