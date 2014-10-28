var currentUser = Parse.User.current();

indexonload = function(){

    $("#home-link").addClass("active");
    
    if (currentUser) {
        // YOU ARE LOGGED IN
        $("#login-form").html("");
        $("#logo-image").attr('src','assets/welcomelogo.png');

        $('#calendar').fullCalendar({
            // put your options and callbacks here
            header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,basicWeek,basicDay'
			}, eventLimit: true, weekends: false
        });
        
        var query = (new Parse.Query(Parse.Role));
        query.equalTo("users", Parse.User.current());
        query.find().then(function(currentUsersRoles) {
            var currentUsersRole = currentUsersRoles[0].get('name');
            
            var Appointment = Parse.Object.extend("Appointment");
            var query = new Parse.Query(Appointment);
            // filter for this particular doctor!
            if (currentUsersRole == 'Specialist') {
                query.equalTo("Specialist_ID", currentUser);
            }
            query.equalTo("isCancelled", false);
            query.include("Patient_ID");
            query.find({
                success: function(results){
                    var source = [];
                    for (var i=0; i<results.length; i++){
                        var appt = results[i];
                        var patient = appt.get("Patient_ID");
                        event = new Object();
                        event.title = patient.get('First_Name') + ' ' + patient.get('Last_Name'); // this should be string
                        event.start = appt.get('Appointment_Date'); // this should be date object
                        event.end = appt.get('Appointment_Date');
                        event.url = 'appointment.html?id=' + appt.id;

                        // put object into $('#calendar')
                        source.push(event);
                    }
                    $('#calendar').fullCalendar( 'addEventSource', source )
                },
                error: function(error){
                    alert(error.message);
                }
            });
        });

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
        // change login text to http://www.fertllawn.com/image/loader.gif
        $('#log_in_button').addClass('login-loading');
        document.getElementById('log_in_button').value = '';

        var email = document.getElementById("username_input").value;
        var pw = document.getElementById("password_input").value;
        Parse.User.logIn(email, pw, {
          success: function(user) {
            // Do stuff after successful login.
            location.reload();
          },
          error: function(user, error) {
            // The login failed. Check error to see why.
            alert("Your credentials are incorrect!");
            $('#log_in_button').removeClass('login-loading');
            document.getElementById('log_in_button').value = 'Login';
          }
        });
    }
};

addLoadEvent(indexonload);