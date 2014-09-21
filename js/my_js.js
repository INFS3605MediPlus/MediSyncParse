


function createNewPatientIntoParse() {
    var newPatientfname = document.getElementById("firstNameOfPatient").value;
    var newPatientlname = document.getElementById("lastNameOfPatient").value;
        parseCreatePatient(newPatientfname, newPatientlname);
}

function parseCreatePatient(fname, lname) {
    var Patient = Parse.Object.extend("Patient");
    var patient = new Patient();
    patient.set("First_Name", fname);
    patient.set("Last_Name", lname);
      
    patient.save(null, {
      success: function(patient) {
        alert("Patient created");
      },
      error: function(patient, error) {
        // Show the error message somewhere and let the user try again.
        alert("Error: " + error.code + " " + error.message);
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
