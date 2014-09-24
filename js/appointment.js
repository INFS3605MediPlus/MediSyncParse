var currentUser = Parse.User.current();

appointmentonload = function(){ 

    if (currentUser) {
        // YOU ARE LOGGED IN

        searchSingleAppointmentParse();

    } else {
        // YOU ARE NOT LOGGED IN
        window.location.href = "index.html";
    }
    
    
    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
    }

    function searchSingleAppointmentParse() {        
        var Patient = Parse.Object.extend("Appointment");  
        var query = new Parse.Query(Appointment);
        var appointmentID = getURLParameter("appointmentID");
        if (appointmentID == null) appointmentID = "";
        query.equals("objectId", appointmentID);
        query.find({
            success: function(results){
                // do stuff with appointment
                var object = results[0];
            },
            error: function(error){
                alert("No Appointments Found");
            }
        });       
    }
};

addLoadEvent(appointmentonload);