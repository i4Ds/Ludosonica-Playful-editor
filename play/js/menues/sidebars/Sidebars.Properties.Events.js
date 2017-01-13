Sidebars.Properties.Events = function ( editor ) {

	var signals = editor.signals;

	var objectSelected = undefined;

	var container = new UI.Panel();
	container.setDisplay( 'none' );

	$("<h3/>",{ html: "Events" }).appendTo( container.dom );

	// event list

	var eventListRow = new UI.Panel();
	var eventList = new UI.EventList(  ).onChange( update );

	eventListRow.add( eventList );

	container.add( eventListRow );

	//

	function update( ) {

		var events = eventList.getValue();
		 //console.log('get events object', events);
		objectSelected.events = events;

		if ( objectSelected._egh ) editor.setEdge( objectSelected );

		signals.objectChanged.dispatch( objectSelected );

	}

	// events

	signals.objectSelected.add( function ( object ) {

		if ( object && object._physijs ) {

			objectSelected = object;

			container.setDisplay( '' );

			eventList.setValue( object.events );
			update();

		} else {

			container.setDisplay( 'none' );

		}

	} );

	return container;

};
