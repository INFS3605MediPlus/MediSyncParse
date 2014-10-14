function closeUserForm(){
    location.reload();
}

function createNewUserIntoParse() {
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
    user.set("Staff_Type", stafftype);
    user.set("password", pw);
      
    user.save(null, {
      success: function(user) {
        alert("User created");
        location.reload();
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        alert("Error: " + error.code + " " + error.message);
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

//function to check target element
function check(e){ 
var target = (e && e.target) || (event && event.srcElement); 

var obj = document.getElementById('userform'); 
var obj2 = document.getElementById('add_user_icon'); 

checkParent(target)?obj.style.display='none':null; 
target==obj2?obj.style.display='block':null; 

} 

//function to check parent node and return result accordingly
function checkParent(t){ 
    while(t.parentNode){ 
        if(t==document.getElementById('userform'))
            { 
                return false 
            }
        else if(t==document.getElementById('closeButtonUser'))
            {
                return true
            } 
        t=t.parentNode 
    } 
    return true 
}