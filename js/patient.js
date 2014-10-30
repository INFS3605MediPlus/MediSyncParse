var currentUser = Parse.User.current();

patientonload = function(){ 

    if (currentUser) {
        // YOU ARE LOGGED IN
        var patientID = getURLParameter("patientID");
        if (patientID == null) patientID = "";
        $('input[name="daterange"]').daterangepicker();
        $('#searchDate').on('apply.daterangepicker', function(ev, picker) {
          refreshApptDetailsTable(picker.startDate.toDate(), picker.endDate.toDate(), patientID);
        });
        searchSinglePatientParse(patientID);
        
        $('#search_patient_button').after("<img id='add_appointment_icon' src='assets/add_appointment.png' onclick ='appointment_show()' class='add-icons' data-toggle='tooltip' data-placement='bottom' title='Add appointment!'/></form>");
        $('.add-icons').tooltip();
        
        var query = (new Parse.Query(Parse.Role));
        query.equalTo("name", "Administrator");
        query.equalTo("users", Parse.User.current());
        query.first().then(function(adminRole) {
            if (adminRole) {
                $('.tab-content').append("<div class='tab-pane' id='patient-log'><h1>Patient Log</h1></div>");
                $('#tablist').append("<li><a data-toggle='tab' href='#patient-log'><span class='glyphicon glyphicon-folder-open'></span> Patient Log</a></li>");
                $('#patient-log').append("<p id='patient-time'>Time patient file was created: </p>");
                $('#patient-log').append("<table class='table table-bordered table-hover'><thead><tr><th>#</th><th>Appointment Date/Time</th><th>Executor</th><th>Date/Time Created</th><th>Action Performed</th></tr></thead><tbody id='appt-log-results-table'></tbody></table></table>");
                
                var Patient = Parse.Object.extend("Patient");  
                var query = new Parse.Query(Patient);
                query.equalTo("objectId", patientID);
                query.find({
                    success: function(results){
                        // do stuff with patient
                        var pat = results[0];
                        $('#patient-time').append(pat.createdAt);
                        
                        var Appointment = Parse.Object.extend("Appointment");  
                        var query = new Parse.Query(Appointment);
                        query.equalTo("Patient_ID", pat);
                        query.include("Creator");
                        query.include("whoCancelled");
                        query.descending("updatedAt");
                        query.find({
                            success: function(results){
                                for (var i=0; i < results.length; i++) {
                                    var appt = results[i];
                                    if (appt.get('isCancelled')) {
                                        var executor = appt.get('whoCancelled');
                                        var actionTaken = "Appointment Cancelled";
                                        var apptDate = appt.get('Appointment_Date');
                                        $("#appt-log-results-table").append("<tr><td>" + i + "</td><td>" + apptDate + "</td><td>" + executor.get('Staff_First_Name') + ' ' + executor.get('Staff_Last_Name') + "</td><td>" + appt.createdAt + "</td><td>" + actionTaken + "</td></tr>");
                                    } else {
                                        var apptDate = "<a class='appt-result' href='appointment.html?id=" + appt.id + "' data-toggle='tooltip' data-placement='right' title='See appointment details'>" + appt.get('Appointment_Date') + "</a>";
                                    }
                                    var executor = appt.get('Creator');
                                    var actionTaken = "Appointment Created";
                                    $("#appt-log-results-table").append("<tr><td>" + i + "</td><td>" + apptDate + "</td><td>" + executor.get('Staff_First_Name') + ' ' + executor.get('Staff_Last_Name') + "</td><td>" + appt.createdAt + "</td><td>" + actionTaken + "</td></tr>");
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
                
                // add edit patient button
                $('#patient-name').append("<button type='button' class='btn btn-warning' id='edit-patient-button'>Edit Patient</button>");
                $("#edit-patient-button").click(
                  function(event) {
                    event.preventDefault();
                    var patientID = getURLParameter("patientID");
                    if (patientID == null) patientID = "";
                    window.location.href = "editpatient.html?patientID=" + patientID;
                  }
                );
            }
        });
        
        
        var query = (new Parse.Query(Parse.Role));
        query.equalTo("name", "Receptionist");
        query.equalTo("users", Parse.User.current());
        query.first().then(function(receptionistRole) {
            if (receptionistRole) {
                // add edit patient button
                $('#patient-name').append("<button type='button' class='btn btn-warning' id='edit-patient-button'>Edit Patient</button>");
                $("#edit-patient-button").click(
                  function(event) {
                    event.preventDefault();
                    var patientID = getURLParameter("patientID");
                    if (patientID == null) patientID = "";
                    window.location.href = "editpatient.html?patientID=" + patientID;
                  }
                );
            }
        });

    } else {
        // YOU ARE NOT LOGGED IN
        window.location.href = "index.html";
    }

    function searchSinglePatientParse(patientID) {        
        var Patient = Parse.Object.extend("Patient");  
        var query = new Parse.Query(Patient);
        query.equalTo("objectId", patientID);
        query.find({
            success: function(results){
                // do stuff with patient
                var pat = results[0];
                if (pat == null) alert('Careful with your patientID!');
                $('#patient-name').prepend(pat.get('First_Name') + ' ' + pat.get('Last_Name') + '  ');
                $('#patient-result').text(pat.get('First_Name') + ' ' + pat.get('Last_Name'));
                $('#number-result').text(pat.get('Contact_No'));
                $('#dob-result').text(pat.get('DOB'));
                $('#emerg-result').text(pat.get('Emergency_Contact_No'));
                $('#address-result').text(pat.get('Address'));
                $('#medi-result').text(pat.get('Medicare_No'));
                $('#gp-name-result').text(pat.get('GP_Referral_Name'));
                $('#gp-letter-result').html("<span class='glyphicon glyphicon-download'></span><a target='_blank' href='" + pat.get('GP_Referral_Letter').url() + "'>Click to download file</a>");
                getAppointmentDetailsForPatient(pat);
            },
            error: function(error){
                alert(error.message);
            }
        });
    }
    
    function getAppointmentDetailsForPatient(patient) {
        var Appointment = Parse.Object.extend("Appointment");  
        var query = new Parse.Query(Appointment);
        query.equalTo("Patient_ID", patient);
        query.include("Specialist_ID");
        query.include("Clinical_Detail_ID");
        query.include("Clinical_MForm_ID");
        query.include("Appointment_Type");
        query.descending("Appointment_Date");
        query.find({
            success: function(results){
                var heartLungData = [];
                var heightWeightData = [];
                var unpaidAppointments = [];
                for (var i=0; i < results.length; i++) {
                    var appt = results[i];
                    if (appt.get("Clinical_Detail_ID")) {
                        var notes = appt.get("Clinical_Detail_ID").get("Clinical_Notes");
                    } else {
                        var notes = "";
                    }
                    var specialist = appt.get("Specialist_ID").get("Staff_First_Name") + ' ' + appt.get("Specialist_ID").get("Staff_Last_Name");
                    var typeOfAppointment = appt.get("Appointment_Type").get('Appointment_Type');
                    $("#appt-results-table").append("<tr><td>" + i + "</td><td><a class='appt-result' href='appointment.html?id=" + appt.id + "' data-toggle='tooltip' data-placement='right' title='See appointment details'>" + appt.get('Appointment_Date') + "</a></td><td>" + typeOfAppointment + "</td><td>" + specialist + "</td><td>" + notes + "</td></tr>");
                    $('.appt-result').tooltip();
                    
                    if (appt.get("Clinical_MForm_ID")) {
                        var created = appt.get("Clinical_MForm_ID").updatedAt;
                        var weight = appt.get("Clinical_MForm_ID").get("Weight");
                        var height = appt.get("Clinical_MForm_ID").get("Height");
                        var heartRate = appt.get("Clinical_MForm_ID").get("Heart_Rate");
                        var lungFunction = appt.get("Clinical_MForm_ID").get("Lung_Function");
                        heartLungData.push([created,heartRate,lungFunction]);
                        heightWeightData.push([created,height,weight]);
                    }
                    
                    // add payment data
                    if (!appt.get("Paid") && (appt.get("Appointment_Date") < new Date())) {
                        unpaidAppointments.push(appt);
                    }
                }
                if(heartLungData.length != 0) {
                    loadGoogleChart(heartLungData, 'chart_div', 'Heart Rate and Lung Function Data', 'Heart Rate', 'Lung Function');
                }
                if(heightWeightData.length != 0) {
                    loadGoogleChart(heightWeightData, 'chart_div2', 'Height and Weight Data', 'Height', 'Weight');
                }
                updatePaymentResults(unpaidAppointments);
            },
            error: function(error){
                alert(error.message);
            }
        });
    }
    
    function updatePaymentResults(unpaidAppointments) {
        if (unpaidAppointments.length == 0) {
            $('#yellow').html("<h1>Payment and Billing Section</h1>All appointments have been paid for!");
        } else {
            for (var i=0; i < unpaidAppointments.length; i++) {
                appointmentID = unpaidAppointments[i].id;
                $('#payment-appointment-info').append("<div class='checkbox'><label><input class='payment-appt-checkbox' type='checkbox' value='" + appointmentID + "'>Appointment on: " + unpaidAppointments[i].get('Appointment_Date') + " | Amount Due in $AUD: <input class='form-control' id='" + appointmentID + "' type='text' disabled></label></div>");
                amountDue = unpaidAppointments[i].get("Appointment_Type").get("Cost");
                // search for appointment tests and add their cost onto amountDue
                
                (function(amountDue, appointmentID) {
                    var Appointment_Tests = Parse.Object.extend("Appointment_Tests");  
                    var query = new Parse.Query(Appointment_Tests);
                    query.equalTo("Appointment_ID", unpaidAppointments[i]);
                    query.include("Test_ID");
                    query.find({
                        success: function(results){
                            // do stuff with patient
                            for (var i=0; i < results.length; i++) {
                                amountDue = amountDue + results[i].get("Test_ID").get("Test_Cost");
                            }
                            $("#" + appointmentID).val(amountDue);
                        },
                        error: function(error){
                            alert(error.message);
                        }
                    });
                })(amountDue, appointmentID);
            }
        }
        // on click of a checkbox, append a value to #disabledCostInput
        $('.payment-appt-checkbox').click(function() {
            if ($(this).prop('checked')) {
                var valueToAdd = parseInt($("#" + $(this).val()).val());
                $('#disabledCostInput').val(parseInt($('#disabledCostInput').val()) + valueToAdd);
            } else {
                var valueToAdd = parseInt($("#" + $(this).val()).val());
                $('#disabledCostInput').val(parseInt($('#disabledCostInput').val()) - valueToAdd);
            }
        });
        
        $("#record-payment").click(function(event) {
            event.preventDefault();
            $("#record-payment").attr('disabled','disabled');
            var Appointment_Tests = Parse.Object.extend("Appointment_Tests");
            var Appointment = Parse.Object.extend("Appointment");
            var Test = Parse.Object.extend("Test");
            var form = document.getElementById('payment-appointment-info');

            // count number of checked elements
            var count = 0;
            for (var i = 0; i < form.elements.length; i++ ) {
                if (form.elements[i].type == 'checkbox') {
                    if (form.elements[i].checked == true) {
                        count++;
                    }
                }
            }
            if (count == 0) alert("No appointments selected");
            var currentCheckedElement = 0;
            for (var i = 0; i < form.elements.length; i++ ) {
                if (form.elements[i].type == 'checkbox') {
                    if (form.elements[i].checked == true) {
                        apptID = form.elements[i].value;
                        var paymentType = $('#payment-type-select').val();
                        var query = new Parse.Query(Appointment);
                        query.get(apptID, {
                          success: function(appt) {
                                appt.set("Paid",true);
                                appt.set("Payment_Date",new Date());
                                appt.set("Payment_Type",paymentType);
                                appt.save(null, {
                                  success: function(apptTest) {
                                      currentCheckedElement++;
                                      if (currentCheckedElement == count) {
                                          alert('Payments saved!');
                                          location.reload();
                                      }
                                  },
                                  error: function(apptTest, error) {
                                    alert('Failed to create new object, with error code: ' + error.message);
                                      $('#record-payment').removeAttr('disabled');
                                  }
                                });
                          },
                          error: function(object, error) {
                              alert('Failed to create new object, with error code: ' + error.message);
                              $('#record-payment').removeAttr('disabled');
                          }
                        });
                    }
                }
            }
              $('#record-payment').removeAttr('disabled');
          }
        );
    }
    
    function refreshApptDetailsTable(startDate, endDate, patientID) {
        $("#appt-results-table").html('');
        
        var Patient = Parse.Object.extend("Patient");  
        var query = new Parse.Query(Patient);
        query.equalTo("objectId", patientID);
        query.find({
            success: function(results){
                // do stuff with patient
                var pat = results[0];
                var Appointment = Parse.Object.extend("Appointment");  
                var query = new Parse.Query(Appointment);
                query.equalTo("Patient_ID", pat);
                query.greaterThan("Appointment_Date",startDate);
                query.lessThan("Appointment_Date",endDate);
                query.include("Specialist_ID");
                query.include("Clinical_Detail_ID");
                query.include("Appointment_Type");
                query.descending("Appointment_Date");
                query.find({
                    success: function(results){
                        for (var i=0; i < results.length; i++) {
                            var appt = results[i];
                            if (appt.get("Clinical_Detail_ID")) {
                                var notes = appt.get("Clinical_Detail_ID").get("Clinical_Notes");
                            } else {
                                var notes = "";
                            }
                            var specialist = appt.get("Specialist_ID").get("Staff_First_Name") + ' ' + appt.get("Specialist_ID").get("Staff_Last_Name");
                            var typeOfAppointment = appt.get("Appointment_Type").get('Appointment_Type');
                            $("#appt-results-table").append("<tr><td>" + i + "</td><td><a class='appt-result' href='appointment.html?id=" + appt.id + "' data-toggle='tooltip' data-placement='right' title='See appointment details'>" + appt.get('Appointment_Date') + "</a></td><td>" + typeOfAppointment + "</td><td>" + specialist + "</td><td>" + notes + "</td></tr>");
                            $('.appt-result').tooltip();
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
    
    function loadGoogleChart(dataFromParse, divID, titleForChart, column1, column2) {
        //var data = google.visualization.arrayToDataTable(dataFromParse);
        
        var data3 = new google.visualization.DataTable();
        data3.addColumn('date','Day');
        data3.addColumn('number',column1);
        data3.addColumn('number',column2);
        data3.addRows(dataFromParse);

        var options = {
            title: titleForChart,
            width: (document.getElementById("red").offsetWidth*49/100),
            curveType: 'function',
            legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById(divID));
        chart.draw(data3, options);
    }
};

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

addLoadEvent(patientonload);