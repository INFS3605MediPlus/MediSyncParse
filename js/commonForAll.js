Parse.initialize("uMG2e5uKOVVE6hrAVbBSSRXuwGRa6BD1lcvN9tm3", "ubjYQ1u3UnPH6g1bk6ayIcNR6sj6MYO47qIxrdPR");
var currentUser = Parse.User.current();

commonFunction = function(){ 
    if (currentUser) {
        // YOU ARE LOGGED IN

        $("#user-dropdown").html("<a href='#' data-toggle='dropdown' class='dropdown-toggle'><span class='glyphicon glyphicon-user'></span> " + currentUser.get('Staff_First_Name') + " <b class='caret'></b></a><ul class='dropdown-menu'><li><a href='#'>Dropdown 1</a></li><li><a href='#'>Dropdown 2</a></li><li><a href='#' id='logoutButton'>Log Out</a></li></ul>");
        document.getElementById("logoutButton").onclick = logout;

        $("#patient-search-section").html("<form id='searchForm' class='form-wrapper cf'><input id='searchText' type='text' placeholder='Search Patient by First name, Last name or Medicare No...' required><button type='submit' id='search_patient_button' data-toggle='tooltip' data-placement='bottom' title='Search'>Search</button><img id='add_patient_icon' src='assets/add_patient_icon.png' onclick ='div_show()' class='add-icons' data-toggle='tooltip' data-placement='bottom' title='Add patient!'/><img id='add_user_icon' src='assets/add_new_user_icon.png' onclick ='user_show()' class='add-icons' data-toggle='tooltip' data-placement='bottom' title='Add user!'/><img id='add_appointment_icon' src='assets/add_appointment.png' onclick ='appointment_show()' class='add-icons' data-toggle='tooltip' data-placement='bottom' title='Add appointment!'/></form>");
        $('.add-icons').tooltip();
        
        $("#search_patient_button").click(function(event) {
            event.preventDefault(); // cancel default behavior

            var q = document.forms["searchForm"]["searchText"].value;
            window.location.href = "search.html?q=" + q;
        });
        $('#searchText').keypress(function(event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                var q = document.forms["searchForm"]["searchText"].value;
                window.location.href = "search.html?q=" + q;
            }
        });
        
        $('#search_patient_button').tooltip();
        
        $('body').waypoint(function(direction) {
          if (direction == 'down') {
            $('#cssmenu').addClass('sticky');
          } else {
            // direction is down
            $('#cssmenu').removeClass('sticky');
          }
        }, { offset: -5 });

        $("#home-link").after("<li id='search-link'><a href='search.html' class='header-link' data-toggle='tooltip' data-placement='bottom' title='Patient Details!'><span class='glyphicon glyphicon-list-alt'></span> Patients</a></li><li id='im-link'><a href='instantmessage.html' class='header-link' data-toggle='tooltip' data-placement='bottom' title='Instant Messaging!'><span class='glyphicon glyphicon-comment'></span> IM</a></li>");
        $('.header-link').tooltip();
        
        $("body").append("<div id='add-forms' onclick = 'checktest(event)'><div id='patientform'><div id ='popupAddPatient'><form action='#' class='addPatientForm' > <img src='assets/3.png' id='closeButtonPatient'/> <h2>Add new Patient</h2><hr/> <label for='labelFirstName'>First Name:</label> <input type='text' name='firstNameOfPatient' id='firstNameOfPatient'> <br><label for='labelLastName'>Last Name:</label> <input type='text' name='lastNameOfPatient' id='lastNameOfPatient'> <br><label for='labelEmail'>Email:</label> <input type='text' name='emailOfPatient' id='emailOfPatient'> <br> <label for='labelAddress'>Address:</label> <input type='text' placeholder='No. | Street | Suburb | State | Postcode'required name='addressOfPatient' id='addressOfPatient'/> <br> <label for='labelGender'>Gender:</label> <input type='radio' name='genderOfPatient' id='m' value='Male'>Male <input type='radio' name='genderOfPatient' id='f' value='Female'>Female <br> <label for='labelDOB'>DOB:</label> <input type='date' name='DOBOfPatient' id='DOBOfPatient'/> <br> <label for='labelContact'>Contact No:</label> <input type='text' name='contactNoOfPatient' id='contactNoOfPatient'/> <br> <label for='labelOccupation'>Occupation:</label> <input type='text' name='occupationOfPatient' id='occupationOfPatient'/> <br> <label for='labelMedicareNo'>Medicare No:</label> <input type='number' name='medicareNoOfPatient' id='medicareNoOfPatient'/> <br> <label for='labelHealthCareNo'>Health Care No:</label> <input type='number' name='healthCareNoOfPatient' id='healthCareNoOfPatient'/> <br> <label for='labelEmergencyName'>Emergency Contact Name:</label> <input type='text' name='nameOfEmergencyContact' id='nameOfEmergencyContact'> <br> <br> <label for='labelEmergencyContactNo'>Emergency Contact No:</label> <input type='text' name='contactNoOFEmergencyContact' id='contactNoOfEmergencyContact'/> <br> <button id = 'createNewPatientButton' class='createNewButton' type='button' onclick ='createNewPatientIntoParse()'>Add</button> </form></div></div><div id='userform'><div id ='popupAddPatient'><form action='#' class='addPatientForm' > <img src='assets/3.png' id='closeButtonUser'/> <h2>Add new User</h2><hr/> <label for='labelFirstName'>First Name:</label> <input type='text' name='firstNameOfUser' id='firstNameOfUser'> <br><label for='labelLastName'>Last Name:</label> <input type='text' name='lastNameOfUser' id='lastNameOfUser'> <br><label for='labelEmail'>Email:</label> <input type='text' name='emailOfUser' id='emailOfUser'> <br> <label for='labelEmail'>Confirm Email:</label> <input type='text' name='emailConfirmedOfUser' id='emailConfirmedOfUser'> <br> <label for='labelDOB'>DOB:</label> <input type='date' name='DOBOfUser' id='DOBOfUser'/> <br> <label for='labelContact'>Contact No:</label> <input type='text' name='contactNoOfUser' id='contactNoOfUser'/> <br> <label for='labelUserRole'>Role:</label> <select id='roleDropdown'><option value='Select'>Select</option><option value='Administrator'>Administrator</option><option value='Specialist'>Specialist</option><option value='Nurse'>Nurse</option><option value='Receptionist'>Receptionist</option></select> <br> <label for='labelUserPassword'>Password:</label> <input type='password' name='passwordOfUser' id='passwordOfUser'/> <br> <label for='labelUserPassword'>Confirm Password:</label> <input type='password' name='passwordConfirmedOfUser' id='passwordConfirmedOfUser'/> <br> <button id = 'createNewUserButton' class='createNewButton' type='button' onclick ='createNewUserIntoParse()'>Add</button> </form></div></div><div id ='docform'><div id ='popupAddPatient'><form action='#' class='addPatientForm'> <img src='assets/3.png' id='closeButtonDoc'/> <h2>Add new Document</h2><hr/> <label for='labelDocType'>Document Type:</label> <select id='docDropdown'><option value='Select'>Select</option><option value='Invoice'>Invoice</option><option value='Referal GP Letter'>Referal GP Letter</option><option value='Test Results'>Test Results</option></select> <br> <label for='labelDocDesc'>Document Description:</label> <input type='text' name='docDesc' id='docDesc'/> <br> <input type='file' name='docFile' id='docFile'/> <br> <button id = 'createNewDocButton' class='createNewButton' type='button' onclick ='createNewDocIntoParse()'>Add</button> </form></div></div><div id='appointmentform'><div id ='popupAddPatient'><form action='#' class='addPatientForm'> <img src='assets/3.png' id='closeButtonAppointment'/> <h2>Add new Appointment</h2><hr/> <label for='labelApptPatient'>Patient:</label> <input type='text' name='apptPatient' id='apptPatient' class='typeahead'> <br> <label for='labelApptDate'>Appointment Date:</label> <input type='date' name='apptDate' id='apptDate'/> <br> <label for='labelApptTime'>Appointment Time:</label> <input type='time' name='apptTime' id='apptTime'/> <br> <button id = 'createNewAppointmentButton' class='createNewButton' type='button' onclick ='createNewAppointmentIntoParse()'>Create</button> </form></div></div></div>");

        var Patient = Parse.Object.extend("Patient");
            var query = new Parse.Query(Patient);
            query.find({
            success: function(results) {
                var patients = [];
                for (var i=0; i<results.length; i++){
                    var patient = results[i];
                    patients.push(patient.get('First_Name') + ' ' + patient.get('Last_Name') + ' - ' + patient.get('Medicare_No'));
                }
                
                $('#apptPatient').typeahead({
                  hint: true,
                  highlight: true,
                  minLength: 1
                },
                {
                  name: 'patients',
                  displayKey: 'value',
                  source: substringMatcher(patients)
                });
            },
            error: function(error) {
              alert("Error: " + error.code + " " + error.message);
            }
          });

    } else {
        // YOU ARE NOT LOGGED IN
        // show the signup or login page
        var exists = new RegExp("index.html$").test(window.location.href);
        if (!exists) window.location.href = "index.html";
    }
    
    function logout() {
        if (confirm('Are you sure you want to log out?')){
           Parse.User.logOut();
           window.location.href = "index.html";
        }
        return false;
    }
    
    pic = new Image();
    pic.src="http://www.fertllawn.com/image/loader.gif";
};

//function to check for close of forms
function checktest(e){ 
    var target = (e && e.target) || (event && event.srcElement); 

    var appointmentform = document.getElementById('appointmentform');
    var patientform = document.getElementById('patientform');
    var userform = document.getElementById('userform');
    var docform = document.getElementById('docform');
    var closeAppointment = document.getElementById('closeButtonAppointment');
    var closePatient = document.getElementById('closeButtonPatient');
    var closeDoc = document.getElementById('closeButtonDoc');
    var closeUser = document.getElementById('closeButtonUser');
    

    target==closeAppointment?appointmentform.style.display='none':null;
    target==closePatient?patientform.style.display='none':null;
    target==closeDoc?docform.style.display='none':null;
    target==closeUser?userform.style.display='none':null;
    

}

function capitaliseFirstLetter(string)
{
    if (string != null) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
        return "";
    }
}

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substrRegex;
 
    // an array that will be populated with substring matches
    matches = [];
 
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
 
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        // the typeahead jQuery plugin expects suggestions to a
        // JavaScript object, refer to typeahead docs for more info
        matches.push({ value: str });
      }
    });
 
    cb(matches);
  };
};

function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
};

addLoadEvent(commonFunction);