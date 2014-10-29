var currentUser = Parse.User.current();

appointmentonload = function(){ 

    if (currentUser) {
        // YOU ARE LOGGED IN
        var appointmentID = getURLParameter("id");
        if (appointmentID == null) appointmentID = "";
        
        searchSingleAppointmentParse(appointmentID);
        
        getDocumentsForAppointment(appointmentID);
        
        document.getElementById("save-button").onclick = savenotes;
        document.getElementById("done-button").onclick = donenotes;
        $("#document-filter-submit").click(
          function(event) {
            event.preventDefault();
            $("#documents-results-table").html('');
            getDocumentsForAppointment(appointmentID);
          }
        );
        $("#new-file-submit").click(
          function(event) {
            event.preventDefault();
            var fileName = $("#inputFileName").val();
            var fileType = $("#inputFileType").val();
            if ((fileName == "") || (fileName == null)) {
                alert('Please give the file a useful name');
            } else {
                var fileUploadControl = $("#inputFile")[0];
                if (fileUploadControl.files.length > 0) {
                    $('#new-file-submit').attr('disabled','disabled');
                    var file = fileUploadControl.files[0];
                    var parseFile = new Parse.File(fileName, file);
                    parseFile.save().then(function() {
                        // The file has been saved to Parse.
                        var Appointment = Parse.Object.extend("Appointment");
                        var query = new Parse.Query(Appointment);
                        query.equalTo("objectId", appointmentID);
                        query.find({
                            success: function(results){
                                // do stuff with appointment
                                var Document = Parse.Object.extend("Document");
                                var newDocument = new Document();
                                newDocument.set('Document_File',parseFile);
                                newDocument.set('Document_Name',fileName);
                                newDocument.set('Document_Type',fileType);
                                newDocument.set('Appointment_ID',results[0]);
                                newDocument.save().then(function(ss) {
                                    alert('File saved!');
                                    $('#new-file-submit').removeAttr('disabled');
                                    $("#documents-results-table").html('');
                                    getDocumentsForAppointment(appointmentID);
                                }, function(error) {
                                    alert("Error: " + error.code + " " + error.message);
                                    $('#new-file-submit').removeAttr('disabled');
                                });
                            },
                            error: function(error){
                                alert(error.message);
                                $('#new-file-submit').removeAttr('disabled');
                            }
                        });
                    }, function(error) {
                        alert("Error: " + error.code + " " + error.message);
                        $('#new-file-submit').removeAttr('disabled');
                    });
                    
                } else {
                    alert('No file found');
                }
            }
          }
        );
        
        // get tests for tests tab
        var Appointment_Tests = Parse.Object.extend("Appointment_Tests");
        var Appointment = Parse.Object.extend("Appointment");
        var query = new Parse.Query(Appointment_Tests);
        var apptpointer = new Appointment();
        apptpointer.id = appointmentID;
        query.equalTo("Appointment_ID", apptpointer);
        query.include("Test_ID");
        query.find({
            success: function(results){
                if (results.length == 0) {
                    // show tests form
                    var Test = Parse.Object.extend("Test");
                    var query = new Parse.Query(Test);
                    query.find({
                        success: function(results){
                            for (var i=0; i < results.length; i++) {
                                var testToAdd = results[i];
                                $('#tests-form').append("<div class='checkbox'><label><input type='checkbox' value='" + testToAdd.id + "'> " + testToAdd.get('Test_Type') + "</label></div>");
                            }
                            $('#tests-form').append("<button type='submit' class='btn btn-default' id='submit-tests-form'><span class='glyphicon glyphicon-floppy-disk'></span> Submit</button>");
                            $("#submit-tests-form").click(
                              function(event) {
                                  event.preventDefault();
                                  submittests(appointmentID); //submittests should reload the page
                              }
                            );
                        },
                        error: function(error){
                            alert(error.message);
                        }
                    });
                } else {
                    // show all tests included
                    $('#tests-form').after("<div id='testsPerformed'><h4>The following tests were performed:</h4></div>");
                    for (var i=0; i < results.length; i++) {
                        var testToAdd = results[i];
                        var testAssociated = testToAdd.get("Test_ID");
                        $('#testsPerformed').append("<p><span class='glyphicon glyphicon-ok'></span> " + testAssociated.get('Test_Type') + "</p>");
                    }
                }
            },
            error: function(error){
                alert(error.message);
            }
        });
        
        
    } else {
        // YOU ARE NOT LOGGED IN
        window.location.href = "index.html";
    }
    
    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
    }
    
    function submittests(appointmentID) {
        $("#submit-tests-form").attr('disabled','disabled');
        var Appointment_Tests = Parse.Object.extend("Appointment_Tests");
        var Appointment = Parse.Object.extend("Appointment");
        var Test = Parse.Object.extend("Test");
        var form = document.getElementById('tests-form');
        
        // count number of checked elements
        var count = 0;
        for (var i = 0; i < form.elements.length; i++ ) {
            if (form.elements[i].type == 'checkbox') {
                if (form.elements[i].checked == true) {
                    count++;
                }
            }
        }
        var currentCheckedElement = 0;
        for (var i = 0; i < form.elements.length; i++ ) {
            if (form.elements[i].type == 'checkbox') {
                if (form.elements[i].checked == true) {
                    var apptpointer = new Appointment();
                    apptpointer.id = appointmentID;
                    var testpointer = new Test();
                    testpointer.id = form.elements[i].value;
                    var newApptTest = new Appointment_Tests();
                    newApptTest.set("Appointment_ID",apptpointer);
                    newApptTest.set("Test_ID",testpointer);
                    newApptTest.save(null, {
                      success: function(apptTest) {
                          currentCheckedElement++;
                          if (currentCheckedElement == count) {
                              alert('Tests saved!');
                              location.reload();
                          }
                      },
                      error: function(apptTest, error) {
                        alert('Failed to create new object, with error code: ' + error.message);
                          $('#submit-tests-form').removeAttr('disabled');
                      }
                    });
                }
            }
        }
    }

    function searchSingleAppointmentParse(appointmentID) {        
        var Appointment = Parse.Object.extend("Appointment");  
        var query = new Parse.Query(Appointment);
        query.equalTo("objectId", appointmentID);
        query.include("Patient_ID");
        query.include("Specialist_ID");
        query.include("Clinical_Detail_ID");
        query.include("Clinical_MForm_ID");
        query.find({
            success: function(results){
                // do stuff with appointment
                var appt = results[0];
                var patient = appt.get("Patient_ID");
                var specialist = appt.get("Specialist_ID");
                var clinicalDetails = appt.get("Clinical_Detail_ID");
                $('#patient-name').html("Appointment for: <a href='patient.html?patientID=" + patient.id + "'>" + patient.get('First_Name') + ' ' + patient.get('Last_Name') + "</a> with Dr. " + specialist.get('Staff_First_Name') + ' ' + specialist.get('Staff_Last_Name'));
                $('#apptdate-result').text(appt.get('Appointment_Date'));
                if (!appt.get("isCancelled")) {
                    $('#apptdate-result').append("<button type='button' class='btn btn-warning' id='cancel-appt-button'>Cancel Appointment</button>");
                    $("#cancel-appt-button").click(
                      function(event) {
                        event.preventDefault();
                          if (confirm('Are you sure you want to cancel this appointment?')){
                           cancelAppointment(patient.id);
                        }
                        return false;
                      }
                    );
                } else {
                    $('#apptdate-result').append("<h3>Appointment has been cancelled</h3>");
                    $("#upload-new-document").html('');
                }
                
                if (clinicalDetails != null) {
                    $('#red').html("<h1>Notes</h1><div id='editor'>&hellip;</div>");
                    var notes = clinicalDetails.get('Clinical_Notes');
                    $('#editor').html(notes);
                } else if (appt.get("isCancelled")) {
                    $('#red').html("<h1>Notes</h1><div id='editor'>No notes were taken</div>");
                } else {
                    $('#editor').wysiwyg();
                    $('#editor').html("Please enter your new notes here");
                }
                
                
                var CMForm = appt.get("Clinical_MForm_ID");
                if ((CMForm != null) || appt.get("isCancelled")) {
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
    
    function getDocumentsForAppointment(appointmentID) {
        var Appointment = Parse.Object.extend("Appointment");  
        var query = new Parse.Query(Appointment);
        var docStart = $('#inputSearchCriteria').val();
        var docType = $('#inputTypeOfDocument').val();
        query.equalTo("objectId", appointmentID);
        query.find({
            success: function(results){
                // do stuff with appointment
                var appt = results[0];
                var Document = Parse.Object.extend("Document");  
                var query = new Parse.Query(Document);
                query.equalTo("Appointment_ID", appt);
                if (docType != "All") {
                    query.equalTo("Document_Type", docType);
                }
                query.startsWith("Document_Name", docStart);
                query.descending("createdAt");
                query.find({
                    success: function(results){
                        // do stuff with appointment
                        for (var i=0; i < results.length; i++) {
                            var doc = results[i];
                            $("#documents-results-table").append("<tr><td>" + i + "</td><td>" + doc.get('Document_Name') + "</td><td><span class='glyphicon glyphicon-download'></span><a target='_blank' href='" + doc.get('Document_File').url() + "'>Click to download file</a></td><td>" + doc.get('Document_Type') + "</td><td>" + doc.createdAt + "</td></tr>");
                        }
                    },
                    error: function(error){
                        alert(error.message);
                    }
                });
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
    
    function cancelAppointment(patientid) {
        $('#cancel-appt-button').attr('disabled','disabled');
        var Appointment = Parse.Object.extend("Appointment");
        var query = new Parse.Query(Appointment);
        var appointmentID = getURLParameter("id");
        if (appointmentID == null) appointmentID = "";
        query.equalTo("objectId", appointmentID);
        query.find({
            success: function(results){
                // do stuff with appointment
                var appt = results[0];
                appt.set("isCancelled",true);
                appt.set("whoCancelled",currentUser);
                appt.set("cancelledDate",new Date());
                appt.save().then(function(ss) {
                    // go back to course page
                    alert("Appointment cancelled!");
                    window.location.href = "patient.html?patientID=" + patientid;
                }, function(error) {
                    alert("Error: " + error.code + " " + error.message);
                    $('#cancel-appt-button').removeAttr('disabled');
                });
            },
            error: function(error){
                alert(error.message);
            }
        });
    }
    
    function donenotes() {
        window.location.reload();
    }
};

addLoadEvent(appointmentonload);