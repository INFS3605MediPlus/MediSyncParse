function createNewAppointmentIntoParse() {
    $('#createNewAppointmentButton').attr('disabled','disabled');
    var newApptMedicareNo = document.getElementById("apptMedicareNo").value;
    var newApptDate = new Date(document.getElementById("apptDate").value);
    newApptDate.setDate(newApptDate.getDate() + 1);
    var newApptTime = document.getElementById("apptTime").value;

    var errors = validateAppointmentForm(newApptDate, newApptTime);
    if (errors == "") {
       parseCreateAppointment(parseInt(newApptMedicareNo), newApptDate, newApptTime);
    } else {
        alert(errors);
        $('#createNewAppointmentButton').removeAttr('disabled');
    }    
        
}

function parseCreateAppointment(apptMedicareNo, apptDate, apptTime) {
    var Appointment = Parse.Object.extend("Appointment");
    var appointment = new Appointment();
    appointment.set("Appointment_Date", apptDate);
    appointment.set("Appointment_Time", apptTime);
    
    var Patient = Parse.Object.extend("Patient");
    var retrievePatientObjectID = new Parse.Query(Patient);
    retrievePatientObjectID.equalTo("Medicare_No", apptMedicareNo);
    retrievePatientObjectID.find({
        success: function(Pats){
            var patientObjectId = Pats[0];
            appointment.set("Patient_ID", patientObjectId);

            appointment.save(null, {
              success: function(appointment) {
                alert("Appointment created");
                location.reload();
              },
              error: function(Appointment, error) {
                // Show the error message somewhere and let the user try again.
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

function validateAppointmentForm(apptDate, apptTime) {
    var returnValue = "";
    
    var today = Date.now();

    if (apptDate.getTime() < today) {
        
        returnValue = returnValue.concat("Enter valid date\n");
    }

    if (apptTime == "") {
        returnValue = returnValue.concat("Time cannot be blank\n");
    }
    
    return returnValue;
}

//function to display Appointment Popup
function appointment_show(){ 
    document.getElementById('appointmentform').style.display = "block";
}