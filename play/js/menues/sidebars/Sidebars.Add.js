Sidebars.Add = function ( editor ) {

	// new

	var signals = editor.signals;

	var container = new UI.Panel();

	$("<h2/>").html("Add Object").appendTo(container.dom);

	var outliner = new UI.FancySelect().setId('outliner');
	outliner.onChange(function () {

	});
	container.add(outliner);

	editor.signals.themeLoaded.add( function(){

		var options = [];
		var prefabCount = {};

		(function initPrefabCount (prefabs) {

			if (prefabs) {

				var prefabs = Object.keys(prefabs);
				for (var x = 0; x < prefabs.length; x++) {
					prefabCount[prefabs[x]] = 0;
				}

			}
		})(editor.theme.currentTheme.prefabsList);

			// populate with prefabs
		(function addObjects (prefabs, pad) {

			if (prefabs) {

				var prefabs = Object.keys(prefabs);
				for (var x = 0; x < prefabs.length; x++) {

					var name = prefabs[x];

					var html = '</span> ' + '<span class="objNameDisplay">' + name + '</span>';
					html += ' <span class="icn icon-add" title="add instance of this template"></span>';

					options.push({value: name, html: html});

				}

				outliner.setOptions(options);
			}
		})(editor.theme.currentTheme.prefabsList, '&nbsp;&nbsp;&nbsp;');

		for (var x = 0; x < options.length; x++) {

			var child = $(outliner.dom.children[x]);
			var addBtn = child.find('.icon-add');

			if(addBtn.length > 0) $(addBtn[0]).click(function ( el ){

				var p = editor.theme.currentTheme.getPrefab(this.value);

				if (p.geometry.boundingBox == undefined) p.geometry.computeBoundingBox();
				p.position.y = p.geometry.boundingBox.size().y / 2;

				p.name = this.value + prefabCount[this.value];

				editor.addObject(p);
				editor.select(p);

				prefabCount[this.value] += 1;

			}.bind(options[x]));
		}

	});


	signals.menuButtonClicked.add( function(name) {
		if(name=="add")
		{
			// Show this sidebar panel when add menu button is clicked
			$(container.dom).toggle(200);
			editor.deselect();
		}
		else {
			$(container.dom).hide();
		}
	});


	return container;
};
