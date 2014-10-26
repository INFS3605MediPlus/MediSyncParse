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
            $('#save-button').removeClass('login-loading');
            document.getElementById('save-button').value = 'Save';
        });
    }
};

addLoadEvent(appointmentonload);