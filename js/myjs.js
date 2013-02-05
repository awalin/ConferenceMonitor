// jQuery will call init() after the document is finished loading
$(document).ready(init);

// this is called after the document is finished loading
// it just initializes everything
function init() {
	// select all elements with "loading" id and set them as modal dialogs
	$("#loading").dialog({
		autoOpen: false,
		modal: true,
		title: 'I am the Modal Dialog title'
	});
	
	// when clicking the button, call showModalDialog()
	$("#show-modal-button").click(showModalDialog);
}

function showModalDialog() {
	// show the dialog
	$("#loading").dialog('open');
}
