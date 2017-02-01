Sidebars.Properties.Geometry.CylinderGeometry = function ( signals, object, linkProperties ) {

	var container = new UI.Panel();

	var geometry = object.geometry;

	var RADIUS_TOP_PROP = linkProperties.RADIUS_TOP_PROP;
	var RADIUS_BOTTOM_PROP = linkProperties.RADIUS_BOTTOM_PROP;
	var HEIGHT_PROP = linkProperties.HEIGHT_PROP;
	var RADIAL_SEG_PROP = linkProperties.RADIAL_SEG_PROP;
	var HEIGHT_SEG_PROP = linkProperties.HEIGHT_SEG_PROP;
	var OPEN_PROP = linkProperties.OPEN_PROP;


	// radiusTop

	var radiusTopRow = new UI.Panel();
	radiusTopRow.setClass("row");

	console.log('link class', linkClassRT);
	if (!linkClassRT && object.isInstance) {
		console.log('rerender?', object.isLinked[RADIUS_TOP_PROP]);
		var linkClassRT = object.isLinked[RADIUS_TOP_PROP] ? 'linked' : 'link';
		var radiusTopLink = new UI.Text('').setClass('icn icon-link ' + linkClassRT).onClick(updateRadiusTop);

		radiusTopRow.add(radiusTopLink);
	}

	var radiusTop = new UI.Number( geometry.parameters.radiusTop ).onChange( function () {
		if (object.isInstance) {
			object.isLinked[RADIUS_TOP_PROP] = false;
			radiusTopLink.setClass('icn icon-link link');
			console.log(object.isLinked[RADIUS_TOP_PROP], radiusTopLink);
		}
		update();
	} );

	radiusTopRow.add( new UI.Text( 'Radius top' ).setWidth( '90px' ) );
	radiusTopRow.add( radiusTop );

	container.add( radiusTopRow );


	// radiusBottom

	var radiusBottomRow = new UI.Panel();
	radiusBottomRow.setClass("row");
	if (object.isInstance) {
		var linkClassRB = object.isLinked[RADIUS_BOTTOM_PROP] ? 'linked' : 'link';
		var radiusBottomLink = new UI.Text('').setClass('icn icon-link ' + linkClassRB).onClick(updateRadiusBottom);

		radiusBottomRow.add(radiusBottomLink);
	}

	var radiusBottom = new UI.Number( geometry.parameters.radiusBottom ).onChange( function () {
		if (object.isInstance) {
			object.isLinked[RADIUS_BOTTOM_PROP] = false;
			radiusBottomLink.setClass('icn icon-link link');
		}
		update();
	} );

	radiusBottomRow.add( new UI.Text( 'Radius bottom' ).setWidth( '90px' ) );
	radiusBottomRow.add( radiusBottom );

	container.add( radiusBottomRow );


	// height

	var heightRow = new UI.Panel();
	heightRow.setClass("row");
	if (object.isInstance) {
		var linkClassH = object.isLinked[HEIGHT_PROP] ? 'linked' : 'link';
		var heightLink = new UI.Text('').setClass('icn icon-link ' + linkClassH).onClick(updateHeight);

		heightRow.add(heightLink);
	}

	var height = new UI.Number( geometry.parameters.height ).onChange( function () {
		if (object.isInstance) {
			object.isLinked[HEIGHT_PROP] = false;
			heightLink.setClass('icn icon-link link');
		}
		update();
	} );

	heightRow.add( new UI.Text( 'Height' ).setWidth( '90px' ) );
	heightRow.add( height );

	container.add( heightRow );


	// radialSegments

	var radialSegmentsRow = new UI.Panel();
	radialSegmentsRow.setClass("row");
	if (object.isInstance) {
		var linkClassRS = object.isLinked[RADIAL_SEG_PROP] ? 'linked' : 'link';
		var radialSegmentLink = new UI.Text('').setClass('icn icon-link ' + linkClassRS).onClick(updateRadialSegments);

		radialSegmentsRow.add(radialSegmentLink);
	}

	var radialSegments = new UI.Integer( geometry.parameters.radialSegments ).setRange( 1, Infinity ).onChange( function () {
		if (object.isInstance) {
			object.isLinked[RADIAL_SEG_PROP] = false;
			radialSegmentLink.setClass('icn icon-link link');
		}
		update();
	});

	radialSegmentsRow.add( new UI.Text( 'Radial segments' ).setWidth( '90px' ) );
	radialSegmentsRow.add( radialSegments );

	container.add( radialSegmentsRow );


	// heightSegments

	var heightSegmentsRow = new UI.Panel();
	heightSegmentsRow.setClass("row");
	if (object.isInstance) {
		var linkClassHS = object.isLinked[HEIGHT_SEG_PROP] ? 'linked' : 'link';
		var heightSegmentLink = new UI.Text('').setClass('icn icon-link ' + linkClassHS).onClick(updateHeightSegments);

		heightSegmentsRow.add(heightSegmentLink);
	}
	var heightSegments = new UI.Integer( geometry.parameters.heightSegments ).setRange( 1, Infinity ).onChange( function () {
		if (object.isInstance) {
			object.isLinked[HEIGHT_SEG_PROP] = false;
			heightSegmentLink.setClass('icn icon-link link');
		}
		update();
	} );

	heightSegmentsRow.add( new UI.Text( 'Height segments' ).setWidth( '90px' ) );
	heightSegmentsRow.add( heightSegments );

	container.add( heightSegmentsRow );


	// openEnded

	var openEndedRow = new UI.Panel();
	openEndedRow.setClass("row");
	if (object.isInstance) {
		var linkClassO = object.isLinked[OPEN_PROP] ? 'linked' : 'link';
		var openEndedLink = new UI.Text('').setClass('icn icon-link ' + linkClassO).onClick(updateOpenEnded);

		openEndedRow.add(openEndedLink);
	}
	var openEnded = new UI.Checkbox( geometry.parameters.openEnded ).onChange( function () {
		if (object.isInstance) {
			object.isLinked[OPEN_PROP] = false;
			openEndedLink.setClass('icn icon-link link');
		}
		update();
	} );

	openEndedRow.add( new UI.Text( 'Open ended' ).setWidth( '90px' ) );
	openEndedRow.add( openEnded );

	container.add( openEndedRow );


	//

	function updateRadiusTop() {

			if (this.dom.className.indexOf('linked') === -1) {
				object.isLinked[RADIUS_TOP_PROP] = true;
				this.setClass('icn icon-link linked');

				// update to template value
				var template = editor.templateManager.getTemplateOfInstance(object.id);
				var value = template.geometry.parameters.radiusTop;
				radiusTop.setValue(value);

				update();
			}
	}

	function updateRadiusBottom() {

		if (this.dom.className.indexOf('linked') === -1) {
			object.isLinked[RADIUS_BOTTOM_PROP] = true;
			this.setClass('icn icon-link linked');

			// update to template value
			var template = editor.templateManager.getTemplateOfInstance(object.id);
			var value = template.geometry.parameters.radiusBottom;
			radiusBottom.setValue(value);

			update();
		}
	}

	function updateHeight() {

		if (this.dom.className.indexOf('linked') === -1) {
			object.isLinked[HEIGHT_PROP] = true;
			this.setClass('icn icon-link linked');

			// update to template value
			var template = editor.templateManager.getTemplateOfInstance(object.id);
			var value = template.geometry.parameters.height;
			height.setValue(value);

			update();
		}
	}

	function updateRadialSegments() {

		if (this.dom.className.indexOf('linked') === -1) {
			object.isLinked[RADIAL_SEG_PROP] = true;
			this.setClass('icn icon-link linked');

			// update to template value
			var template = editor.templateManager.getTemplateOfInstance(object.id);
			var value = template.geometry.parameters.radialSegments;
			radialSegments.setValue(value);

			update();
		}
	}

	function updateHeightSegments() {

		if (this.dom.className.indexOf('linked') === -1) {
			object.isLinked[HEIGHT_SEG_PROP] = true;
			this.setClass('icn icon-link linked');

			// update to template value
			var template = editor.templateManager.getTemplateOfInstance(object.id);
			var value = template.geometry.parameters.heightSegments;
			heightSegments.setValue(value);

			update();
		}
	}

	function updateOpenEnded() {

		if (this.dom.className.indexOf('linked') === -1) {
			object.isLinked[OPEN_PROP] = true;
			this.setClass('icn icon-link linked');

			// update to template value
			var template = editor.templateManager.getTemplateOfInstance(object.id);
			var value = template.geometry.parameters.openEnded;
			openEnded.setValue(value);

			update();
		}
	}


	//

	function update() {

		if( object.isTemplate ){

			var instObjects = editor.templateManager.getInstancesOfTemplate( object.id );

			for( var i = 0; i < instObjects.length; i++ ){

				var objRadiusTop = instObjects[i].geometry.parameters.radiusTop;
				var objRadiusBottom = instObjects[i].geometry.parameters.radiusBottom;
				var objHeight = instObjects[i].geometry.parameters.height;
				var objRadialSegments = instObjects[i].geometry.parameters.radialSegments;
				var objHeightSegments = instObjects[i].geometry.parameters.heightSegments;
				var objOpenEnded = instObjects[i].geometry.parameters.openEnded;

				if(instObjects[i].isLinked[RADIUS_TOP_PROP]){
					objRadiusTop = radiusTop.getValue();
				}
				if(instObjects[i].isLinked[RADIUS_BOTTOM_PROP]){
					objRadiusBottom = radiusBottom.getValue();
				}
				if(instObjects[i].isLinked[HEIGHT_PROP]){
					objHeight = height.getValue();
				}
				if(instObjects[i].isLinked[RADIAL_SEG_PROP]){
					objRadialSegments = radialSegments.getValue();
				}
				if(instObjects[i].isLinked[HEIGHT_SEG_PROP]){
					objHeightSegments = heightSegments.getValue();
				}
				if(instObjects[i].isLinked[OPEN_PROP]){
					objOpenEnded = openEnded.getValue();
				}

				updateGeometry(instObjects[i], objRadiusTop, objRadiusBottom, objHeight, objRadialSegments, objHeightSegments, objOpenEnded);

			}

		}

		updateGeometry( object, radiusTop.getValue(), radiusBottom.getValue(), height.getValue(), radialSegments.getValue(), heightSegments.getValue(), openEnded.getValue() );

	}

	function updateGeometry( object, radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded ) {

		object.geometry.dispose();

		object.geometry = new THREE.CylinderGeometry(
			radiusTop,
			radiusBottom,
			height,
			radialSegments,
			heightSegments,
			openEnded
		);

		object.geometry.buffersNeedUpdate = true;
		object.geometry.computeBoundingSphere();

		signals.objectChanged.dispatch( object );

	}

	return container;

};
