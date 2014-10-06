
function createNewAppointmentIntoParse() {
    var newApptMedicareNo = document.getElementById("apptMedicareNo").value;
    var newApptDate = document.getElementById("apptDate").value;
    var newApptTime = document.getElementById("apptTime").value;
        parseCreateAppointment(newApptMedicareNo, newApptDate, newApptTime);
}

function parseCreateAppointment(apptMedicareNo, apptDate, apptTime) {
    var Appointment = Parse.Object.extend("Appointment");
    var appointment = new Appointment();
    appointment.set("Appointment_Date", apptDate);
    appointment.set("Appointment_Time", apptTime);
    
    
    appointment.save(null, {
      success: function(appointment) {
        alert("Appointment created");
        location.reload();
      },
      error: function(appointment, error) {
        // Show the error message somewhere and let the user try again.
        alert("Error: " + error.code + " " + error.message);
      }
    });
}

//function to display Appointment Popup
function appointment_show(){ 
document.getElementById('appointmentform').style.display = "block";
}

//function to check target element
function check(e){ 
var target = (e && e.target) || (event && event.srcElement); 

var obj = document.getElementById('appointmentform'); 
var obj2 = document.getElementById('add_appointment_icon'); 

checkParent(target)?obj.style.display='none':null; 
target==obj2?obj.style.display='block':null; 

} 

//function to check parent node and return result accordingly
function checkParent(t){ 
    while(t.parentNode){ 
        if(t==document.getElementById('appointmentform'))
            { 
                return false 
            }
        else if(t==document.getElementById('closeButtonAppointment'))
            {
                return true
            } 
        t=t.parentNode 
    } 
    return true 
}