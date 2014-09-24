var currentUser = Parse.User.current();

imonload = function(){ 
    $("#im-link").addClass("active");
    if (currentUser) {
        // YOU ARE LOGGED IN

        loadIM();

    } else {
        // YOU ARE NOT LOGGED IN
        window.location.href = "index.html";
    }
    
    function loadIM() {        
        var pubnub = PUBNUB.init({
             publish_key: 'pub-c-80c26be5-7625-4f38-be95-7d7333e5b8ba',
             subscribe_key: 'sub-c-8878abb0-43e7-11e4-a249-02ee2ddab7fe'
         });
        
        pubnub.subscribe({
            channel: 'my_channel',
            message: function(m){console.log(m)}
         });
        setTimeout(function()
            {pubnub.publish({
                 channel: 'my_channel',        
                 message: 'Hello from the PubNub Javascript SDK'
             }); }
        , 3000);     
    }
};

addLoadEvent(imonload);