window.onload = function(){ 
    Parse.initialize("uMG2e5uKOVVE6hrAVbBSSRXuwGRa6BD1lcvN9tm3", "ubjYQ1u3UnPH6g1bk6ayIcNR6sj6MYO47qIxrdPR");
    
    var currentUser = Parse.User.current();
    if (currentUser) {
        $("#login-section").html("<h1>Welcome to MediSync!<br>Your cloud based patient management system!</h1>");
        // do stuff with the user

        $("#user-dropdown").html("<a href='#' data-toggle='dropdown' class='dropdown-toggle'>" + currentUser.username + " <b class='caret'></b></a><ul class='dropdown-menu'><li><a href='#'>Dropdown 1</a></li><li><a href='#'>Dropdown 2</a></li><li><a href='#'>Dropdown 3</a></li></ul>");

    } else {
        // show the signup or login page
        $("#login-section").html("<div class='row'><div class='col-xs-6'><div id='logo'><img src='assets/medisync_by_mediplus.png'></img></div></div><div class='col-xs-6'><div class='login'><input type='text' placeholder='username' name='user'><br><input type='password' placeholder='password' name='password'><br><input type='button' value='Login'></div></div></div>");
    }
};