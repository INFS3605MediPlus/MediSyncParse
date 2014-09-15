var currentUser = Parse.User.current();

indexonload = function(){ 
    
    if (currentUser) {
        // YOU ARE LOGGED IN
        $("#login-form").html("<h1>Welcome to MediSync!<br>Your cloud based patient management system!</h1>");

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
};

addLoadEvent(indexonload);