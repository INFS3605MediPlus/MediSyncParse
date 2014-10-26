function createNewUserIntoParse() {
    $('#createNewUserButton').attr('disabled','disabled');
    var newUserfname = document.getElementById("firstNameOfUser").value;
    var newUserlname = document.getElementById("lastNameOfUser").value;
    var newUseremail = document.getElementById("emailOfUser").value;
    var newUserconemail = document.getElementById("emailConfirmedOfUser").value;
    var newUsercontactno = document.getElementById("contactNoOfUser").value;
    var newUserRole = document.getElementById("roleDropdown");
    var newUserSelectedRole = newUserRole.options[newUserRole.selectedIndex].value;
    var newUserpassword = document.getElementById("passwordOfUser").value;
    var newUserconpassword = document.getElementById("passwordConfirmedOfUser").value;

    var errors = validateUserForm(newUserfname, newUserlname, newUseremail, newUserconemail, newUsercontactno, newUserSelectedRole, newUserpassword, newUserconpassword);
    if (errors == "") {
        parseCreateUser(newUserfname, newUserlname, newUsercontactno, newUserSelectedRole, newUseremail, newUserpassword);
    } else {
        alert(errors);
        $('#createNewUserButton').removeAttr('disabled');
    }
}

function parseCreateUser(fname, lname, contactno, stafftype, email, pw) {
    var User = Parse.Object.extend("User");
    var user = new User();
    user.set("Staff_First_Name", fname);
    user.set("Staff_Last_Name", lname);
    user.set("username", email);
    user.set("email", email);
    user.set("Staff_Contact_No", contactno);
    user.set("password", pw);
      
    user.save(null, {
      success: function(userToAdd) {
        var query = new Parse.Query(Parse.Role);
        query.equalTo("name", stafftype);
        query.first({
          success: function(extractedRole) {
             extractedRole.getUsers().add(userToAdd);
             extractedRole.save().then(function(ss) {
                alert("User added to role");
                location.reload();
             }, function(error) {
                alert("Error: " + error.code + " " + error.message);
                $('#createNewUserButton').removeAttr('disabled');
             });
             
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
            $('#createNewUserButton').removeAttr('disabled');
          }
        });
          
          
          
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        alert("Error: " + error.code + " " + error.message);
        $('#createNewUserButton').removeAttr('disabled');
      }
    });
}

function validateUserForm(fname, lname, email, conemail, contactno, stafftype, pw, confpw) {
    var returnValue = "";
    
    if (pw != confpw) {
        returnValue = returnValue.concat("Passwords do not match!\n");
    }
    if (email != conemail) {
        returnValue = returnValue.concat("Emails do not match!\n");
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
    if (contactno == "") {
        returnValue = returnValue.concat("Contact number cannot be blank\n");
    }
    if (contactno.length <8 || contactno.length >12) {
        returnValue = returnValue.concat("Contact number must have between 8 and 12 digits\n");
    }
    if (stafftype == "Select") {
        returnValue = returnValue.concat("The Role field cannot be blank\n");
    }
    
    return returnValue;
}

//function to display Popup
function user_show(){ 
    document.getElementById('userform').style.display = "block";
}
