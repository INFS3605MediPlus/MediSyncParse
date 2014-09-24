
function createNewPatientIntoParse() {
    var newPatientfname = document.getElementById("firstNameOfPatient").value;
    var newPatientlname = document.getElementById("lastNameOfPatient").value;
    var newPatientemail = document.getElementById("emailOfPatient").value;
    var newPatientaddress = document.getElementById("addressOfPatient").value;
    var newPatientDOB = document.getElementById("DOBOfPatient").value;
    var newPatientcontact = document.getElementById("contactNoOfPatient").value;
    var newPatientoccupation = document.getElementById("occupationOfPatient").value;
    var newPatientmedicare = document.getElementById("medicareNoOfPatient").value;
    var newPatienthealthcare = document.getElementById("healthCareNoOfPatient").value;
    var newPatientemergname = document.getElementById("nameOfEmergencyContact").value;
    var newPatientemergcontact = document.getElementById("contactNoOFEmergencyContact").value;
    var gendervalue = '';
    if (document.getElementById("m").checked){
      gendervalue = document.getElementById("m").value;
    } else {
      gendervalue = document.getElementById("f").value;
    }
        parseCreatePatient(newPatientfname, newPatientlname, newPatientemail, newPatientaddress, newPatientDOB, newPatientcontact, newPatientoccupation, newPatientmedicare, newPatienthealthcare, newPatientemergname, newPatientemergcontact, gendervalue);
}

function parseCreatePatient(fname, lname, email, address, dob, contact, occ, medi, health, emername, emerNo, gender) {
    var Patient = Parse.Object.extend("Patient");
    var patient = new Patient();
    patient.set("First_Name", fname);
    patient.set("Last_Name", lname);
    patient.set("Address", address);
    patient.set("Email", email);
    patient.set("Gender", gender);
    patient.set("Contact_No", contact);
    patient.set("Emergency_Contact_Name", emername);
    patient.set("Emergency_Contact_No", emerNo);
    patient.set("Medicare_No", medi);
    patient.set("DOB", dob);
    patient.set("Occupation", occ);
    patient.set("Health_Care_No", health);
      
    patient.save(null, {
      success: function(patient) {
        alert("Patient created");
      },
      error: function(patient, error) {
        // Show the error message somewhere and let the user try again.
        //alert("Error: " + error.code + " " + error.message);
      }
    });
}

//function to display Popup
function div_show(){ 
document.getElementById('abc').style.display = "block";
}

//function to check target element
function check(e){ 
var target = (e && e.target) || (event && event.srcElement); 

var obj = document.getElementById('abc'); 
var obj2 = document.getElementById('popup'); 

checkParent(target)?obj.style.display='none':null; 
target==obj2?obj.style.display='block':null; 

} 

//function to check parent node and return result accordingly
function checkParent(t){ 
	while(t.parentNode){ 
		if(t==document.getElementById('abc'))
			{ 
				return false 
			}
		else if(t==document.getElementById('closeButton'))
			{
				return true
			} 
		t=t.parentNode 
	} 
	return true 
} 