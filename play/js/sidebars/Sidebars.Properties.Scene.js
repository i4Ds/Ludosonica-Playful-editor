Sidebars.Properties.Scene = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setDisplay( 'none' );

	$("<h3/>",{ html: "Scene" }).appendTo( container.dom );

	
	// default color

	var defaultColorRow = new UI.Panel();
	var defaultColorType = new UI.Select().setOptions( {

		'None': 'None',
		'RMS': 'Average RMS'

	} ).setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' );
	defaultColorType.onChange( function () {

		var type = defaultColorType.getValue();
		signals.defaultColorTypeChanged.dispatch( type );
		editor.config.setKey('defaultColor', type)

	} );

	defaultColorRow.add( new UI.Text( 'Default Color' ).setWidth( '90px' ) );
	defaultColorRow.add( defaultColorType );

	//container.add( defaultColorRow );
	
	// fog

	var updateFogParameters = function () {

		var near = fogNear.getValue();
		var far = fogFar.getValue();
		var density = fogDensity.getValue();

		signals.fogParametersChanged.dispatch( near, far, density );

	};

	var fogTypeRow = new UI.Panel();
	var fogType = new UI.Select().setOptions( {

		'None': 'None',
		'Fog': 'Linear',
		'FogExp2': 'Exponential'

	} ).setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' )
	fogType.onChange( function () {

		var type = fogType.getValue();
		signals.fogTypeChanged.dispatch( type );

		refreshFogUI();

	} );

	fogTypeRow.add( new UI.Text( 'Fog' ).setWidth( '90px' ) );
	fogTypeRow.add( fogType );

	container.add( fogTypeRow );

	// fog color

	var fogColorRow = new UI.Panel();
	fogColorRow.setDisplay( 'none' );

	var fogColor = new UI.Color().setValue( '#aaaaaa' )
	fogColor.onChange( function () {

		signals.fogColorChanged.dispatch( fogColor.getHexValue() );

	} );

	fogColorRow.add( new UI.Text( 'Fog color' ).setWidth( '90px' ) );
	fogColorRow.add( fogColor );

	container.add( fogColorRow );

	// fog near

	var fogNearRow = new UI.Panel();

	var fogNear = new UI.Number( 1 ).setWidth( '60px' ).setRange( 0, Infinity ).onChange( updateFogParameters );

	fogNearRow.add( new UI.Text( 'Fog near' ).setWidth( '90px' ) );
	fogNearRow.add( fogNear );

	container.add( fogNearRow );

	// fog far

	var fogFarRow = new UI.Panel();

	var fogFar = new UI.Number( 5000 ).setWidth( '60px' ).setRange( 0, Infinity ).onChange( updateFogParameters );

	fogFarRow.add( new UI.Text( 'Fog far' ).setWidth( '90px' ) );
	fogFarRow.add( fogFar );

	container.add( fogFarRow );

	// fog density

	var fogDensityRow = new UI.Panel();

	var fogDensity = new UI.Number( 0.00025 ).setWidth( '60px' ).setRange( 0, 0.1 ).setPrecision( 5 ).onChange( updateFogParameters );

	fogDensityRow.add( new UI.Text( 'Fog density' ).setWidth( '90px' ) );
	fogDensityRow.add( fogDensity );

	container.add( fogDensityRow );

	// skybox
	
	var updateSkybox = function () {
	// TODO: WIP
		var type = skyboxImage.getValue();
		var customTextures = [];
		
		if ( type == 'custom' ) {
			
			skyboxCustomTexturesContainer.setDisplay( '' );
			
			// reload every changed texture
			for ( var i = 0; i < 6; i++ ) {
				
				customTextures.push( skyboxCustomTextures[ i ].getValue() );
				
			}
		
		} else {
		
			skyboxCustomTexturesContainer.setDisplay( 'none' );
			
		}
		
		signals.skyboxChanged.dispatch( type, customTextures.length > 0 ? customTextures : undefined );
		
	};
	
	var updateFogParameters = function () {

		var near = fogNear.getValue();
		var far = fogFar.getValue();
		var density = fogDensity.getValue();

		signals.fogParametersChanged.dispatch( near, far, density );

	};

	var skyboxRow = new UI.Panel();
	var skyboxImage = new UI.Select().setOptions( {

		'none': 'None',
		'orangeclouds': 'Orange Sky',
		'gradient': 'Gradient',
		'grid': 'Grid',
		'chess': 'Chess',
		'custom': 'Custom'

	} ).setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' ).onChange( updateSkybox );
	
	var skyboxCustomTexturesContainer = new UI.Panel().setDisplay( 'none' );
	
	var skyboxCustomTextures = [
		new UI.Texture().setColor( '#444' ).onChange( updateSkybox ),
		new UI.Texture().setColor( '#444' ).onChange( updateSkybox ),
		new UI.Texture().setColor( '#444' ).onChange( updateSkybox ),
		new UI.Texture().setColor( '#444' ).onChange( updateSkybox ),
		new UI.Texture().setColor( '#444' ).onChange( updateSkybox ),
		new UI.Texture().setColor( '#444' ).onChange( updateSkybox )
	];
	
	for ( var i = 0; i < 6; i++ ) {
		
		var panel = new UI.Panel();
		panel.add( new UI.Text( Skybox.prototype.endings[ i ] ).setWidth( '90px' ) );
		panel.add( skyboxCustomTextures[ i ] );
		skyboxCustomTexturesContainer.add( panel );
	
	}

	skyboxRow.add( new UI.Text( 'Skybox' ).setWidth( '90px' ) );
	skyboxRow.add( skyboxImage );
	skyboxRow.add( skyboxCustomTexturesContainer );

	container.add( skyboxRow );
	
	// leapbox
	var leapBoxRow = new UI.Panel();

	var leapBox = new UI.Checkbox( false ).onChange( function( evt ) {

		signals.leapBoxChanged.dispatch( evt.target.checked );
	
	} );

	leapBoxRow.add( new UI.Text( 'LeapBox' ).setWidth( '90px' ) );
	leapBoxRow.add( leapBox );

	container.add( leapBoxRow );
	
	// max velocity

	var maxVelocityRow = new UI.Panel();

	var maxVelocity = new UI.Number( 1 ).setWidth( '60px' ).setRange( 0, Infinity ).onChange( function( evt ) {
		
		var mV = maxVelocity.getValue();
		editor.scene.maxVelocity = mV;
		
		setGravityBehaviour( mV, -editor.scene._gravity.y );
		
	} );

	maxVelocityRow.add( new UI.Text( 'Max velocity' ).setWidth( '90px' ) );
	maxVelocityRow.add( maxVelocity );

	container.add( maxVelocityRow );
	
	// gravity

	var gravityRow = new UI.Panel();

	var gravity = new UI.Number( 16 ).setWidth( '60px' ).setRange( 0, 60 ).onChange( function( evt ) {
		
		// gravity: negate, as y, i.e. (0, -16, 0)
		var g = gravity.getValue();
		var gVec = new THREE.Vector3(0, -g, 0)
		editor.scene._gravity = gVec;
		editor.scene.setGravity( editor.scene._gravity );
		
		setGravityBehaviour( editor.scene.maxVelocity, g );
		
	} );

	gravityRow.add( new UI.Text( 'Gravity' ).setWidth( '90px' ) );
	gravityRow.add( gravity );

	container.add( gravityRow );
	
	// gravity behaviour (gravity and max velocity presets for easy mode)
		
	var gravityBehaviourPresets = {
		
		'Normal': [Infinity, 16],
		'Constant': [10, 60]
		
	}
	
	var gravityBehaviourRow = new UI.Panel();
	var gravityBehaviour = new UI.Select().setOptions( {

		'Normal': 'Normal',
		'Constant': 'Constant'

	} ).setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' )
	gravityBehaviour.onChange( function () {
		
		var gB = gravityBehaviourPresets[gravityBehaviour.getValue()];
		
		var mV = gB[0];
		editor.scene.maxVelocity = mV;
		maxVelocity.setValue( editor.scene.maxVelocity );
		
		var g = gB[1];
		var gVec = new THREE.Vector3(0, -g, 0);
		editor.scene._gravity = gVec;
		editor.scene.setGravity( editor.scene._gravity );
		gravity.setValue( g );

	} );

	gravityBehaviourRow.add( new UI.Text( 'Gravity Behaviour' ).setWidth( '90px' ) );
	gravityBehaviourRow.add( gravityBehaviour );

	container.add( gravityBehaviourRow );
	
	function setGravityBehaviour( maxVel, gravity ) {
		
		for ( var pi in gravityBehaviourPresets ) {
			if ( !gravityBehaviourPresets.hasOwnProperty( pi ) ) continue;
			var p = gravityBehaviourPresets[pi];
			
			if ( p[0] == maxVel && p[1] == gravity ) {
				gravityBehaviour.setValue(pi);
				return;
			}
		}
		
		// it's a custom gravity and/or maxVel value
		gravityBehaviour.setValue( undefined );
		
	}
	
	//
	
	var refreshFogUI = function () {

		var type = fogType.getValue();

		fogColorRow.setDisplay( type === 'None' ? 'none' : '' );
		fogNearRow.setDisplay( type === 'Fog' ? '' : 'none' );
		fogFarRow.setDisplay( type === 'Fog' ? '' : 'none' );
		fogDensityRow.setDisplay( type === 'FogExp2' ? '' : 'none' );

	};
	
	// 1 = visible in easy mode, 2 = visible in advanced mode, not part of this list = visible in both modes
	var propertyVisibilities = {
		'fogNear': 2,
		'fogFar': 2,
		'fogDensity': 2,
		'skyBox' : 2,
		'leapBox': 2,
		'maxVelocity': 2,
		'gravity': 2,
		'gravityBehaviour': 1
	};
	
	function updateRows() {

		var object = editor.selected;

		var properties = {
			'fogNear': fogNearRow,
			'fogFar': fogFarRow,
			'fogDensity': fogDensityRow,
			'skyBox': skyboxRow,
			'leapBox': leapBoxRow,
			'maxVelocity': maxVelocityRow,
			'gravity': gravityRow,
			'gravityBehaviour': gravityBehaviourRow
		};

		for ( var property in properties ) {
		
			var visible = ( workMode == 'advanced' && propertyVisibilities[ property ] == 2) || ( workMode == 'easy' && propertyVisibilities[ property ] == 1 ) || propertyVisibilities[ property ] == undefined
			properties[ property ].setDisplay( visible ? '' : 'none' );

		}

	}
	
	function updateSceneOptionsDisplay( object ) {
	
		var display = object instanceof THREE.Scene ? '' : 'none';
		
		container.setDisplay( display );
		
		//defaultColorRow.setDisplay( display );
		//fogTypeRow.setDisplay( display );
		//skyboxRow.setDisplay( display );
		if ( display == '' ) {
			refreshFogUI();
			if ( skyboxImage.getValue() == 'custom' ) skyboxCustomTexturesContainer.setDisplay( '' );
			
			updateRows();
			
		}
	
	}
	
	
	
	signals.sceneGraphChanged.add( function () {
	
		var scene = editor.scene;
		
		if ( scene.fog ) {

			fogColor.setHexValue( scene.fog.color.getHex() );

			if ( scene.fog instanceof THREE.Fog ) {

				fogType.setValue( "Fog" );
				fogNear.setValue( scene.fog.near );
				fogFar.setValue( scene.fog.far );

			} else if ( scene.fog instanceof THREE.FogExp2 ) {

				fogType.setValue( "FogExp2" );
				fogDensity.setValue( scene.fog.density );

			}

		} else {

			fogType.setValue( "None" );

		}

		refreshFogUI();
		
		if ( scene.skybox ) {

				skyboxImage.setValue( scene.skybox.type );
				
				skyboxCustomTexturesContainer.setDisplay( scene.skybox.type == 'custom' ? '' : 'none' );
				
				if ( scene.skybox.type == 'custom' ) {
				
					for ( var i = 0; i < 6; i++ ) {
						
						if ( scene.skybox.materials[ i ].map.image === undefined ) continue;
						
						skyboxCustomTextures[ i ].setValue( scene.skybox.materials[ i ].map );
					
					}
				
				}

		} else {

			skyboxImage.setValue( "none" );

		}
		
		leapBox.setValue( scene.hasLeapBox === false ? false : true );
		
		if ( scene.maxVelocity ) maxVelocity.setValue( scene.maxVelocity );
		
		if ( scene._gravity ) {
			
			gravity.setValue( -scene._gravity.y );
		
		}
		
		if ( scene.maxVelocity && scene._gravity ) {
			
			setGravityBehaviour( scene.maxVelocity, -scene._gravity.y );
			
		} else {
			
			gravityBehaviour.setValue( 'Normal' );
			
		}
		
		updateSceneOptionsDisplay( editor.selected );
	});
	
	signals.objectSelected.add( function ( object ) {
		
		updateSceneOptionsDisplay( object );

	} );
	

	return container;

}