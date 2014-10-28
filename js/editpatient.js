var currentUser = Parse.User.current();

editpatientonload = function(){ 

    if (currentUser) {
        // YOU ARE LOGGED IN
        var patientID = getURLParameter("patientID");
        if (patientID == null) patientID = "";
        var Patient = Parse.Object.extend("Patient");  
        var query = new Parse.Query(Patient);
        query.equalTo("objectId", patientID);
        query.find({
            success: function(results){
                // do stuff with patient
                var pat = results[0];
                if (pat == null) alert('Careful with your patientID!');
                $('#patient-name').append("<a href='patient.html?patientID=" + pat.id + "'>" + pat.get('First_Name') + ' ' + pat.get('Last_Name') + "</a>");
                $('#patient-first-name').val(pat.get('First_Name'));
                $('#patient-last-name').val(pat.get('Last_Name'));
                $('#patient-email').val(pat.get('Email'));
                $('#patient-address').val(pat.get('Address'));
                $('#patient-gender').val(pat.get('Gender'));
                document.getElementById("patient-dob").valueAsDate = pat.get('DOB');
                $('#patient-contact').val(pat.get('Contact_No'));
                $('#patient-occupation').val(pat.get('Occupation'));
                $('#patient-medicare').val(pat.get('Medicare_No'));
                $('#patient-healthcare').val(pat.get('Health_Care_No'));
                $('#patient-emergency-name').val(pat.get('Emergency_Contact_Name'));
                $('#patient-emergency-number').val(pat.get('Emergency_Contact_No'));
                $('#patient-billing-address').val(pat.get('Billing_Address'));
                $('#patient-billing-no').val(pat.get('Billing_Card_No'));
                $('#patient-billing-name').val(pat.get('Billing_Name'));
                $('#patient-referring-name').val(pat.get('GP_Referral_Name'));
                if (pat.get('GP_Referral_Letter')) {
                    $('#referring-file-help').after("Current File: <span class='glyphicon glyphicon-download'></span><a target='_blank' href='" + pat.get('GP_Referral_Letter').url() + "'>Click to download file</a>");
                }
            },
            error: function(error){
                alert(error.message);
            }
        });
        
        $("#save-patient-button").click(
                  function(event) {
                    $('#save-patient-button').attr('disabled','disabled');
                    event.preventDefault();
                    var patientID = getURLParameter("patientID");
                    if (patientID == null) patientID = "";
                    var firstName = $('#patient-first-name').val();
                    var lastName = $('#patient-last-name').val();
                    var email = $('#patient-email').val();
                    var address = $('#patient-address').val();
                    var gender = $('#patient-gender').val();
                    var dob = document.getElementById("patient-dob").valueAsDate;
                    var contact = $('#patient-contact').val();
                    var occupation = $('#patient-occupation').val();
                    var medicare = $('#patient-medicare').val();
                    var healthcare = $('#patient-healthcare').val();
                    var emergencyName = $('#patient-emergency-name').val();
                    var emergencyNumber = $('#patient-emergency-number').val();
                    var billingAddress = $('#patient-billing-address').val();
                    var billingNo = $('#patient-billing-no').val();
                    var billingName = $('#patient-billing-name').val();
                    var referringName = $('#patient-referring-name').val();
                    var errors = validatePatientForm(firstName, lastName, email, gender, dob, contact, parseInt(medicare), parseInt(healthcare));
                    if (errors == "") {
                        
                        var fileUploadControl = $("#patient-referring-file")[0];
                        if (fileUploadControl.files.length > 0) {
                            var file = fileUploadControl.files[0];
                            var parseFile = new Parse.File("referring gp file", file);
                            parseFile.save().then(function() {
                                // The file has been saved to Parse.
                                var Patient = Parse.Object.extend("Patient");
                                var query = new Parse.Query(Patient);
                                query.equalTo("objectId", patientID);
                                query.first({
                                    success: function(pat){
                                        // do stuff with patient
                                        pat.set('GP_Referral_Letter',parseFile);
                                        pat.set('First_Name',firstName);
                                        pat.set('Last_Name',lastName);
                                        pat.set('Email',email);
                                        pat.set('Address',address);
                                        pat.set('Gender',gender);
                                        pat.set('DOB',dob);
                                        pat.set('Contact_No',contact);
                                        pat.set('Occupation',occupation);
                                        pat.set('Medicare_No',parseInt(medicare));
                                        pat.set('Health_Care_No',parseInt(healthcare));
                                        pat.set('Emergency_Contact_Name',emergencyName);
                                        pat.set('Emergency_Contact_No',emergencyNumber);
                                        pat.set('Billing_Address',billingAddress);
                                        pat.set('Billing_Card_No',parseInt(billingNo));
                                        pat.set('Billing_Name',billingName);
                                        pat.set('GP_Referral_Name',referringName);
                                        pat.save().then(function(ss) {
                                            alert('Patient saved!');
                                            location.reload();
                                        }, function(error) {
                                            alert("Error: " + error.code + " " + error.message);
                                            $('#save-patient-button').removeAttr('disabled');
                                        });
                                    },
                                    error: function(error){
                                        alert(error.message);
                                        $('#save-patient-button').removeAttr('disabled');
                                    }
                                });
                            }, function(error) {
                                alert("Error: " + error.code + " " + error.message);
                                $('#save-patient-button').removeAttr('disabled');
                            });

                        } else {
                            // store data without storing file
                            var Patient = Parse.Object.extend("Patient");
                            var query = new Parse.Query(Patient);
                            query.equalTo("objectId", patientID);
                            query.first({
                                success: function(pat){
                                    // do stuff with patient
                                    pat.set('First_Name',firstName);
                                    pat.set('Last_Name',lastName);
                                    pat.set('Email',email);
                                    pat.set('Address',address);
                                    pat.set('Gender',gender);
                                    pat.set('DOB',dob);
                                    pat.set('Contact_No',contact);
                                    pat.set('Occupation',occupation);
                                    pat.set('Medicare_No',parseInt(medicare));
                                    pat.set('Health_Care_No',parseInt(healthcare));
                                    pat.set('Emergency_Contact_Name',emergencyName);
                                    pat.set('Emergency_Contact_No',emergencyNumber);
                                    pat.set('Billing_Address',billingAddress);
                                    pat.set('Billing_Card_No',parseInt(billingNo));
                                    pat.set('Billing_Name',billingName);
                                    pat.set('GP_Referral_Name',referringName);
                                    pat.save().then(function(ss) {
                                        alert('Patient saved!');
                                        location.reload();
                                    }, function(error) {
                                        alert("Error: " + error.code + " " + error.message);
                                        $('#save-patient-button').removeAttr('disabled');
                                    });
                                },
                                error: function(error){
                                    alert(error.message);
                                    $('#save-patient-button').removeAttr('disabled');
                                }
                            });
                        }
                        //location.reload();
                    } else {
                        alert(errors);
                        $('#save-patient-button').removeAttr('disabled');
                    }
                  }
                );
        
    } else {
        // YOU ARE NOT LOGGED IN
        window.location.href = "index.html";
    }
};

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

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

addLoadEvent(editpatientonload);