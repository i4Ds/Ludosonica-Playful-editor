Tools.Modes = function ( editor ) {

	var buttonpanel = new UI.ButtonHelper.createButtonPanel( "modes", true );
	var signals = editor.signals;

	var lastSelected = undefined;

	var playing = false;
	var stopPlaying = function()
	{
		if( playing )
		{
			viewport.windowed();
			editor.signals.stop.dispatch();
			playing = false;
			editor.select( lastSelected );
		}
	};

	var startPlaying = function()
	{
		if( !playing )
		{
			viewport.maximize();
			lastSelected = editor.selected;
			editor.signals.play.dispatch();
			playing = true;
		}
	};

	buttonpanel.addButton( "icon-translate active", function() { stopPlaying(); signals.transformModeChanged.dispatch( 'translate' ); }, 'modes-translate' );
	buttonpanel.addButton( "icon-scale", function() { stopPlaying(); signals.transformModeChanged.dispatch( 'scale' ); }, 'modes-scale' );
	buttonpanel.addButton( "icon-rotate", function() { stopPlaying(); signals.transformModeChanged.dispatch( 'rotate' ); }, 'modes-rotate' );
	var playbutton = buttonpanel.addButton( "icon-play", function() {

		if( playing ){
			stopPlaying();
			$('#menu-gallery').show();
			$('#menu-file').show();
			$('#menu-save').show();
			$('#menu-object').show();
			$('#menu-scene').show();
			$('#modes-translate').show();
			$('#modes-scale').show();
			$('#modes-rotate').show();
		}
		else{
			startPlaying();
			$('#menu-gallery').hide();
			$('#menu-file').hide();
			$('#menu-save').hide();
			$('#menu-object').hide();
			$('#menu-scene').hide();
			$('#modes-translate').hide();
			$('#modes-scale').hide();
			$('#modes-rotate').hide();
		}

	}, 'modes-play');

	return buttonpanel;

};
