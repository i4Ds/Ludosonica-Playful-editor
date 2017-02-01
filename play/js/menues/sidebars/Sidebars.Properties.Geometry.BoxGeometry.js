Sidebars.Properties.Geometry.BoxGeometry = function (signals, object, linkProperties) {

    var container = new UI.Panel();

    var geometry = object.geometry;

    var WIDTH_PROP = linkProperties.WIDTH_PROP;
    var HEIGHT_PROP = linkProperties.HEIGHT_PROP;
    var DEPTH_PROP = linkProperties.DEPTH_PROP;

    // width

    var widthRow = new UI.Panel();
    widthRow.setClass("row");
    // check if object property is linked or not, because ui is rebuilt on each object selected event.
    if (object.isInstance) {
        //console.log('new ui', object, object.isLinked[WIDTH_PROP]);
        var linkClassW = object.isLinked[WIDTH_PROP] ? 'linked' : 'link';
        var widthLink = new UI.Text('').setClass('icn icon-link ' + linkClassW).onClick(function () {

            if (this.dom.className.indexOf('linked') === -1) {
                object.isLinked[WIDTH_PROP] = true;
                this.setClass('icn icon-link linked');

                // update to template value
                var template = editor.templateManager.getTemplateOfInstance(object.id);
                var value = template.geometry.parameters.width;
                width.setValue(value);

                update();
            }
        });

        widthRow.add(widthLink);
    }

    var width = new UI.Number(geometry.parameters.width).onChange(function () {

        if (object.isInstance) {
            object.isLinked[WIDTH_PROP] = false;
            widthLink.setClass('icn icon-link link');
            //console.log('on change', object, object.isLinked[WIDTH_PROP]);
        }
        update();
    });

    widthRow.add(new UI.Text('Width').setWidth('90px'));
    widthRow.add(width);

    container.add(widthRow);



    // height

    var heightRow = new UI.Panel();
    heightRow.setClass("row");
    // check if object property is linked or not, because ui is rebuilt on each object selected event.
    if (object.isInstance) {

        var linkClassH = object.isLinked[HEIGHT_PROP] ? 'linked' : 'link';
        var heightLink = new UI.Text('').setClass('icn icon-link ' + linkClassH).onClick(function () {

            if (this.dom.className.indexOf('linked') === -1) {
                object.isLinked[HEIGHT_PROP] = true;
                this.setClass('icn icon-link linked');

                // update to template value
                var template = editor.templateManager.getTemplateOfInstance(object.id);
                var value = template.geometry.parameters.height;
                height.setValue(value);

                update();
            }
        });

        heightRow.add(heightLink);
    }
    var height = new UI.Number(geometry.parameters.height).onChange(function () {

        if (object.isInstance) {
            object.isLinked[HEIGHT_PROP] = false;
            heightLink.setClass('icn icon-link link');
        }
        update();
    });

    heightRow.add(new UI.Text('Height').setWidth('90px'));
    heightRow.add(height);

    container.add(heightRow);



    // depth

    var depthRow = new UI.Panel();
    depthRow.setClass("row");
    // check if object property is linked or not, because ui is rebuilt on each object selected event.
    if (object.isInstance) {

        var linkClassD = object.isLinked[DEPTH_PROP] ? 'linked' : 'link';
        var depthLink = new UI.Text('').setClass('icn icon-link ' + linkClassD).onClick(function () {

            if (this.dom.className.indexOf('linked') === -1) {
                object.isLinked[DEPTH_PROP] = true;
                this.setClass('icn icon-link linked');

                // update to template value
                var template = editor.templateManager.getTemplateOfInstance(object.id);
                var value = template.geometry.parameters.depth;
                depth.setValue(value);

                update();
            }
        });

        depthRow.add(depthLink);
    }
    var depth = new UI.Number(geometry.parameters.depth).onChange(function () {

        if (object.isInstance) {
            object.isLinked[DEPTH_PROP] = false;
            depthLink.setClass('icn icon-link link');
        }
        update();
    });

    depthRow.add(new UI.Text('Depth').setWidth('90px'));
    depthRow.add(depth);

    container.add(depthRow);



    // widthSegments (disabled)

    var widthSegmentsRow = new UI.Panel();
    widthSegmentsRow.setClass("row");
    var widthSegments = new UI.Integer(geometry.parameters.widthSegments).setRange(1, Infinity).onChange(update);

    widthSegmentsRow.add(new UI.Text('Width segments').setWidth('90px'));
    widthSegmentsRow.add(widthSegments);

    widthSegmentsRow.setDisplay('none');

    container.add(widthSegmentsRow);


    // heightSegments (disabled)

    var heightSegmentsRow = new UI.Panel();
    heightSegmentsRow.setClass("row");
    var heightSegments = new UI.Integer(geometry.parameters.heightSegments).setRange(1, Infinity).onChange(update);

    heightSegmentsRow.add(new UI.Text('Height segments').setWidth('90px'));
    heightSegmentsRow.add(heightSegments);

    heightSegmentsRow.setDisplay('none');

    container.add(heightSegmentsRow);


    // depthSegments (disabled)

    var depthSegmentsRow = new UI.Panel();
    depthSegmentsRow.setClass("row");
    var depthSegments = new UI.Integer(geometry.parameters.depthSegments).setRange(1, Infinity).onChange(update);

    depthSegmentsRow.add(new UI.Text('Height segments').setWidth('90px'));
    depthSegmentsRow.add(depthSegments);

    depthSegmentsRow.setDisplay('none');

    container.add(depthSegmentsRow);

    //

    function update() {

        // UPDATE INSTANCES IF TEMPLATE CHANGED
        if (object.isTemplate) {

            var instObjects = editor.templateManager.getInstancesOfTemplate(object.id);

            for (var i = 0; i < instObjects.length; i++) {

                var objWidth = instObjects[i].geometry.parameters.width;
                var objHeight = instObjects[i].geometry.parameters.height;
                var objDepth = instObjects[i].geometry.parameters.depth;

                if(instObjects[i].isLinked[WIDTH_PROP]){
                    objWidth = width.getValue();
                }
                if(instObjects[i].isLinked[HEIGHT_PROP]){
                    objHeight = height.getValue();
                }
                if(instObjects[i].isLinked[DEPTH_PROP]){
                    objDepth = depth.getValue();
                }

                updateGeometry(instObjects[i], objWidth, objHeight, objDepth);
            }

        }

        // UPDATE NORMAL OBJECT
        updateGeometry(object, width.getValue(), height.getValue(), depth.getValue());

    }


    function updateGeometry(object, width, height, depth) {

        object.geometry.dispose();

        object.geometry = new THREE.BoxGeometry(
            width,
            height,
            depth,
            widthSegments.getValue(),
            heightSegments.getValue(),
            depthSegments.getValue()
        );

        object.geometry.buffersNeedUpdate = true;
        object.geometry.computeBoundingSphere();

        signals.objectChanged.dispatch(object);

    }

    return container;

};
