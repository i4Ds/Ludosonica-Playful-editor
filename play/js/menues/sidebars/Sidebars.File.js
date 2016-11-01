Sidebars.File = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setDisplay( 'none' );
	container.setClass('Panel top');

	$("<h2/>").html("File").appendTo(container.dom);
	var menu = new UI.Panel();
	menu.setClass("Panel menu");
	
	// Create a button for each menu item
	var newButton = $("<a/>").html("New Document").on("click",function(e)
	{
		if ( confirm( 'Are you sure?' ) )
		{
			editor.config.clear();
			editor.storage.clear( function () {
				location.href = location.pathname;
			} );
		}
	});
	
	var importButton = $("<a/>").html("Import").on("click",function(e)
	{

		// todo rerender cleared scene before import of new scene
		//editor.storage.clear( function () {
		//	signals.windowResize.dispatch();
		//	signals.sceneGraphChanged.dispatch();
		//} );

		fileInput.click();

	});
		
		// create file input element for scene import
		var fileInput = document.createElement( 'input' );
		fileInput.type = 'file';
		fileInput.addEventListener( 'change', onFileInputChange);
		
		function onFileInputChange ( event ) {
			//remove default elements
			var ground = editor.scene.getChildByName("Ground");
			if ( ground ) editor.removeObject( ground, true );
			
			//load
			editor.loader.loadFile( fileInput.files[ 0 ] );
		}
		
	var exportButton = $("<a/>").html("Export").on("click",function(e)
	{
		Sidebars.File.exportSceneHelper( editor, THREE.PlayfulExporter );
	});


	var saveButton = $("<a/>").html("SAVE").on("click",function(e)
	{
		showHide('sceneSave', $(this));
	});


	function showHide ( id, menu ) {
		var panel = $('#'+id);
		if(panel.css('display') == 'none'){
			menu.addClass("active");
			panel.css('display','block');
		}else{
			menu.removeClass("active");
			panel.css('display','none');
		}
	}
	
	// Create a list of the menu items
	$("<ul/>")
		.addClass("menu")
		.append( $("<li/>").html(newButton) )
		.append( $("<li/>").html(importButton) )
		.append( $("<li/>").html(exportButton) )
		.append( $("<li/>").html(saveButton) )
		.appendTo(menu.dom);
	
	// Add signal listener to show/hide this sidebar panel
	signals.menuButtonClicked.add( function(name) {
		if(name=="file+help")
		{
			// Show this sidebar panel when file+help menu button is clicked
			$(container.dom).toggle(200);
			editor.deselect();
		}
		else {
			$(container.dom).hide()
		}
	});	
	
	container.add(menu);
	
	//
	
	editor.storage.createZip = function ( callback ) {
		Sidebars.File.exportSceneHelper( editor, THREE.PlayfulExporter, callback, true );
	};
	
	return container;
};
