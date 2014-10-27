function createNewDocIntoParse() {
    var newDocType = document.getElementById("docDropdown");
    var newSelectedType = newDocType.options[newDocType.selectedIndex].value;
    var newDocDesc = document.getElementById("docDesc").value;
    var newDocFile = document.getElementById("docFile");
    var base64 = "V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=";
    var file = new Parse.File(newDocFile, { base64: base64 });

        parseCreateDoc(newSelectedType, newDocDesc, file);

}

function parseCreateDoc(type, desc, file) {
    var Document = Parse.Object.extend("User");
    var doc = new Document();
    doc.set("Document_Type", type);
    doc.set("Document_Description", desc);
    doc.set("Document_File", file);
      
    doc.save(null, {
      success: function(doc) {
        alert("Document added");
      },
      error: function(doc, error) {
        // Show the error message somewhere and let the user try again.
        alert("Error: " + error.code + " " + error.message);
      }
    });
}

//function to display Popup
function document_show(){ 
    document.getElementById('docform').style.display = "block";
}
