Sidebars.Properties.Events = function ( editor ) {

	var signals = editor.signals;

	var EVENTS_PROP = 'events';
	// add instance properties
	editor.templateManager.addLinkProperty(EVENTS_PROP);


	var objectSelected = undefined;

	var container = new UI.Panel();
	container.setDisplay( 'none' );

	var title = $("<h3/>",{ html: "Events" });
	title.addClass('title-with-link');

	var eventsLink = new UI.Text('').setClass('icn icon-link link title-link').onClick(function () {

		if (this.dom.className.indexOf('linked') === -1) {

			// update to template value
			var template = editor.templateManager.getTemplateOfInstance(objectSelected.id);
			eventList.setValue( template.events );

			objectSelected.isLinked[EVENTS_PROP] = true;
			this.setClass('icn icon-link linked title-link');

			update();
		}
	});

	container.add( eventsLink );
	title.appendTo( container.dom );

	// event list

	var eventListRow = new UI.Panel();
	eventListRow.setClass('clear-float');
	var eventList = new UI.EventList(  ).onChange( function () {

		console.log('ON CHANGE');
		// link button logic
		if (objectSelected.isInstance) {
			objectSelected.isLinked[EVENTS_PROP] = false;
			eventsLink.setClass('icn icon-link link title-link');
		}

		update();
	} );

	eventListRow.add( eventList );

	container.add( eventListRow );

	//

	function update( ) {

		var events = eventList.getValue();

		// UPDATE OF TEMPLATE INSTANCES
		if (objectSelected.isTemplate) {

			var instObjects = editor.templateManager.getInstancesOfTemplate(objectSelected.id);

			for (var i = 0; i < instObjects.length; i++) {

					if (instObjects[i].isLinked[EVENTS_PROP]) {
						instObjects[i].events = events;
					}

			}

		}

		//UPDATE NORMAL OBJECT
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
			update( );

			// link icon / button
			if (objectSelected.isInstance) {

				$(eventsLink.dom).show();

				// set link to linked icon if property is linked or to link button if not for all props:
				if (objectSelected.isLinked[EVENTS_PROP]) {
					eventsLink.setClass('icn icon-link linked title-link');
				} else {
					eventsLink.setClass('icn icon-link link title-link');
				}

			} else {
				$(eventsLink.dom).hide();
			}

		} else {

			container.setDisplay( 'none' );

		}

	} );

	return container;

};
