var Tools = function ( editor ) {

	var container = new UI.Panel();
	
	container.modes = new Tools.Modes( editor );
	container.add( container.modes );
	
	container.view = new Tools.View( editor );
	container.add( container.view );

	container.menu = new Tools.Menu( editor );
	for(var i = 0; i < container.menu.length; i++){
		container.add( container.menu[i] );
	}
	//container.add( container.menu );

	//container.file = new Tools.File( editor );
	//var editPanel = new UI.ButtonHelper.createButtonPanel( "menu" );
	//editPanel.addButton( "icon-file", function () { signals.menuButtonClicked.dispatch("file+help"); } );
	//container.file = editPanel;
	//container.add( editPanel );

	return container;

};
