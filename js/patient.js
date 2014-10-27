var currentUser = Parse.User.current();

patientonload = function(){ 

    if (currentUser) {
        // YOU ARE LOGGED IN
        var patientID = getURLParameter("patientID");
        if (patientID == null) patientID = "";
        searchSinglePatientParse(patientID);
        
        $('#search_patient_button').after("<img id='add_appointment_icon' src='assets/add_appointment.png' onclick ='appointment_show()' class='add-icons' data-toggle='tooltip' data-placement='bottom' title='Add appointment!'/></form>");
        $('.add-icons').tooltip();

    } else {
        // YOU ARE NOT LOGGED IN
        window.location.href = "index.html";
    }
    
    
    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
    }

    function searchSinglePatientParse(patientID) {        
        var Patient = Parse.Object.extend("Patient");  
        var query = new Parse.Query(Patient);
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
                getAppointmentDetailsForPatient(pat);
            },
            error: function(error){
                alert(error.message);
            }
        });
    }
    
    function getAppointmentDetailsForPatient(patient) {
        var Appointment = Parse.Object.extend("Appointment");  
        var query = new Parse.Query(Appointment);
        query.equalTo("Patient_ID", patient);
        query.include("Specialist_ID");
        query.include("Clinical_Detail_ID");
        query.find({
            success: function(results){
                for (var i=0; i < results.length; i++) {
                    var appt = results[i];
                    if (appt.get("Clinical_Detail_ID")) {
                        var notes = appt.get("Clinical_Detail_ID").get("Clinical_Notes");
                    } else {
                        var notes = "";
                    }
                    var specialist = appt.get("Specialist_ID").get("Staff_First_Name") + ' ' + appt.get("Specialist_ID").get("Staff_Last_Name");
                    $("#appt-results-table").append("<tr><td>" + i + "</td><td><a class='appt-result' href='appointment.html?id=" + appt.id + "' data-toggle='tooltip' data-placement='right' title='See appointment details'>" + appt.get('Appointment_Date') + "</a></td><td>" + specialist + "</td><td>" + notes + "</td></tr>");
                    $('.appt-result').tooltip();
                }
            },
            error: function(error){
                alert(error.message);
            }
        });
    }
};

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

addLoadEvent(patientonload);