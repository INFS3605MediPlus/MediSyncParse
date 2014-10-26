var currentUser = Parse.User.current();

indexonload = function(){

    $("#home-link").addClass("active");
    
    if (currentUser) {
        // YOU ARE LOGGED IN
        $("#login-form").html("");
        $("#logo-image").attr('src','assets/welcomelogo.png');

        $('#calendar').fullCalendar({
            // put your options and callbacks here
            weekends: false
        });
        
        var Appointment = Parse.Object.extend("Appointment");
        var query = new Parse.Query(Appointment);
        // filter query for this particular user
        query.find({
            success: function(results){
                for (var i=0; i<results.length; i++){
                    var object = results[i];
                    
                    // put object into $('#calendar')
                }          
            },
            error: function(error){
                alert("No Calendar Entries Found");
            }
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

        pic = new Image();
        pic.src="http://www.fertllawn.com/image/loader.gif";
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