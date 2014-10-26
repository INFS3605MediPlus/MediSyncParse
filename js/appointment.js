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
        var Appointment = Parse.Object.extend("Appointment");  
        var query = new Parse.Query(Appointment);
        var appointmentID = getURLParameter("id");
        if (appointmentID == null) appointmentID = "";
        query.equalTo("objectId", appointmentID);
        query.include("Patient_ID");
        query.find({
            success: function(results){
                // do stuff with appointment
                var appt = results[0];
                var patient = appt.get("Patient_ID");
                $('#patient-name').html("Appointment for: <a href='patient.html?patientID=" + patient.id + "'>" + patient.get('First_Name') + ' ' + patient.get('Last_Name') + "</a>");
                $('#apptdate-result').text(appt.get('Appointment_Date'));
            },
            error: function(error){
                alert(error.message);
            }
        });       
    }
};

addLoadEvent(appointmentonload);