
function generatePDF() {
	var doc = new jsPDF();

	alert("Helo");        
	var elementHandler = {
  		'#cssmenu': function (element, renderer) {
    	return true;
  		},
  		'#patient-name': function (element, renderer) {
    	return true;
  		},
  		'#patient-search-section': function (element, renderer) {
    	return true;
  		},
  		'#patient-admin-details': function (element, renderer) {
    	return true;
  		},
  		'#tablist': function (element, renderer) {
    	return true;
  		},
  		'#red': function (element, renderer) {
    	return true;
  		},
  		'#orange': function (element, renderer) {
    	return true;
  		},
  		'#createPDF': function (element, renderer) {
    	return true;
  		},
  		'#patient-log': function (element, renderer) {
    	return true;
  		},
  		'#patientform': function (element, renderer) {
    	return true;
  		},
  		'#userform': function (element, renderer) {
    	return true;
  		},
  		'#appointmentform': function (element, renderer) {
    	return true;
  		},
  		'#calendar': function (element, renderer) {
    	return true;
  		},
      '#calendar': function (element, renderer) {
      return true;
	};
var source = window.document.getElementsByTagName("body")[0];
doc.fromHTML(
    source,
    15,
    15,
    {
      'width': 180,'elementHandlers': elementHandler
    });

doc.output("dataurlnewwindow");
}

document.getElementById("createPDF").onclick = generatePDF;
