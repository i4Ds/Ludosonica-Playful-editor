Sidebars.Properties.Geometry = function (editor) {

    var signals = editor.signals;

    // 1.feb.17 todo template link functionality is only implemented for box, cylinder and sphere geometry because they are currently working
    // add instance properties for box geometry
    var BOX_PROPS = {
        WIDTH_PROP: 'rect_width',
        HEIGHT_PROP: 'rect_height',
        DEPTH_PROP: 'rect_depth'
    };
    editor.templateManager.addLinkProperty(BOX_PROPS.WIDTH_PROP);
    editor.templateManager.addLinkProperty(BOX_PROPS.HEIGHT_PROP);
    editor.templateManager.addLinkProperty(BOX_PROPS.DEPTH_PROP);

    // add instance properties for cylinder geometry
    var CYLINDER_PROPS = {
        RADIUS_TOP_PROP: 'cylinder_radius_top',
        RADIUS_BOTTOM_PROP: 'cylinder_radius_bottom',
        HEIGHT_PROP: 'cylinder_height',
        RADIAL_SEG_PROP: 'cylinder_radial_seg',
        HEIGHT_SEG_PROP: 'cylinder_height_seg',
        OPEN_PROP: 'cylinder_open'
    };
    editor.templateManager.addLinkProperty(CYLINDER_PROPS.RADIUS_TOP_PROP);
    editor.templateManager.addLinkProperty(CYLINDER_PROPS.RADIUS_BOTTOM_PROP);
    editor.templateManager.addLinkProperty(CYLINDER_PROPS.HEIGHT_PROP);
    editor.templateManager.addLinkProperty(CYLINDER_PROPS.RADIAL_SEG_PROP);
    editor.templateManager.addLinkProperty(CYLINDER_PROPS.HEIGHT_SEG_PROP);
    editor.templateManager.addLinkProperty(CYLINDER_PROPS.OPEN_PROP);

    // add instance properties for sphere geometry
    var SPHERE_PROPS = {
        RADIUS_PROP: 'sphere_radius'
    };
    editor.templateManager.addLinkProperty(SPHERE_PROPS.RADIUS_PROP);


    var container = new UI.Panel();
    container.setDisplay('none');
    container.setClass("Panel advanced");

    $("<h3/>", {html: "Geometry"}).appendTo(container.dom);

    // uuid (disabled)

    var geometryUUIDRow = new UI.Panel();
    var geometryUUID = new UI.Input().setWidth('115px').setColor('#444').setFontSize('12px').setDisabled(true);
    var geometryUUIDRenew = new UI.Button('⟳').setMarginLeft('7px').onClick(function () {

        geometryUUID.setValue(THREE.Math.generateUUID());

        editor.selected.geometry.uuid = geometryUUID.getValue();

    });

    geometryUUIDRow.add(new UI.Text('UUID').setWidth('90px'));
    geometryUUIDRow.add(geometryUUID);
    geometryUUIDRow.add(geometryUUIDRenew);

    geometryUUIDRow.setDisplay('none');

    container.add(geometryUUIDRow);

    // name (disabled)

    var geometryNameRow = new UI.Panel();
    var geometryName = new UI.Input().setWidth('150px').setColor('#444').setFontSize('12px').onChange(function () {

        editor.setGeometryName(editor.selected.geometry, geometryName.getValue());

    });

    geometryNameRow.add(new UI.Text('Name').setWidth('90px'));
    geometryNameRow.add(geometryName);

    geometryNameRow.setDisplay('none');

    container.add(geometryNameRow);

    // class (disabled)

    var geometryTypeRow = new UI.Panel();
    var geometryType = new UI.Text().setWidth('150px').setColor('#444').setFontSize('12px');

    geometryTypeRow.add(new UI.Text('Type').setWidth('90px'));
    geometryTypeRow.add(geometryType);

    geometryTypeRow.setDisplay('none');

    container.add(geometryTypeRow);

    // vertices (disabled)

    var geometryVerticesRow = new UI.Panel();
    var geometryVertices = new UI.Text().setColor('#444').setFontSize('12px');

    geometryVerticesRow.add(new UI.Text('Vertices').setWidth('90px'));
    geometryVerticesRow.add(geometryVertices);

    geometryVerticesRow.setDisplay('none');

    container.add(geometryVerticesRow);

    // faces (disabled)

    var geometryFacesRow = new UI.Panel();
    var geometryFaces = new UI.Text().setColor('#444').setFontSize('12px');

    geometryFacesRow.add(new UI.Text('Faces').setWidth('90px'));
    geometryFacesRow.add(geometryFaces);

    geometryFacesRow.setDisplay('none');

    container.add(geometryFacesRow);

    // parameters

    var parameters;

    //

    function build() {

        var object = editor.selected;

        if (object && object.geometry) {

            var geometry = object.geometry;

            container.setDisplay('block');

            geometryType.setValue(editor.getGeometryType(object.geometry));

            updateFields(geometry);

            //

            if (parameters !== undefined) {

                container.remove(parameters);
                parameters = undefined;

            }

            if (geometry instanceof THREE.BoxGeometry) {

                parameters = new Sidebars.Properties.Geometry.BoxGeometry(signals, object, BOX_PROPS);
                container.add(parameters);

            } else if (geometry instanceof THREE.CircleGeometry) {

                parameters = new Sidebars.Properties.Geometry.CircleGeometry(signals, object);
                container.add(parameters);

            } else if (geometry instanceof THREE.CylinderGeometry) {

                parameters = new Sidebars.Properties.Geometry.CylinderGeometry(signals, object, CYLINDER_PROPS);
                container.add(parameters);

            } else if (geometry instanceof THREE.SphereGeometry) {

                parameters = new Sidebars.Properties.Geometry.SphereGeometry(signals, object, SPHERE_PROPS);
                container.add(parameters);

            } else if (geometry instanceof THREE.IcosahedronGeometry) {

                parameters = new Sidebars.Properties.Geometry.IcosahedronGeometry(signals, object);
                container.add(parameters);

            } else if (geometry instanceof THREE.PlaneGeometry) {

                parameters = new Sidebars.Properties.Geometry.PlaneGeometry(signals, object);
                container.add(parameters);

            } else if (geometry instanceof THREE.TorusGeometry) {

                parameters = new Sidebars.Properties.Geometry.TorusGeometry(signals, object);
                container.add(parameters);

            } else if (geometry instanceof THREE.TorusKnotGeometry) {

                parameters = new Sidebars.Properties.Geometry.TorusKnotGeometry(signals, object);
                container.add(parameters);

            }

        } else {

            container.setDisplay('none');

        }

    }

    signals.objectSelected.add(build);
    //signals.objectChanged.add( build );

    //

    function updateFields(geometry) {

        geometryUUID.setValue(geometry.uuid);
        geometryName.setValue(geometry.name);

        if (geometry instanceof THREE.Geometry) {

            geometryVertices.setValue(geometry.vertices.length);
            geometryFaces.setValue(geometry.faces.length);

        } else if (geometry instanceof THREE.BufferGeometry) {

            geometryVertices.setValue(geometry.attributes.position.array.length / 3);

            if (geometry.attributes.index !== undefined) {

                geometryFaces.setValue(geometry.attributes.index.array.length / 3);

            } else {

                geometryFaces.setValue(geometry.attributes.position.array.length / 9);

            }

        }

    }

    return container;

};
