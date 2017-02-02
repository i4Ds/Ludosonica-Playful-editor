Sidebars.Properties.Object3D = function (editor) {

    var signals = editor.signals;


    // template link / unlink functionality is only added to properties: POSITION, ROTATION, SCALE
    // add instance properties
    //var NAME_PROP = 'color';
    var PARENT_PROP = 'obj_parent';
    //var POSITION_PROP = 'obj_position';
    var ROTATION_PROP = 'obj_rotation';
    var SCALE_PROP = 'obj_scale';
    //editor.templateManager.addLinkProperty(NAME_PROP);
    editor.templateManager.addLinkProperty(PARENT_PROP);
    //editor.templateManager.addLinkProperty(POSITION_PROP);
    editor.templateManager.addLinkProperty(ROTATION_PROP);
    editor.templateManager.addLinkProperty(SCALE_PROP);


    var container = new UI.Panel();
    container.setDisplay('none');

    $("<h3/>", {html: "Object"}).appendTo(container.dom);
    var objectType = new UI.Text().setClass("objectType");
    container.add(objectType);

    // uuid

    var objectUUIDRow = new UI.Panel();
    objectUUIDRow.setClass("row");
    var objectUUID = new UI.Input().setWidth('115px').setColor('#444').setFontSize('12px').setDisabled(true);
    var objectUUIDRenew = new UI.Button('⟳').setMarginLeft('7px').onClick(function () {

        objectUUID.setValue(THREE.Math.generateUUID());

        editor.selected.uuid = objectUUID.getValue();

    });

    objectUUIDRow.add(new UI.Text('UUID').setWidth('90px'));
    objectUUIDRow.add(objectUUID);
    objectUUIDRow.add(objectUUIDRenew);

    objectUUIDRow.setDisplay('none');

    container.add(objectUUIDRow);


    // name

    var objectNameRow = new UI.Panel();
    objectNameRow.setClass("row");
    //var nameLink = new UI.Text('').setClass('icn icon-link').onClick(function () {
    //
    //	if (this.dom.className.indexOf('linked') === -1) {
    //		editor.selected.isLinked[NAME_PROP] = true;
    //		this.setClass('icn icon-link linked');
    //
    //		// update to template value
    //		var template = editor.templateManager.getTemplateOfInstance(object.id);
    //		var value = template.name;
    //		objectName.setValue(value);
    //
    //		update();
    //	}
    //});
    var objectName = new UI.Input().setWidth('150px').setColor('#444').setFontSize('12px').onChange(function () {

        //if (editor.selected.isInstance) {
        //	editor.selected.isLinked[NAME_PROP] = false;
        //	nameLink.setClass('icn icon-link link');
        //}
        editor.setObjectName(editor.selected, objectName.getValue());

    });

    //objectNameRow.add( nameLink );
    objectNameRow.add(new UI.Text('Name').setWidth('90px'));
    objectNameRow.add(objectName);


    container.add(objectNameRow);


    // PARENT

    var objectParentRow = new UI.Panel();
    objectParentRow.setClass("row advanced");
    //var parentLink = new UI.Text('').setClass('icn icon-link').onClick(function () {
    //
    //    if (this.dom.className.indexOf('linked') === -1) {
    //        editor.selected.isLinked[PARENT_PROP] = true;
    //        this.setClass('icn icon-link linked');
    //
    //        // update to template value
    //        var template = editor.templateManager.getTemplateOfInstance(editor.selected.id);
    //        var value = template.parent.id;
    //        objectParent.setValue(value);
    //
    //        update();
    //    }
    //});
    var objectParent = new UI.Select().setWidth('150px').setColor('#444').setFontSize('12px').onChange(function () {

        //if (editor.selected.isInstance) {
        //    editor.selected.isLinked[PARENT_PROP] = false;
        //    parentLink.setClass('icn icon-link link');
        //}
        update();
    });

    //objectParentRow.add(parentLink);
    objectParentRow.add(new UI.Text('Parent').setWidth('90px'));
    objectParentRow.add(objectParent);

    container.add(objectParentRow);
    container.add(objectParentRow);

    signals.objectSelected.add(function (object) {

        if (object && (object.isInstance || object.isTemplate) ) {

            objectParentRow.setClass('disabled');

        } else {

            objectParentRow.setClass("row advanced");
        }

    });

    // POSITION

    var objectPositionRow = new UI.Panel();
    objectPositionRow.setClass("row advanced");
    //var positionLink = new UI.Text('').setClass('icn icon-link').onClick(updatePositionLink);
    var objectPositionX = new UI.Number().setWidth('50px').setColor('red').onChange(updatePosition);
    var objectPositionY = new UI.Number().setWidth('50px').setColor('green').onChange(updatePosition);
    var objectPositionZ = new UI.Number().setWidth('50px').setColor('blue').onChange(updatePosition);
    var objectPositionXLabel = new UI.Text('X').setWidth('10px').setColor('red');
    var objectPositionYLabel = new UI.Text('Y').setWidth('10px').setColor('green');
    var objectPositionZLabel = new UI.Text('Z').setWidth('10px').setColor('blue');

    //objectPositionRow.add(positionLink);
    objectPositionRow.add(new UI.Text('Position').setWidth('90px'));
    objectPositionRow.add(objectPositionXLabel, objectPositionX,
        objectPositionYLabel, objectPositionY,
        objectPositionZLabel, objectPositionZ);

    container.add(objectPositionRow);


    function updatePosition() {

        //if (editor.selected.isInstance) {
        //    editor.selected.isLinked[POSITION_PROP] = false;
        //    positionLink.setClass('icn icon-link link');
        //}
        update();
    }

    //function updatePositionLink() {
    //
    //    if (this.dom.className.indexOf('linked') === -1) {
    //        editor.selected.isLinked[POSITION_PROP] = true;
    //        this.setClass('icn icon-link linked');
    //
    //        // update ui inputs to template value
    //        var template = editor.templateManager.getTemplateOfInstance(editor.selected.id);
    //
    //        objectPositionX.setValue(template.position.x);
    //        objectPositionY.setValue(template.position.y);
    //        objectPositionZ.setValue(template.position.z);
    //
    //        update();
    //    }
    //}

    signals.objectSelected.add(function (object) {

        if (object && object.isTemplate) {

            $(objectPositionX.dom).prop('disabled', true);
            $(objectPositionY.dom).prop('disabled', true);
            $(objectPositionZ.dom).prop('disabled', true);

            $(objectPositionRow.dom).addClass('inactive');

        } else {

            $(objectPositionX.dom).prop('disabled', false);
            $(objectPositionY.dom).prop('disabled', false);
            $(objectPositionZ.dom).prop('disabled', false);

            $(objectPositionRow.dom).removeClass('inactive');
        }

    });


    // ROTATION

    var objectRotationRow = new UI.Panel();
    objectRotationRow.setClass("row advanced");
    var rotationLink = new UI.Text('').setClass('icn icon-link').onClick(updateRotationLink);
    var objectRotationX = new UI.Number().setWidth('50px').setColor('red').onChange(updateRotation);
    var objectRotationY = new UI.Number().setWidth('50px').setColor('green').onChange(updateRotation);
    var objectRotationZ = new UI.Number().setWidth('50px').setColor('blue').onChange(updateRotation);
    var objectRotationXLabel = new UI.Text('X').setWidth('10px').setColor('red');
    var objectRotationYLabel = new UI.Text('Y').setWidth('10px').setColor('green');
    var objectRotationZLabel = new UI.Text('Z').setWidth('10px').setColor('blue');

    objectRotationRow.add(rotationLink);
    objectRotationRow.add(new UI.Text('Rotation').setWidth('90px'));
    objectRotationRow.add(objectRotationXLabel, objectRotationX,
        objectRotationYLabel, objectRotationY,
        objectRotationZLabel, objectRotationZ);

    container.add(objectRotationRow);

    function updateRotation() {

        if (editor.selected.isInstance) {
            editor.selected.isLinked[ROTATION_PROP] = false;
            rotationLink.setClass('icn icon-link link');
        }
        update();
    }

    function updateRotationLink() {

        if (this.dom.className.indexOf('linked') === -1) {
            editor.selected.isLinked[ROTATION_PROP] = true;
            this.setClass('icn icon-link linked');

            // update ui inputs to template value
            var template = editor.templateManager.getTemplateOfInstance(editor.selected.id);

            objectRotationX.setValue(template.rotation.x);
            objectRotationY.setValue(template.rotation.y);
            objectRotationZ.setValue(template.rotation.z);

            update();
        }
    }


    // scale all

    var objectScaleAllRow = new UI.Panel();
    objectScaleAllRow.setClass("row advanced");
    var objectScaleLock = new UI.Checkbox();

    objectScaleAllRow.add(new UI.Text('Scale all').setWidth('90px'));
    objectScaleAllRow.add(objectScaleLock);

    objectScaleAllRow.setDisplay('none');

    container.add(objectScaleAllRow);


    // SCALE separate

    var objectScaleRow = new UI.Panel();
    objectScaleRow.setClass("row advanced");
    var scaleLink = new UI.Text('').setClass('icn icon-link').onClick(updateScaleLink);
    var objectScaleX = new UI.Number(1).setWidth('50px').setColor('red').onChange(updateScaleX);
    var objectScaleY = new UI.Number(1).setWidth('50px').setColor('green').onChange(updateScaleY);
    var objectScaleZ = new UI.Number(1).setWidth('50px').setColor('blue').onChange(updateScaleZ);
    var objectScaleXLabel = new UI.Text('X').setWidth('10px').setColor('red');
    var objectScaleYLabel = new UI.Text('Y').setWidth('10px').setColor('green');
    var objectScaleZLabel = new UI.Text('Z').setWidth('10px').setColor('blue');

    objectScaleRow.add(scaleLink);
    objectScaleRow.add(new UI.Text('Scale').setWidth('90px'));
    objectScaleRow.add(objectScaleXLabel, objectScaleX,
        objectScaleYLabel, objectScaleY,
        objectScaleZLabel, objectScaleZ);

    objectScaleRow.setDisplay('none');

    container.add(objectScaleRow);

    function updateScaleLink() {

        if (this.dom.className.indexOf('linked') === -1) {
            editor.selected.isLinked[SCALE_PROP] = true;
            this.setClass('icn icon-link linked');

            // update ui inputs to template value
            var template = editor.templateManager.getTemplateOfInstance(editor.selected.id);

            objectScaleX.setValue(template.scale.x);
            objectScaleY.setValue(template.scale.y);
            objectScaleZ.setValue(template.scale.z);

            update();
        }
    }


    // fov

    var objectFovRow = new UI.Panel();
    objectFovRow.setClass("row advanced");
    var objectFov = new UI.Number().onChange(update);

    objectFovRow.add(new UI.Text('Fov').setWidth('90px'));
    objectFovRow.add(objectFov);

    container.add(objectFovRow);

    // near

    var objectNearRow = new UI.Panel();
    objectNearRow.setClass("row advanced");
    var objectNear = new UI.Number().onChange(update);

    objectNearRow.add(new UI.Text('Near').setWidth('90px'));
    objectNearRow.add(objectNear);

    container.add(objectNearRow);

    // far

    var objectFarRow = new UI.Panel();
    objectFarRow.setClass("row advanced");
    var objectFar = new UI.Number().onChange(update);

    objectFarRow.add(new UI.Text('Far').setWidth('90px'));
    objectFarRow.add(objectFar);

    container.add(objectFarRow);

    // intensity

    var objectIntensityRow = new UI.Panel();
    objectIntensityRow.setClass("row advanced");
    var objectIntensity = new UI.Number().setRange(0, Infinity).onChange(update);

    objectIntensityRow.add(new UI.Text('Intensity').setWidth('90px'));
    objectIntensityRow.add(objectIntensity);

    container.add(objectIntensityRow);

    // color

    var objectColorRow = new UI.Panel();
    objectColorRow.setClass("row");
    var objectColor = new UI.Color().onChange(update);

    objectColorRow.add(new UI.Text('Color').setWidth('90px'));
    objectColorRow.add(objectColor);

    container.add(objectColorRow);

    // ground color

    var objectGroundColorRow = new UI.Panel();
    objectGroundColorRow.setClass("row advanced");
    var objectGroundColor = new UI.Color().onChange(update);

    objectGroundColorRow.add(new UI.Text('Ground color').setWidth('90px'));
    objectGroundColorRow.add(objectGroundColor);

    container.add(objectGroundColorRow);

    // distance

    var objectDistanceRow = new UI.Panel();
    objectDistanceRow.setClass("row advanced");
    var objectDistance = new UI.Number().setRange(0, Infinity).onChange(update);

    objectDistanceRow.add(new UI.Text('Distance').setWidth('90px'));
    objectDistanceRow.add(objectDistance);

    container.add(objectDistanceRow);

    // angle

    var objectAngleRow = new UI.Panel();
    objectAngleRow.setClass("row advanced");
    var objectAngle = new UI.Number().setPrecision(3).setRange(0, Math.PI / 2).onChange(update);

    objectAngleRow.add(new UI.Text('Angle').setWidth('90px'));
    objectAngleRow.add(objectAngle);

    container.add(objectAngleRow);

    // exponent

    var objectExponentRow = new UI.Panel();
    objectExponentRow.setClass("row advanced");
    var objectExponent = new UI.Number().setRange(0, Infinity).onChange(update);

    objectExponentRow.add(new UI.Text('Exponent').setWidth('90px'));
    objectExponentRow.add(objectExponent);

    container.add(objectExponentRow);

    // visible

    var objectVisibleRow = new UI.Panel();
    objectVisibleRow.setClass("row advanced");
    var objectVisible = new UI.Checkbox().onChange(update);

    objectVisibleRow.add(new UI.Text('Visible').setWidth('90px'));
    objectVisibleRow.add(objectVisible);

    objectVisibleRow.setDisplay('none');

    container.add(objectVisibleRow);

    // user data

    var objectUserDataRow = new UI.Panel();
    objectUserDataRow.setClass("row advanced");
    var objectUserData = new UI.TextArea().setWidth('150px').setHeight('40px').setColor('#444').setFontSize('12px').onChange(update);
    objectUserData.onKeyUp(function () {

        try {

            JSON.parse(objectUserData.getValue());
            objectUserData.setBorderColor('#ccc');
            objectUserData.setBackgroundColor('');

        } catch (error) {

            objectUserData.setBorderColor('#f00');
            objectUserData.setBackgroundColor('rgba(255,0,0,0.25)');

        }

    });

    objectUserDataRow.add(new UI.Text('User data').setWidth('90px'));
    objectUserDataRow.add(objectUserData);

    objectUserDataRow.setDisplay('none');

    container.add(objectUserDataRow);


    //

    function updateScaleX() {

        var object = editor.selected;

        if (object.isInstance) {
            object.isLinked[SCALE_PROP] = false;
            scaleLink.setClass('icn icon-link link');
        }

        if (objectScaleLock.getValue() === true) {

            var scale = objectScaleX.getValue() / object.scale.x;

            objectScaleY.setValue(objectScaleY.getValue() * scale);
            objectScaleZ.setValue(objectScaleZ.getValue() * scale);

        }

        update();

    }

    function updateScaleY() {

        var object = editor.selected;

        if (object.isInstance) {
            object.isLinked[SCALE_PROP] = false;
            scaleLink.setClass('icn icon-link link');
        }

        if (objectScaleLock.getValue() === true) {

            var scale = objectScaleY.getValue() / object.scale.y;

            objectScaleX.setValue(objectScaleX.getValue() * scale);
            objectScaleZ.setValue(objectScaleZ.getValue() * scale);

        }

        update();

    }

    function updateScaleZ() {

        var object = editor.selected;

        if (object.isInstance) {
            object.isLinked[SCALE_PROP] = false;
            scaleLink.setClass('icn icon-link link');
        }

        if (objectScaleLock.getValue() === true) {

            var scale = objectScaleZ.getValue() / object.scale.z;

            objectScaleX.setValue(objectScaleX.getValue() * scale);
            objectScaleY.setValue(objectScaleY.getValue() * scale);

        }

        update();

    }


    function update() {

        var object = editor.selected;

        // UPDATE INSTANCE OF TEMPLATE
        if (object.isTemplate) {

            var instObjects = editor.templateManager.getInstancesOfTemplate(object.id);

            for (var i = 0; i < instObjects.length; i++) {

                updateObject(instObjects[i], true);

            }
        }

        updateObject(object, false);
    }


    function updateObject(object, isInstance) {

        if (object !== null) {

            if ((object.parent !== undefined) && (!isInstance || ( isInstance && object.isLinked[PARENT_PROP] ))) {

                var newParentId = parseInt(objectParent.getValue());

                if (object.parent.id !== newParentId && object.id !== newParentId) {

                    editor.parent(object, editor.scene.getObjectById(newParentId, true));

                }

            }

            // POSITION
            if (!isInstance) {
                object.position.x = objectPositionX.getValue();
                object.position.y = objectPositionY.getValue();
                object.position.z = objectPositionZ.getValue();
            }

            // ROTATION
            if ((!isInstance || ( isInstance && object.isLinked[ROTATION_PROP] )) && object.rotation) {
                object.rotation.x = objectRotationX.getValue();
                object.rotation.y = objectRotationY.getValue();
                object.rotation.z = objectRotationZ.getValue();
            }

            // SCALE
            if ((!isInstance || ( isInstance && object.isLinked[SCALE_PROP] )) && object.scale) {
                object.scale.x = objectScaleX.getValue();
                object.scale.y = objectScaleY.getValue();
                object.scale.z = objectScaleZ.getValue();
            }

            if (!isInstance || object.visible) {
                object.visible = objectVisible.getValue();
            }


            // ***** all the stuff below is disabled in the user interface anyway *****

            if (object.fov !== undefined) {

                object.fov = objectFov.getValue();
                object.updateProjectionMatrix();

            }

            if (object.near !== undefined) {

                object.near = objectNear.getValue();

            }

            if (object.far !== undefined) {

                object.far = objectFar.getValue();

            }

            if (object.intensity !== undefined) {

                object.intensity = objectIntensity.getValue();

            }

            if (object.color !== undefined) {

                object.color.setHex(objectColor.getHexValue());

            }

            if (object.groundColor !== undefined) {

                object.groundColor.setHex(objectGroundColor.getHexValue());

            }

            if (object.distance !== undefined) {

                object.distance = objectDistance.getValue();

            }

            if (object.angle !== undefined) {

                object.angle = objectAngle.getValue();

            }

            if (object.exponent !== undefined) {

                object.exponent = objectExponent.getValue();

            }


            try {

                object.userData = JSON.parse(objectUserData.getValue());

            } catch (exception) {

                console.warn(exception);

            }

            signals.objectChanged.dispatch(object);

        }

    }

    function updateRows() {

        var object = editor.selected;

        var properties = {
            'parent': objectParentRow,
            'position': objectPositionRow,
            'rotation': objectRotationRow,
            'scaleAll': objectScaleAllRow,
            'scale': objectScaleRow,
            'fov': objectFovRow,
            'near': objectNearRow,
            'far': objectFarRow,
            'intensity': objectIntensityRow,
            'color': objectColorRow,
            'groundColor': objectGroundColorRow,
            'distance': objectDistanceRow,
            'angle': objectAngleRow,
            'exponent': objectExponentRow
            //'visible' : objectVisibleRow
        };

        for (var property in properties) {

            var visible = object[property] !== undefined ? true : false;
            properties[property].setDisplay(visible ? '' : 'none');

        }

    }

    function updateTransformRows() {

        var object = editor.selected;

        if (object instanceof THREE.Light ||
            ( object instanceof THREE.Object3D && object.userData.targetInverse ) ||
            object instanceof THREE.Scene) {

            objectRotationRow.setDisplay('none');
            //objectScaleRow.setDisplay( 'none' );

        } else {

            objectRotationRow.setDisplay('');
            //objectScaleRow.setDisplay( '' );

        }

        objectPositionRow.setDisplay(object instanceof THREE.Scene ? 'none' : '');

    }

    // events

    signals.objectSelected.add(function (object) {

        updateUI();

    });

    signals.sceneGraphChanged.add(function () {

        var scene = editor.scene;

        var options = {};

        options[scene.id] = 'Scene';

        (function addObjects(objects) {

            for (var i = 0, l = objects.length; i < l; i++) {

                var object = objects[i];

                options[object.id] = object.name;

                addObjects(object.children);

            }

        })(scene.children);

        objectParent.setOptions(options);

    });

    signals.objectChanged.add(function (object) {

        if (object !== editor.selected) return;

        updateUI();

    });

    function updateUI() {

        container.setDisplay('none');

        var object = editor.selected;

        if (object !== null) {

            container.setDisplay('block');

            objectType.setValue(editor.getObjectType(object));

            objectUUID.setValue(object.uuid);

            objectName.setValue(object.name);

            if (editor.notDeletableObjects.indexOf(object.name) !== -1) {
                $(objectName.dom).prop('disabled', true);
                $(objectName.dom).addClass('inactive');
            } else {
                $(objectName.dom).prop('disabled', false);
                $(objectName.dom).removeClass('inactive');
            }

            if (object.parent !== undefined) {

                objectParent.setValue(object.parent.id);

            }

            objectPositionX.setValue(object.position.x);
            objectPositionY.setValue(object.position.y);
            objectPositionZ.setValue(object.position.z);

            objectRotationX.setValue(object.rotation.x);
            objectRotationY.setValue(object.rotation.y);
            objectRotationZ.setValue(object.rotation.z);

            objectScaleX.setValue(object.scale.x);
            objectScaleY.setValue(object.scale.y);
            objectScaleZ.setValue(object.scale.z);


            // link icon / button
            if (object.isInstance) {

                //$(nameLink.dom).show();
                //$(parentLink.dom).show();
                //$(positionLink.dom).show();
                $(rotationLink.dom).show();
                $(scaleLink.dom).show();

                // set link to linked icon if property is linked or to link button if not for all props:
                // name
                //if (object.isLinked[NAME_PROP]) {
                //	nameLink.setClass('icn icon-link linked');
                //} else {
                //	nameLink.setClass('icn icon-link link');
                //}
                // parent
                //if (object.isLinked[PARENT_PROP]) {
                //    parentLink.setClass('icn icon-link linked');
                //} else {
                //    parentLink.setClass('icn icon-link link');
                //}
                // position
                //if (object.isLinked[POSITION_PROP]) {
                //    positionLink.setClass('icn icon-link linked');
                //} else {
                //    positionLink.setClass('icn icon-link link');
                //}
                // rotation
                if (object.isLinked[ROTATION_PROP]) {
                    rotationLink.setClass('icn icon-link linked');
                } else {
                    rotationLink.setClass('icn icon-link link');
                }
                // scale
                if (object.isLinked[SCALE_PROP]) {
                    scaleLink.setClass('icn icon-link linked');
                } else {
                    scaleLink.setClass('icn icon-link link');
                }

            } else {
                //$(nameLink.dom).hide();
                //$(parentLink.dom).hide();
                //$(positionLink.dom).hide();
                $(rotationLink.dom).hide();
                $(scaleLink.dom).hide();
            }


            // *** 1.feb.17 all the stuff below is currently disabled in ui and therefore the link to template functionality is not implemented ****

            if (object.fov !== undefined) {

                objectFov.setValue(object.fov);

            }

            if (object.near !== undefined) {

                objectNear.setValue(object.near);

            }

            if (object.far !== undefined) {

                objectFar.setValue(object.far);

            }

            if (object.intensity !== undefined) {

                objectIntensity.setValue(object.intensity);

            }

            if (object.color !== undefined) {

                objectColor.setHexValue(object.color.getHexString());

            }

            if (object.groundColor !== undefined) {

                objectGroundColor.setHexValue(object.groundColor.getHexString());

            }

            if (object.distance !== undefined) {

                objectDistance.setValue(object.distance);

            }

            if (object.angle !== undefined) {

                objectAngle.setValue(object.angle);

            }

            if (object.exponent !== undefined) {

                objectExponent.setValue(object.exponent);

            }

            objectVisible.setValue(object.visible);

            try {

                objectUserData.setValue(JSON.stringify(object.userData, null, '  '));

            } catch (error) {

                console.log(error);

            }

            objectUserData.setBorderColor('#ccc');
            objectUserData.setBackgroundColor('');

            updateRows();
            updateTransformRows();

        }

    }

    return container;

};
