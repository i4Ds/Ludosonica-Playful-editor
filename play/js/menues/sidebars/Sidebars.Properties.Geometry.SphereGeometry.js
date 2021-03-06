Sidebars.Properties.Geometry.SphereGeometry = function ( signals, object ) {

	var container = new UI.Panel();

	var geometry = object.geometry;

	// radius

	var radiusRow = new UI.Panel();
	radiusRow.setClass("row");
	var radius = new UI.Number( geometry.parameters.radius ).onChange( update );

	radiusRow.add( new UI.Text( 'Radius' ).setWidth( '90px' ) );
	radiusRow.add( radius );

	container.add( radiusRow );

	// widthSegments

	var widthSegmentsRow = new UI.Panel();
	widthSegmentsRow.setClass("row");
	var widthSegments = new UI.Integer( geometry.parameters.widthSegments ).setRange( 1, Infinity ).onChange( update );

	widthSegmentsRow.add( new UI.Text( 'Width segments' ).setWidth( '90px' ) );
	widthSegmentsRow.add( widthSegments );

	//container.add( widthSegmentsRow );

	// heightSegments

	var heightSegmentsRow = new UI.Panel();
	heightSegmentsRow.setClass("row");
	var heightSegments = new UI.Integer( geometry.parameters.heightSegments ).setRange( 1, Infinity ).onChange( update );

	heightSegmentsRow.add( new UI.Text( 'Height segments' ).setWidth( '90px' ) );
	heightSegmentsRow.add( heightSegments );

	//container.add( heightSegmentsRow );

	// phiStart

	var phiStartRow = new UI.Panel();
	phiStartRow.setClass("row");
	var phiStart = new UI.Number( geometry.parameters.phiStart ).onChange( update );

	phiStartRow.add( new UI.Text( 'Phi start' ).setWidth( '90px' ) );
	phiStartRow.add( phiStart );
	
	phiStartRow.setDisplay('none');

	container.add( phiStartRow );

	// phiLength

	var phiLengthRow = new UI.Panel();
	phiLengthRow.setClass("row");
	var phiLength = new UI.Number( geometry.parameters.phiLength ).onChange( update );

	phiLengthRow.add( new UI.Text( 'Phi length' ).setWidth( '90px' ) );
	phiLengthRow.add( phiLength );
	
	phiLengthRow.setDisplay('none');

	container.add( phiLengthRow );

	// thetaStart

	var thetaStartRow = new UI.Panel();
	thetaStartRow.setClass("row");
	var thetaStart = new UI.Number( geometry.parameters.thetaStart ).onChange( update );

	thetaStartRow.add( new UI.Text( 'Theta start' ).setWidth( '90px' ) );
	thetaStartRow.add( thetaStart );
	
	thetaStartRow.setDisplay('none');

	container.add( thetaStartRow );

	// thetaLength (disabled)

	var thetaLengthRow = new UI.Panel();
	thetaLengthRow.setClass("row");
	var thetaLength = new UI.Number( geometry.parameters.thetaLength ).onChange( update );

	thetaLengthRow.add( new UI.Text( 'Theta length' ).setWidth( '90px' ) );
	thetaLengthRow.add( thetaLength );
	
	thetaLengthRow.setDisplay('none');

	container.add( thetaLengthRow );


	//

	function update() {

		if( object.isTemplate ){

			var instObjects = editor.templateManager.getInstancesOfTemplate( object.id );

			for( var i = 0; i < instObjects.length; i++ ){

				if( instObjects[i].isLinked.geometry){

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

}
