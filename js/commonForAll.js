Parse.initialize("uMG2e5uKOVVE6hrAVbBSSRXuwGRa6BD1lcvN9tm3", "ubjYQ1u3UnPH6g1bk6ayIcNR6sj6MYO47qIxrdPR");
var currentUser = Parse.User.current();

commonFunction = function(){ 
    if (currentUser) {
        // YOU ARE LOGGED IN

        $("#user-dropdown").html("<a href='#' data-toggle='dropdown' class='dropdown-toggle'>" + currentUser.get('Staff_First_Name') + " <b class='caret'></b></a><ul class='dropdown-menu'><li><a href='#'>Dropdown 1</a></li><li><a href='#'>Dropdown 2</a></li><li><a href='#' id='logoutButton'>Log Out</a></li></ul>");
        document.getElementById("logoutButton").onclick = logout;

        $("#patient-search-section").html("<h2 id='searchPatientHeading'>Search Patient</h2><p></p><form name='searchPatientForm'>First name: <input id='first_name_input' type='text' name='firstname'>Last name: <input id='last_name_input' type='text' name='lastname'><p></p><p id= 'searchPatientButton'><button id='search_patient_button' class='button' name='searchpatient' type='button'>Search <span class='glyphicon glyphicon-search'></span></button></p></form>");
        document.getElementById("search_patient_button").onclick = searchPatient;

        $("#home-link").after("<li id='search-link'><a href='search.html'>Search Patient</a></li><li id='im-link'><a href='instantmessage.html'>Instant Messaging</a></li><li id='link4'><a href='#'>Link 4</a></li>");

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
    
    function searchPatient() {
        var patientFirstName = document.forms["searchPatientForm"]["firstname"].value;
        var patientLastName = document.forms["searchPatientForm"]["lastname"].value;
        window.location.href = "search.html?firstName=" + patientFirstName + "&lastName=" + patientLastName;       
    }
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