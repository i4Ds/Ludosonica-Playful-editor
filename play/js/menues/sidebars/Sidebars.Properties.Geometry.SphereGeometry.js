Sidebars.Properties.Geometry.SphereGeometry = function ( signals, object ) {

	var container = new UI.Panel();

	var geometry = object.geometry;

	var RADIUS_PROP = 'sphere_radius';
	// add instance properties
	editor.templateManager.addLinkProperty(RADIUS_PROP);


	// radius

	var radiusRow = new UI.Panel();
	radiusRow.setClass("row");
	// check if object property is linked or not, because ui is rebuilt on each object selected event.
	if (object.isInstance) {

		var linkClass = object.isLinked[RADIUS_PROP] ? 'linked' : 'link';
		var radiusLink = new UI.Text('').setClass('icn icon-link ' + linkClass).onClick(function () {

			if (this.dom.className.indexOf('linked') === -1) {
				object.isLinked[RADIUS_PROP] = true;
				this.setClass('icn icon-link linked');

				// update to template value
				var template = editor.templateManager.getTemplateOfInstance(object.id);
				var value = template.geometry.parameters.radius;
				radius.setValue(value);

				update();
			}
		});

		radiusRow.add(radiusLink);
	}

	var radius = new UI.Number( geometry.parameters.radius ).onChange( function () {
		if (object.isInstance) {
			object.isLinked[RADIUS_PROP] = false;
			radiusLink.setClass('icn icon-link link');
		}
		update();
	} );

	radiusRow.add( new UI.Text( 'Radius' ).setWidth( '90px' ) );
	radiusRow.add( radius );

	container.add( radiusRow );



	// widthSegments (disabled)

	var widthSegmentsRow = new UI.Panel();
	widthSegmentsRow.setClass("row disabled");
	var widthSegments = new UI.Integer( geometry.parameters.widthSegments ).setRange( 1, Infinity ).onChange( update );

	widthSegmentsRow.add( new UI.Text( 'Width segments' ).setWidth( '90px' ) );
	widthSegmentsRow.add( widthSegments );

	container.add( widthSegmentsRow );

	// heightSegments (disabled)

	var heightSegmentsRow = new UI.Panel();
	heightSegmentsRow.setClass("row disabled");
	var heightSegments = new UI.Integer( geometry.parameters.heightSegments ).setRange( 1, Infinity ).onChange( update );

	heightSegmentsRow.add( new UI.Text( 'Height segments' ).setWidth( '90px' ) );
	heightSegmentsRow.add( heightSegments );

	container.add( heightSegmentsRow );

	// phiStart (disabled)

	var phiStartRow = new UI.Panel();
	phiStartRow.setClass("row disabled");
	var phiStart = new UI.Number( geometry.parameters.phiStart ).onChange( update );

	phiStartRow.add( new UI.Text( 'Phi start' ).setWidth( '90px' ) );
	phiStartRow.add( phiStart );

	container.add( phiStartRow );

	// phiLength (disabled)

	var phiLengthRow = new UI.Panel();
	phiLengthRow.setClass("row disabled");
	var phiLength = new UI.Number( geometry.parameters.phiLength ).onChange( update );

	phiLengthRow.add( new UI.Text( 'Phi length' ).setWidth( '90px' ) );
	phiLengthRow.add( phiLength );

	container.add( phiLengthRow );

	// thetaStart (disabled)

	var thetaStartRow = new UI.Panel();
	thetaStartRow.setClass("row disabled");
	var thetaStart = new UI.Number( geometry.parameters.thetaStart ).onChange( update );

	thetaStartRow.add( new UI.Text( 'Theta start' ).setWidth( '90px' ) );
	thetaStartRow.add( thetaStart );

	container.add( thetaStartRow );

	// thetaLength (disabled)

	var thetaLengthRow = new UI.Panel();
	thetaLengthRow.setClass("row disabled");
	var thetaLength = new UI.Number( geometry.parameters.thetaLength ).onChange( update );

	thetaLengthRow.add( new UI.Text( 'Theta length' ).setWidth( '90px' ) );
	thetaLengthRow.add( thetaLength );

	container.add( thetaLengthRow );


	//

	function update() {

		if( object.isTemplate ){

			var instObjects = editor.templateManager.getInstancesOfTemplate( object.id );

			for( var i = 0; i < instObjects.length; i++ ){

				if( instObjects[i].isLinked[RADIUS_PROP]){

					updateGeometry( instObjects[i] );

				}
			}

		}

		updateGeometry( object );

	}

	function updateGeometry( object ) {

		//delete object.__webglInit; // TODO: Remove hack (WebGLRenderer refactoring)
		
		object.geometry.dispose();

		object.geometry = new THREE.SphereGeometry(
			radius.getValue(),
			widthSegments.getValue(),
			heightSegments.getValue()
		);

		object.geometry.buffersNeedUpdate = true;
		object.geometry.computeBoundingSphere();

		signals.objectChanged.dispatch( object );

	}

	return container;

};
