var currentUser = Parse.User.current();

appointmentonload = function(){ 

    if (currentUser) {
        // YOU ARE LOGGED IN

        searchSingleAppointmentParse();
        
        document.getElementById("save-button").onclick = savenotes;

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
        query.include("Clinical_Detail_ID");
        query.include("Clinical_MForm_ID");
        query.find({
            success: function(results){
                // do stuff with appointment
                var appt = results[0];
                var patient = appt.get("Patient_ID");
                var clinicalDetails = appt.get("Clinical_Detail_ID");
                $('#patient-name').html("Appointment for: <a href='patient.html?patientID=" + patient.id + "'>" + patient.get('First_Name') + ' ' + patient.get('Last_Name') + "</a>");
                $('#apptdate-result').text(appt.get('Appointment_Date'));
                
                if (clinicalDetails != null) {
                    $('#red').html("<h1>Notes</h1><div id='editor'>Loading&hellip;</div>");
                    var notes = clinicalDetails.get('Clinical_Notes');
                    $('#editor').html(notes);
                } else {
                    $('#editor').wysiwyg();
                    $('#editor').html("Please enter your new notes here");
                }
                
                
                var CMForm = appt.get("Clinical_MForm_ID");
                if (CMForm != null) {
                    // set table values with clinical measurement form results
                    $('#orange').html("<h1>Clinical Measurement Form Result</h1><table class='table table-bordered' id='clinical-measurement-details'><tbody><tr class='active'><td>Weight:</td><td id='weight-result'></td><td>Height:</td><td id='height-result'></td></tr><tr class='active'><td>Blood Type:</td><td id='blood-type-result'></td><td>Oxygen Level:</td><td id='oxygen-result'></td></tr><tr class='active'><td>Blood Pressure:</td><td id='blood-pressure-result'></td><td>Heart Rate:</td><td id='heart-rate-result'></td></tr><tr class='active'><td>Lung Function:</td><td id='lung-result'></td></tr></tbody></table>");
                    $('#weight-result').text(CMForm.get('Weight'));
                    $('#height-result').text(CMForm.get('Height'));
                    $('#blood-type-result').text(CMForm.get('Blood_Type'));
                    $('#oxygen-result').text(CMForm.get('Oxygen_Level'));
                    $('#blood-pressure-result').text(CMForm.get('Blood_Pressure'));
                    $('#heart-rate-result').text(CMForm.get('Heart_Rate'));
                    $('#lung-result').text(CMForm.get('Lung_Function'));
                } else {
                    // create form for entering clinical measurement form
                    //$('#orange').html("<h1>Enter Clinical Measurement Form Results</h1><div id='CMForm'>results here</div>");
                    $("#CMFormSubmit").click(function(event) {
                        event.preventDefault(); // cancel default behavior
                        $("#CMFormSubmit").attr('disabled','disabled');
                        var height = parseInt(document.forms["CMForm"]["inputHeight"].value);
                        var weight = parseInt(document.forms["CMForm"]["inputWeight"].value);
                        var bloodType = document.forms["CMForm"]["inputBloodType"].value;
                        var oxygenLevel = document.forms["CMForm"]["inputOxygenLevel"].value;
                        var bloodPressure = document.forms["CMForm"]["inputBloodPressure"].value;
                        var heartRate = parseInt(document.forms["CMForm"]["inputHeartRate"].value);
                        var lungFunction = parseInt(document.forms["CMForm"]["inputLungFunction"].value);
                        
                        var Appointment = Parse.Object.extend("Appointment");
                        var Clinical_MForm = Parse.Object.extend("Clinical_Measurements");
                        var newClinicalMForm = new Clinical_MForm();
                        newClinicalMForm.set('Weight',weight);
                        newClinicalMForm.set('Height',height);
                        newClinicalMForm.set('Blood_Type',bloodType);
                        newClinicalMForm.set('Oxygen_Level',oxygenLevel);
                        newClinicalMForm.set('Blood_Pressure',bloodPressure);
                        newClinicalMForm.set('Heart_Rate',heartRate);
                        newClinicalMForm.set('Lung_Function',lungFunction);
                        newClinicalMForm.save().then(function(ss) {
                            var query = new Parse.Query(Appointment);
                            var appointmentID = getURLParameter("id");
                            if (appointmentID == null) appointmentID = "";
                            query.equalTo("objectId", appointmentID);
                            query.find({
                                success: function(results){
                                    // do stuff with appointment
                                    var appt = results[0];
                                    appt.set("Clinical_MForm_ID",ss);
                                    appt.save().then(function(ss) {
                                        // go back to course page
                                        location.reload();
                                        $('#CMFormSubmit').removeAttr('disabled');
                                    }, function(error) {
                                          alert("Error: " + error.code + " " + error.message);
                                        $('#CMFormSubmit').removeAttr('disabled');
                                    });
                                },
                                error: function(error){
                                    alert(error.message);
                                }
                            });
                        }, function(error) {
                            alert("Error: " + error.code + " " + error.message);
                            $('#CMFormSubmit').removeAttr('disabled');
                        });
                        
                    });
                }
                
            },
            error: function(error){
                alert(error.message);
            }
        });       
    }
    
    function savenotes() {
        $('#save-button').attr('disabled','disabled');
        var newNotesText = $('#editor').cleanHtml();
        var Appointment = Parse.Object.extend("Appointment");
        var Clincal_Details = Parse.Object.extend("Clincal_Details");
        var newClinicalDetails = new Clincal_Details();
        newClinicalDetails.set('Clinical_Notes',newNotesText);
        newClinicalDetails.save().then(function(ss) {
            var query = new Parse.Query(Appointment);
            var appointmentID = getURLParameter("id");
            if (appointmentID == null) appointmentID = "";
            query.equalTo("objectId", appointmentID);
            query.find({
                success: function(results){
                    // do stuff with appointment
                    var appt = results[0];
                    appt.set("Clinical_Detail_ID",ss);
                    appt.save().then(function(ss) {
                        // go back to course page
                        alert("saved!");
                        $('#save-button').removeAttr('disabled');
                    }, function(error) {
                          alert("Error: " + error.code + " " + error.message);
                        $('#save-button').removeAttr('disabled');
                    });
                },
                error: function(error){
                    alert(error.message);
                }
            });
        }, function(error) {
            alert("Error: " + error.code + " " + error.message);
            $('#save-button').removeAttr('disabled');
        });
    }
};

addLoadEvent(appointmentonload);