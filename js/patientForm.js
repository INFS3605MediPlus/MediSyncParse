function createNewPatientIntoParse() {
    $('#createNewPatientButton').attr('disabled','disabled');
    var newPatientfname = document.getElementById("firstNameOfPatient").value;
    var newPatientlname = document.getElementById("lastNameOfPatient").value;
    var newPatientemail = document.getElementById("emailOfPatient").value;
    var newPatientaddress = document.getElementById("addressOfPatient").value;
    var newPatientDOB = new Date(document.getElementById("DOBOfPatient").value);
    var newPatientcontact = document.getElementById("contactNoOfPatient").value;
    var newPatientoccupation = document.getElementById("occupationOfPatient").value;
    var newPatientmedicare = document.getElementById("medicareNoOfPatient").value;
    var newPatienthealthcare = document.getElementById("healthCareNoOfPatient").value;
    var newPatientemergname = document.getElementById("nameOfEmergencyContact").value;
    var newPatientemergcontact = document.getElementById("contactNoOfEmergencyContact").value;
    var newPatientGender = document.getElementById("genderDropdown");
    var newPatientSelectedGender = newPatientGender.options[newPatientGender.selectedIndex].value;

    var errors = validatePatientForm(newPatientfname, newPatientlname, newPatientemail, newPatientSelectedGender, newPatientDOB, newPatientcontact, parseInt(newPatientmedicare), parseInt(newPatienthealthcare));
    if (errors == "") {
       parseCreatePatient(newPatientfname, newPatientlname, newPatientemail, newPatientaddress, newPatientDOB, newPatientcontact, newPatientoccupation, parseInt(newPatientmedicare), parseInt(newPatienthealthcare), newPatientemergname, newPatientemergcontact, newPatientSelectedGender);
    } else {
        alert(errors);
        $('#createNewPatientButton').removeAttr('disabled');
    }    
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
        window.location.href="patient.html?patientID=" + patient.id;
      },
      error: function(patient, error) {
        // Show the error message somewhere and let the user try again.
        alert("Error: " + error.code + " " + error.message);
        $('#createNewPatientButton').removeAttr('disabled');
      }
    });
}

function validatePatientForm(fname, lname, email, gender, DOB, contactno, medicareno, healthcareno) {
    var returnValue = "";
    
    if (fname == "") {
        returnValue = returnValue.concat("First name cannot be blank\n");
    }
    if (lname == "") {
        returnValue = returnValue.concat("Last name cannot be blank\n");
    }
    if (email == "") {
        returnValue = returnValue.concat("Email cannot be blank\n");
    }
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
        returnValue = returnValue.concat("Please enter a valid email address\n");
    }
    if (gender == "Select") {
        returnValue = returnValue.concat("Gender cannot be blank\n");
    }
    if (DOB == "") {
        returnValue = returnValue.concat("DOB cannot be blank\n");
    }
    if (contactno == "") {
        returnValue = returnValue.concat("Contact number cannot be blank\n");
    }
    if (contactno.length <7 || contactno.length >13) {
        returnValue = returnValue.concat("Contact number must have between 8 and 12 digits\n");
    }
    
    return returnValue;
}

//function to display Popup
function div_show(){ 
    document.getElementById('patientform').style.display = "block";
}
