var currentUser = Parse.User.current();

editpatientonload = function(){ 

    if (currentUser) {
        // YOU ARE LOGGED IN
        var patientID = getURLParameter("patientID");
        if (patientID == null) patientID = "";

    } else {
        // YOU ARE NOT LOGGED IN
        window.location.href = "index.html";
    }
};

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

addLoadEvent(editpatientonload);