Sidebars.Properties.Physics = function ( editor ) {

	var signals = editor.signals;
	
	var objectSelected = undefined;
	var physijsSelected = undefined;

	// panel

	var container = new UI.Panel();
	container.setDisplay( 'none' );
	container.setClass("Panel advanced");
	
	$("<h3/>",{ html: "Physics" }).appendTo( container.dom );

	// friction

	var physicsFrictionRow = new UI.Panel();
	physicsFrictionRow.setClass("row");
	var physicsFriction = new UI.Number( 0.5 ).setRange( 0, 1 ).onChange( update );

	physicsFrictionRow.add( new UI.Text( 'Friction' ).setWidth( '90px' ) );
	physicsFrictionRow.add( physicsFriction );

	container.add( physicsFrictionRow );

	// restitution

	var physicsRestitutionRow = new UI.Panel();
	physicsRestitutionRow.setClass("row");
	var physicsRestitution = new UI.Number( 0.5 ).setRange( 0, 1 ).onChange( update );

	physicsRestitutionRow.add( new UI.Text( 'Bounciness' ).setWidth( '90px' ) );
	physicsRestitutionRow.add( physicsRestitution );

	container.add( physicsRestitutionRow );

	// static or dynamic

	var physicsModeRow = new UI.Panel();
	physicsModeRow.setClass("row");
	var physicsMode = new UI.Checkbox( false ).onChange( update );

	physicsModeRow.add( new UI.Text( 'Static' ).setWidth( '90px' ) );
	physicsModeRow.add( physicsMode );

	container.add( physicsModeRow );
	
	//

	function update() {


		// COLOR UPDATE OF TEMPLATE AND ITS INSTANCES
		if (objectSelected.isTemplate) {

			var instObjects = editor.templateManager.getInstancesOfTemplate(objectSelected.id);

			for (var i = 0; i < instObjects.length; i++) {

				var instMaterial = instObjects[i].material;

				// check if property of the current instance is linked to the template or not.
				if (instObjects[i].isLinked.color) {

					var physics = instMaterial._physijs;

					if ( physics ) {

						physics.friction = physicsFriction.getValue();
						physics.restitution = physicsRestitution.getValue();
						objectSelected.isStatic = physicsMode.getValue();

					}
				}

			}
		}
		
			var physics = objectSelected.material._physijs;

			if ( physics ) {

				physics.friction = physicsFriction.getValue();
				physics.restitution = physicsRestitution.getValue();
				objectSelected.isStatic = physicsMode.getValue();

			}


			signals.objectChanged.dispatch( objectSelected );
	}
	
	// events

	signals.objectSelected.add( function ( object ) {

		if ( object && object.material && object.material._physijs ) {
		
			objectSelected = object;
			physijsSelected = object.material._physijs;

			container.setDisplay( '' );

			var physics = object.material._physijs;
			
			if ( physics.friction === undefined ) physics.friction = 0.5;

			physicsFriction.setValue( physics.friction );
			
			if ( physics.restitution === undefined ) physics.restitution = 0.5;
			physicsRestitution.setValue( physics.restitution );
			
			if ( object.isStatic == undefined ) object.isStatic = false;
			physicsMode.setValue( object.isStatic );

		} else {

			container.setDisplay( 'none' );

		}

	} );

	return container;

};
