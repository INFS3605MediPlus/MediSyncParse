window.onload = function(){ 
    Parse.initialize("uMG2e5uKOVVE6hrAVbBSSRXuwGRa6BD1lcvN9tm3", "ubjYQ1u3UnPH6g1bk6ayIcNR6sj6MYO47qIxrdPR");
    
    var currentUser = Parse.User.current();
    if (currentUser) {
        // YOU ARE LOGGED IN
        $("#login-form").html("<h1>Welcome to MediSync!<br>Your cloud based patient management system!</h1>");
        // do stuff with the user

        $("#user-dropdown").html("<a href='#' data-toggle='dropdown' class='dropdown-toggle'>" + currentUser.get('Staff_First_Name') + " <b class='caret'></b></a><ul class='dropdown-menu'><li><a href='#'>Dropdown 1</a></li><li><a href='#'>Dropdown 2</a></li><li><a href='#' id='logoutButton'>Log Out</a></li></ul>");
        document.getElementById("logoutButton").onclick = logout;

        $("#patient-search-section").html("<h2 id='searchPatientHeading'>Search Patient</h2><p></p><form name='searchPatientForm'>First name: <input id='first_name_input' type='text' name='firstname'>Last name: <input id='last_name_input' type='text' name='lastname'><p></p><p id= 'searchPatientButton'><input id='search_patient_button' class='button' name='searchpatient' type='button' value='Search' /></p></form>");
        document.getElementById("search_patient_button").onclick = searchPatient;

         $("#patient-search-results-section").html("<h2 id='searchPatientHeading'>Search Results</h2><p></p><form name='patientResultsForm'>First name: <input id='searched_first_name' type='text' name='firstname'>Last name: <input id='searched_last_name' type='text' name='lastname'><p></p></form>");

        $('#calendar').fullCalendar({
            // put your options and callbacks here
            weekends: false
        })

    } else {
        // YOU ARE NOT LOGGED IN
        // show the signup or login page
        $("#login-form").html("<div class='login'><input id='username_input' type='text' placeholder='username' name='user'><br><input id='password_input' type='password' placeholder='password' name='password'><br><input id='log_in_button' type='button' value='Login'></div>");
        document.getElementById("log_in_button").onclick = login;

        $("#password_input").keyup(function(event){
            if(event.keyCode == 13){
                login();
            }
        });
        $("#username_input").keyup(function(event){
            if(event.keyCode == 13){
                login();
            }
        });
    }
     
    function login() {
        var email = document.getElementById("username_input").value;
        var pw = document.getElementById("password_input").value;
        Parse.User.logIn(email, pw, {
          success: function(user) {
            // Do stuff after successful login.
            location.reload();
            //window.location.href = "muthu.html"
          },
          error: function(user, error) {
            // The login failed. Check error to see why.
            alert("Your credentials are incorrect!");
          }
        });
    }
    
    function logout() {
        if (confirm('Are you sure you want to log out?')){
           Parse.User.logOut();
           location.reload();
           //window.location.href = "index.html"
        }
        return false;
    }

    function searchPatient() {        
        var Patient = Parse.Object.extend("Patient");  
        var query = new Parse.Query(Patient);
        var patientFirstName = document.forms["searchPatientForm"]["firstname"].value;
        var patientLastName = document.forms["searchPatientForm"]["lastname"].value;
        query.startsWith("First_Name", patientFirstName) && query.startsWith("Last_Name", patientLastName);         
        query.find({
            success: function(results){
                alert("Successfully retrieved " + results.length + " patients.");                
                for (var i=0; i<results.length; i++){
                    var object = results[i];
                    //alert(object.id + ' - ' + object.get('Last_Name'));                                                  
                }
                var searchedFirstName = document.getElementById("searched_first_name");
                var searchedLastName = document.getElementById("searched_last_name");            
                searchedFirstName.value = object.get('First_Name');
                searchedLastName.value = object.get('Last_Name');                
            },
            error: function(error){
                alert("No Patients Found");
            }
        });       
    }
};