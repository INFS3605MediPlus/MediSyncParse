function closeUserForm(){
    location.reload();
}

function createNewUserntoParse() {
    var newUserfname = document.getElementById("firstNameOfUser").value;
    var newUserlname = document.getElementById("lastNameOfUser").value;
    var newUseremail = document.getElementById("emailOfUser").value;

        parseCreateUser(newUserfname, newUserlname, newUseremail);
}

function parseCreateUser(fname, lname, email) {
    var User = Parse.Object.extend("User");
    var user = new User();
    user.set("Staff_First_Name", fname);
    user.set("Staff_Last_Name", lname);
    user.set("username", email);
      
    user.save(null, {
      success: function(user) {
        alert("Patient created");
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        alert("Error: " + error.code + " " + error.message);
      }
    });
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