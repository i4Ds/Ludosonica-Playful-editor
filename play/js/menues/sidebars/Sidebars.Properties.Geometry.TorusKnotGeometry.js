Sidebars.Properties.Geometry.TorusKnotGeometry = function ( signals, object ) {

	var container = new UI.Panel();

	var geometry = object.geometry;

	// radius

	var radiusRow = new UI.Panel();
	radiusRow.setClass("row");
	var radius = new UI.Number( geometry.parameters.radius ).onChange( update );

	radiusRow.add( new UI.Text( 'Radius' ).setWidth( '90px' ) );
	radiusRow.add( radius );

	container.add( radiusRow );

	// tube

	var tubeRow = new UI.Panel();
	tubeRow.setClass("row");
	var tube = new UI.Number( geometry.parameters.tube ).onChange( update );

	tubeRow.add( new UI.Text( 'Tube' ).setWidth( '90px' ) );
	tubeRow.add( tube );

	container.add( tubeRow );

	// radialSegments

	var radialSegmentsRow = new UI.Panel();
	radialSegmentsRow.setClass("row");
	var radialSegments = new UI.Integer( geometry.parameters.radialSegments ).setRange( 1, Infinity ).onChange( update );

	radialSegmentsRow.add( new UI.Text( 'Radial segments' ).setWidth( '90px' ) );
	radialSegmentsRow.add( radialSegments );

	container.add( radialSegmentsRow );

	// tubularSegments

	var tubularSegmentsRow = new UI.Panel();
	tubularSegmentsRow.setClass("row");
	var tubularSegments = new UI.Integer( geometry.parameters.tubularSegments ).setRange( 1, Infinity ).onChange( update );

	tubularSegmentsRow.add( new UI.Text( 'Tubular segments' ).setWidth( '90px' ) );
	tubularSegmentsRow.add( tubularSegments );

	container.add( tubularSegmentsRow );

	// p

	var pRow = new UI.Panel();
	pRow.setClass("row");
	var p = new UI.Number( geometry.parameters.p ).onChange( update );

	pRow.add( new UI.Text( 'P' ).setWidth( '90px' ) );
	pRow.add( p );

	container.add( pRow );

	// q

	var qRow = new UI.Panel();
	qRow.setClass("row");
	var q = new UI.Number( geometry.parameters.q ).onChange( update );

	pRow.add( new UI.Text( 'Q' ).setWidth( '90px' ) );
	pRow.add( q );

	container.add( qRow );

	// heightScale

	var heightScaleRow = new UI.Panel();
	heightScaleRow.setClass("row");
	var heightScale = new UI.Number( geometry.parameters.heightScale ).onChange( update );

	pRow.add( new UI.Text( 'Height scale' ).setWidth( '90px' ) );
	pRow.add( heightScale );

	container.add( heightScaleRow );


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

		delete object.__webglInit; // TODO: Remove hack (WebGLRenderer refactoring)

		object.geometry.dispose();

		object.geometry = new THREE.TorusKnotGeometry(
			radius.getValue(),
			tube.getValue(),
			radialSegments.getValue(),
			tubularSegments.getValue(),
			p.getValue(),
			q.getValue(),
			heightScale.getValue()
		);

		object.geometry.buffersNeedUpdate = true;
		object.geometry.computeBoundingSphere();

		signals.objectChanged.dispatch( object );

	}

	return container;

}