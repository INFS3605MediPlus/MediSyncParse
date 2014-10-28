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
                $('#patient-log').append("<table class='table table-bordered table-hover'><thead><tr><th>#</th><th>Appointment Date/Time</th><th>Creator</th><th>Date/Time Created</th><th>Appointment Cancelled?</th></tr></thead><tbody id='appt-log-results-table'></tbody></table></table>");
                
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
                        query.descending("createdAt");
                        query.find({
                            success: function(results){
                                for (var i=0; i < results.length; i++) {
                                    var appt = results[i];
                                    $("#appt-log-results-table").append("<tr><td>" + i + "</td><td><a class='appt-result' href='appointment.html?id=" + appt.id + "' data-toggle='tooltip' data-placement='right' title='See appointment details'>" + appt.get('Appointment_Date') + "</a></td><td>" + appt.get('Creator').get('Staff_First_Name') + ' ' + appt.get('Creator').get('Staff_Last_Name') + "</td><td>" + appt.createdAt + "</td><td>" + appt.get('isCancelled') + "</td></tr>");
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
                /*
                // patient-log append:
                <table class="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Appointment Date/Time</th>
                          <th>Creator</th>
                          <th>Date/Time Created</th>
                        </tr>
                      </thead>
                      <tbody id="appt-log-results-table">
                      </tbody>
                    </table>
                </table>
                */
            }
        });

    } else {
        // YOU ARE NOT LOGGED IN
        window.location.href = "index.html";
    }
    
    
    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
    }

    function searchSinglePatientParse(patientID) {        
        var Patient = Parse.Object.extend("Patient");  
        var query = new Parse.Query(Patient);
        query.equalTo("objectId", patientID);
        query.find({
            success: function(results){
                // do stuff with patient
                var pat = results[0];
                $('#patient-name').text(pat.get('First_Name') + ' ' + pat.get('Last_Name'));
                $('#patient-result').text(pat.get('First_Name') + ' ' + pat.get('Last_Name'));
                $('#number-result').text(pat.get('Contact_No'));
                $('#dob-result').text(pat.get('DOB'));
                $('#emerg-result').text(pat.get('Emergency_Contact_No'));
                $('#address-result').text(pat.get('Address'));
                $('#medi-result').text(pat.get('Medicare_No'));
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
        query.descending("createdAt");
        query.find({
            success: function(results){
                //var heartLungData = [['Day', 'Heart Rate', 'Lung Function']];
                //var heightWeightData = [['Day', 'Height', 'Weight']];
                var heartLungData = [];
                var heightWeightData = [];
                for (var i=0; i < results.length; i++) {
                    var appt = results[i];
                    if (appt.get("Clinical_Detail_ID")) {
                        var notes = appt.get("Clinical_Detail_ID").get("Clinical_Notes");
                    } else {
                        var notes = "";
                    }
                    var specialist = appt.get("Specialist_ID").get("Staff_First_Name") + ' ' + appt.get("Specialist_ID").get("Staff_Last_Name");
                    $("#appt-results-table").append("<tr><td>" + i + "</td><td><a class='appt-result' href='appointment.html?id=" + appt.id + "' data-toggle='tooltip' data-placement='right' title='See appointment details'>" + appt.get('Appointment_Date') + "</a></td><td>" + specialist + "</td><td>" + notes + "</td></tr>");
                    $('.appt-result').tooltip();
                    
                    if (appt.get("Clinical_MForm_ID")) {
                        var created = appt.get("Clinical_MForm_ID").createdAt;
                        var weight = appt.get("Clinical_MForm_ID").get("Weight");
                        var height = appt.get("Clinical_MForm_ID").get("Height");
                        var heartRate = appt.get("Clinical_MForm_ID").get("Heart_Rate");
                        var lungFunction = appt.get("Clinical_MForm_ID").get("Lung_Function");
                        heartLungData.push([created,heartRate,lungFunction]);
                        heightWeightData.push([created,height,weight]);
                    }
                }
                if(heartLungData.length != 0) {
                    loadGoogleChart(heartLungData, 'chart_div', 'Heart Rate and Lung Function Data', 'Heart Rate', 'Lung Function');
                }
                if(heightWeightData.length != 0) {
                    loadGoogleChart(heightWeightData, 'chart_div2', 'Height and Weight Data', 'Height', 'Weight');
                }
            },
            error: function(error){
                alert(error.message);
            }
        });
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
                            $("#appt-results-table").append("<tr><td>" + i + "</td><td><a class='appt-result' href='appointment.html?id=" + appt.id + "' data-toggle='tooltip' data-placement='right' title='See appointment details'>" + appt.get('Appointment_Date') + "</a></td><td>" + specialist + "</td><td>" + notes + "</td></tr>");
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