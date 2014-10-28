function createNewAppointmentIntoParse() {
    $('#createNewAppointmentButton').attr('disabled','disabled');
    var newApptPatientID = $('#apptPatient').attr('patientid');
    if (newApptPatientID != null) {
        var newApptDate = $('#datetimepicker2').data("DateTimePicker").getDate();
        var newApptSpecialist = $('#apptSpecialist').val();

        var errors = validateAppointmentForm(newApptDate, newApptSpecialist);
        if (errors == "") {
           parseCreateAppointment(newApptPatientID, new Date(newApptDate), newApptSpecialist);
        } else {
            alert(errors);
            $('#createNewAppointmentButton').removeAttr('disabled');
        }    
    } else {
        alert('Error with patient ID');
    }
}

function parseCreateAppointment(apptPatientID, apptDate, apptSpecialist) {
    var Appointment = Parse.Object.extend("Appointment");
    var appointment = new Appointment();
    appointment.set("Appointment_Date", apptDate);
    appointment.set("Creator", Parse.User.current());
    appointment.set("isCancelled", false);
    
    var Patient = Parse.Object.extend("Patient");
    var retrievePatientObject = new Parse.Query(Patient);
    retrievePatientObject.equalTo("objectId", apptPatientID);
    retrievePatientObject.find({
        success: function(Pats){
            var patientObject = Pats[0];
            appointment.set("Patient_ID", patientObject);
            var query = (new Parse.Query(Parse.Role));
            query.equalTo("name", "Specialist");
            query.find({
                success: function(results) {
                    var specialistUsersQuery = results[0].getUsers().query();
                    specialistUsersQuery.equalTo("objectId", apptSpecialist);

                    specialistUsersQuery.find({
                        success: function(results) {
                            if (results[0]) {
                                appointment.set("Specialist_ID", results[0]);
                                appointment.save(null, {
                                  success: function(appointment) {
                                    alert("Appointment created");
                                    window.location.href = "appointment.html?id=" + appointment.id;
                                  },
                                  error: function(Appointment, error) {
                                    // Show the error message somewhere and let the user try again.
                                    alert("Error: " + error.code + " " + error.message);
                                    $('#createNewAppointmentButton').removeAttr('disabled');
                                  }
                                });
                            } else {
                                alert('No such specialist found!');
                                $('#createNewAppointmentButton').removeAttr('disabled');
                            }
                        },
                        error: function(error) {
                            alert("Error: " + error.code + " " + error.message);
                            $('#createNewAppointmentButton').removeAttr('disabled');
                        }
                    });
                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                    $('#createNewAppointmentButton').removeAttr('disabled');
                }
            });
        },
        error: function(Patient, error){
            alert("Error: " + error.code + " " + error.message);
            $('#createNewAppointmentButton').removeAttr('disabled');
        }
    });
        
}

function validateAppointmentForm(apptDate, apptSpecialist) {
    var returnValue = "";
    
    var today = Date.now();

    if (apptDate < today) {
        returnValue = returnValue.concat("Enter valid date\n");
    }

    if ((apptDate == "") || (apptDate == null)) {
        returnValue = returnValue.concat("Time cannot be blank\n");
    }
    
    if ((apptSpecialist == "") || (apptSpecialist == null)) {
        returnValue = returnValue.concat("Specialist cannot be blank\n");
    }
    
    return returnValue;
}

//function to display Appointment Popup
function appointment_show(){ 
    $('#datetimepicker2').datetimepicker();
    document.getElementById('appointmentform').style.display = "block";
    
    var Patient = Parse.Object.extend("Patient");  
    var query = new Parse.Query(Patient);
    var patientID = getURLParameter("patientID");
    if (patientID == null) patientID = "";
    query.equalTo("objectId", patientID);
    query.find({
        success: function(results){
            // do stuff with patient
            var pat = results[0];
            if (pat != null) {
                $('#apptPatient').text(pat.get('First_Name') + ' ' + pat.get('Last_Name') + ' - ' + pat.get('Medicare_No'));
                $('#apptPatient').attr('patientid',pat.id);
            } else {
                $('#apptPatient').text("Error: No patient found");
            }
        },
        error: function(error){
            alert(error.message);
        }
    });
}