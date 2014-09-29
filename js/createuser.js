var currentUser = Parse.User.current();

createuseronload = function(){
    // also check if user has role "admin"!
    if (currentUser) {
        // YOU ARE LOGGED IN
        document.getElementById("sign_up_button").onclick = signUp;
    } else {
        // YOU ARE NOT LOGGED IN
        window.location.href = "index.html";
    }
};

function signUp() {
    $('#sign_up_button').hide();
    var fname = document.forms["signUpForm"]["firstname"].value;
    var lname = document.forms["signUpForm"]["lastname"].value;
    var email = document.forms["signUpForm"]["email"].value;
    var pw = document.forms["signUpForm"]["pwd"].value;
    var confpw = document.forms["signUpForm"]["confirmpwd"].value;
    
    var errors = validateSignUpForm(fname, lname, email, pw, confpw);
    if (errors == "") {
        parseSignUp(fname, lname, email, pw);
    } else {
        alert(errors);
    }
    $('#sign_up_button').show();
}

function parseSignUp(fname, lname, email, pw) {
    var user = new Parse.User();
    user.set("username", email);
    user.set("Staff_First_Name", fname);
    user.set("Staff_Last_Name", lname);
    user.set("email", email);
    user.set("password", pw);
      
    user.signUp(null, {
      success: function(user) {
        $("#welcome").html("<h1>Your account has been created!</h1>");
        Parse.User.logOut();
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        alert("Error: " + error.code + " " + error.message);
      }
    });
}

function validateSignUpForm(fname, lname, email, pw, confpw) {
    var returnValue = "";
    
    if (pw != confpw) {
        returnValue = returnValue.concat("Passwords do not match!\n");
    }
    if (pw.length < 8) {
        returnValue = returnValue.concat("Password must be longer than 8 characters\n");
    }
    if (fname == "") {
        returnValue = returnValue.concat("First name cannot be blank\n");
    }
    if (lname == "") {
        returnValue = returnValue.concat("Last name cannot be blank\n");
    }
    if (email == "") {
        returnValue = returnValue.concat("Email cannot be blank\n");
    }
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
        returnValue = returnValue.concat("Please enter a valid email address\n");
    }
    
    return returnValue;
}



addLoadEvent(createuseronload);