window.onload = function(){ 
    Parse.initialize("uMG2e5uKOVVE6hrAVbBSSRXuwGRa6BD1lcvN9tm3", "ubjYQ1u3UnPH6g1bk6ayIcNR6sj6MYO47qIxrdPR");
    
    var currentUser = Parse.User.current();
    if (currentUser) {
        // YOU ARE LOGGED IN
        $("#login-form").html("<h1>Welcome to MediSync!<br>Your cloud based patient management system!</h1>");
        // do stuff with the user

        $("#user-dropdown").html("<a href='#' data-toggle='dropdown' class='dropdown-toggle'>" + currentUser.get('Staff_First_Name') + " <b class='caret'></b></a><ul class='dropdown-menu'><li><a href='#'>Dropdown 1</a></li><li><a href='#'>Dropdown 2</a></li><li><a href='#' id='logoutButton'>Log Out</a></li></ul>");
        document.getElementById("logoutButton").onclick = logout;

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
            //location.reload();
            window.location.href = "muthu.html"
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
           //location.reload();
           window.location.href = "index.html"
        }
        return false;
    }
};