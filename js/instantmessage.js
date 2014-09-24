var currentUser = Parse.User.current();

imonload = function(){ 
    $("#im-link").addClass("active");
    var pubnub;
    if (currentUser) {
        // YOU ARE LOGGED IN
        loadIM();
        document.getElementById("post-im-button").onclick = postIM;

    } else {
        // YOU ARE NOT LOGGED IN
        window.location.href = "index.html";
    }
    
    function loadIM() {        
        pubnub = PUBNUB.init({
             publish_key: 'pub-c-80c26be5-7625-4f38-be95-7d7333e5b8ba',
             subscribe_key: 'sub-c-8878abb0-43e7-11e4-a249-02ee2ddab7fe'
         });
        
        pubnub.subscribe({
            channel: 'my_channel',
            message: function(m){$('#im-messages').append(m + '<br/>')}
         });    
    }
    
    function postIM() {
        pubnub.publish({
                 channel: 'my_channel',        
                 message: '' + currentUser.get('Staff_First_Name') + ' ' + currentUser.get('Staff_Last_Name') + ': ' + document.getElementById('new-message').value + ''
             });
        document.getElementById('new-message').value = '';
    }
};

addLoadEvent(imonload);