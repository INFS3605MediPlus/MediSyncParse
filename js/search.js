var currentUser = Parse.User.current();

searchonload = function(){ 
    
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
        query.find({
            success: function(results){
                alert("Successfully retrieved " + results.length + " patients.");                
                //for (var i=0; i<results.length; i++){
                    //var object = results[i];
                    //alert(object.id + ' - ' + object.get('Last_Name'));                                                  
                //}
                var searchedFirstName = document.getElementById("searched_first_name");
                var searchedLastName = document.getElementById("searched_last_name");            
                searchedFirstName.value = results[0].get('First_Name');
                searchedLastName.value = results[0].get('Last_Name');                
            },
            error: function(error){
                alert("No Patients Found");
            }
        });       
    }
};

addLoadEvent(searchonload);