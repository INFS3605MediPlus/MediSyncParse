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
        query.equalTo("objectId", patientID);
        query.find({
            success: function(results){
                // do stuff with patient
                var pat = results[0];
                $('#patient-name').text(pat.get('First_Name') + ' ' + pat.get('Last_Name'));
                $('#patient-result').text(pat.get('First_Name') + ' ' + pat.get('Last_Name'));
                $('#number-result').text(pat.get('Contact_No'));
                $('#dob-result').text(pat.get('DOB'));
                $('#emerg-result').text(pat.get('Emergency_Contact_No'));
                $('#address-result').text(pat.get('Address'));
                $('#medi-result').text(pat.get('Medicare_No'));
            },
            error: function(error){
                alert(error.message);
            }
        });       
    }
};

addLoadEvent(patientonload);