Sidebars.Scene = function ( editor ) {

	var signals = editor.signals;

	var tmplManager = editor.templateManager;

	var container = new UI.Panel();
	container.setDisplay( 'none' );

	$("<h2/>").html("Scene").appendTo(container.dom);

	var outliner = new UI.FancySelect().setId( 'outliner' );
	outliner.onChange( function () {

		editor.selectById( parseInt( outliner.getValue() ) );

	} );
	$(outliner.dom).addClass('scrollpanel');
	container.add( outliner );

	// events

	signals.sceneGraphChanged.add( function () {

		var scene = editor.scene;
		var sceneType = editor.getObjectType( scene );

		var options = [];

		var sceneName = scene.name || "Scene";
		options.push( { value: scene.id, html: '<span class="type ' + sceneType + '"></span> ' + sceneName } );

		( function addObjects( objects, pad ) {

			for ( var i = 0, l = objects.length; i < l; i ++ ) {

				var object = objects[ i ];

				if ( editor.omittedObjects.indexOf( object.name ) === -1 ) {

					var objectType = editor.getObjectType( object );

					var html;

					// add icons for object instances if instance
					if( object.isInstance ){

						html = ' <span class="icn left icon-template-small" title="Duplicate object"></span>';
						html += '<span class="type ' + objectType + '"></span> ' + '<span class="objNameDisplay">' + object.name + '</span>';

					} else {

						// add name of object in any case
						html = pad + '<span class="type ' + objectType + '"></span> ' + '<span class="objNameDisplay">' + object.name + '</span>';

					}

					// add icons to delete, duplicate and generate template if object is deletable
					if( editor.notDeletableObjects.indexOf( object.name ) === -1){

						html += ' <span class="icn-delete icon-del-small" title="Delete object"></span>';

						if( !object.isInstance ){

							html += ' <span class="icn icon-dupli-small" title="Duplicate object"></span>';
							html += ' <span style="height: 100%"><span><span class="icn icon-add-template" title="Duplicate object as template"></span></span>';

						}

					}


					/*if ( object instanceof THREE.Mesh ) {

						var geometry = object.geometry;
						var material = object.material;

						var geometryType = editor.getGeometryType( geometry );
						var materialType = editor.getMaterialType( material );

						html += ' <span class="type ' + geometryType + '"></span> ' + geometry.name;
						html += ' <span class="type ' + materialType + '"></span> ' + material.name;

					}*/

					options.push( { value: object.id, html: html } );

					addObjects( object.children, pad + '&nbsp;&nbsp;&nbsp;' );

				}

			}

		} )( scene.children, '&nbsp;&nbsp;&nbsp;' );

		outliner.setOptions( options );

		if ( editor.selected !== null ) {

			outliner.setValue( editor.selected.id );

		}

		for ( var x = 0; x < options.length; x++ ) {
			var child = $(outliner.dom.children[ x ]);
			var duplicateBtn = child.find('.icon-dupli-small');
			var deleteBtn = child.find('.icon-del-small');
			var temlateBtn = child.find('.icon-add-template');

			if ( duplicateBtn.length > 0 ) $( duplicateBtn[0] ).click( function ( el ) {

				var object = editor.scene.getObjectById( this.valueOf(), true );

				if ( object.parent === undefined ) return; // avoid cloning the camera or scene

				var clone = object.clone();
				clone.material = clone.material.clone();

				editor.addObject( clone );
				editor.select( clone );

			}.bind(options[ x ].value));

			if ( deleteBtn.length > 0 ) $( deleteBtn[0] ).click( function ( el ) {

				var object = editor.scene.getObjectById( this.valueOf(), true );

				var parent = object.parent;

				if( object.isInstance ){
					tmplManager.removeInstance( object );

					signals.templateDeleted.dispatch();
				}

				editor.removeObject( object );

				editor.select( parent );

			}.bind(options[ x ].value));

			if ( temlateBtn.length > 0 ) $( temlateBtn[0] ).click( function ( el ) {

				var object = editor.scene.getObjectById( this.valueOf(), true );

				if ( object.parent === undefined ) return; // avoid cloning the camera or scene

				var clone = object.clone();
				clone.material = clone.material.clone();

				editor.templateManager.addTemplate( clone, object );

				// dirty fix to open template menu after adding a template
				var timeout;
				clearTimeout(timeout);

				timeout = setTimeout(function () {
					signals.menuButtonClicked.dispatch("add-template", "added");
				}, 50);
				// end dirty


			}.bind(options[ x ].value));
		}

	} );

	signals.objectSelected.add( function ( object ) {

		outliner.setValue( object !== null ? object.id : null );

	} );


	signals.menuButtonClicked.add( function(name) {

		if(name=="scene-properties")
		{

			// Show this sidebar panel when scene button is clicked
			$(container.dom).toggle(200);
			editor.deselect();
		}
		else {
			$(container.dom).hide();
		}

	});

	$(container.dom).addClass('top');

	return container;

};
