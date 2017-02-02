Sidebars.Properties.Physics = function (editor) {

    var signals = editor.signals;

    var objectSelected = undefined;
    var physijsSelected = undefined;


    var FRICTION_PROP = 'friction';
    var RESTITUTION_PROP = 'bounciness';
    var PHYSICS_PROP = 'static';
    // add instance properties
    editor.templateManager.addLinkProperty( FRICTION_PROP );
    editor.templateManager.addLinkProperty( RESTITUTION_PROP );
    editor.templateManager.addLinkProperty(PHYSICS_PROP);

    // panel

    var container = new UI.Panel();
    container.setDisplay('none');
    container.setClass("Panel advanced");

    $("<h3/>", {html: "Physics"}).appendTo(container.dom);


    // friction

    var physicsFrictionRow = new UI.Panel();
    physicsFrictionRow.setClass("row");
    var frictionLink = new UI.Text('').setClass('icn icon-link').onClick(function () {

        if (this.dom.className.indexOf('linked') === -1) {
            objectSelected.isLinked[FRICTION_PROP] = true;
            this.setClass('icn icon-link linked');

            // update to template value
            var template = editor.templateManager.getTemplateOfInstance(objectSelected.id);
            var value = template.material._physijs.friction;
            physicsFriction.setValue(value);

            update();
        }
    });
    var physicsFriction = new UI.Number(0.5).setRange(0, 1).onChange(function () {

        if (objectSelected.isInstance) {
            objectSelected.isLinked[FRICTION_PROP] = false;
            frictionLink.setClass('icn icon-link link');
        }
        update();
    });

    physicsFrictionRow.add(frictionLink);
    physicsFrictionRow.add(new UI.Text('Friction').setWidth('90px'));
    physicsFrictionRow.add(physicsFriction);

    container.add(physicsFrictionRow);


    // restitution

    var physicsRestitutionRow = new UI.Panel();
    physicsRestitutionRow.setClass("row");
    var restitutionLink = new UI.Text('').setClass('icn icon-link').onClick(function () {

        if (this.dom.className.indexOf('linked') === -1) {
            objectSelected.isLinked[RESTITUTION_PROP] = true;
            this.setClass('icn icon-link linked');

            // update to template value
            var template = editor.templateManager.getTemplateOfInstance(objectSelected.id);
            var value = template.material._physijs.restitution;
            physicsRestitution.setValue(value);

            update();
        }
    });
    var physicsRestitution = new UI.Number(0.5).setRange(0, 1).onChange(function (){
        if (objectSelected.isInstance) {
            objectSelected.isLinked[RESTITUTION_PROP] = false;
            restitutionLink.setClass('icn icon-link link');
        }
        update()
    });

    physicsRestitutionRow.add(restitutionLink);
    physicsRestitutionRow.add(new UI.Text('Bounciness').setWidth('90px'));
    physicsRestitutionRow.add(physicsRestitution);

    container.add(physicsRestitutionRow);


    // static or dynamic

    var physicsModeRow = new UI.Panel();
    physicsModeRow.setClass("row");
    var physicsModeLink = new UI.Text('').setClass('icn icon-link').onClick(function () {

        if (this.dom.className.indexOf('linked') === -1) {
            objectSelected.isLinked[PHYSICS_PROP] = true;

            this.setClass('icn icon-link linked');

            // update to template value
            var template = editor.templateManager.getTemplateOfInstance(objectSelected.id);
            var value = template.isStatic;
            physicsMode.setValue(value);

            update();
        }
    });
    var physicsMode = new UI.Checkbox(false).onChange(function (){
        if (objectSelected.isInstance) {
            objectSelected.isLinked[PHYSICS_PROP] = false;
            physicsModeLink.setClass('icn icon-link link');
        }
        update()
    });

    physicsModeRow.add(physicsModeLink);
    physicsModeRow.add(new UI.Text('Static').setWidth('90px'));
    physicsModeRow.add(physicsMode);

    container.add(physicsModeRow);


    //

    function update() {

        // UPDATE OF TEMPLATE INSTANCES
        if (objectSelected.isTemplate) {

            var instObjects = editor.templateManager.getInstancesOfTemplate(objectSelected.id);

            for (var i = 0; i < instObjects.length; i++) {

                var instMaterial = instObjects[i].material;
                var physics = instMaterial._physijs;

                if (physics) {

                    if (instObjects[i].isLinked[FRICTION_PROP]) {
                        physics.friction = physicsFriction.getValue();
                    }
                    if (instObjects[i].isLinked[RESTITUTION_PROP]) {
                        physics.restitution = physicsRestitution.getValue();
                    }
                    if (instObjects[i].isLinked[PHYSICS_PROP]) {
                        instObjects[i].isStatic = physicsMode.getValue();
                    }

                }

            }

        }


        // OBJECT UPDATE
        var physics = objectSelected.material._physijs;

        if (physics) {

            physics.friction = physicsFriction.getValue();
            physics.restitution = physicsRestitution.getValue();
            objectSelected.isStatic = physicsMode.getValue();

        }


        signals.objectChanged.dispatch(objectSelected);
    }

    // events

    signals.objectSelected.add(function (object) {

        if (object && object.material && object.material._physijs) {

            objectSelected = object;
            physijsSelected = object.material._physijs;

            container.setDisplay('');

            var physics = object.material._physijs;

            if (physics.friction === undefined) physics.friction = 0.5;
            physicsFriction.setValue(physics.friction);

            if (physics.restitution === undefined) physics.restitution = 0.5;
            physicsRestitution.setValue(physics.restitution);

            if (object.isStatic == undefined) object.isStatic = false;
            physicsMode.setValue(object.isStatic);

            // link icon / button
            if (objectSelected.isInstance) {

                $(frictionLink.dom).show();
                $(restitutionLink.dom).show();
                $(physicsModeLink.dom).show();

                // set link to linked icon if property is linked or to link button if not for all props:
                //friction
                if (objectSelected.isLinked[FRICTION_PROP]) {
                    frictionLink.setClass('icn icon-link linked');
                } else {
                    frictionLink.setClass('icn icon-link link');
                }
                // restitution
                if (objectSelected.isLinked[RESTITUTION_PROP]) {
                    restitutionLink.setClass('icn icon-link linked');
                } else {
                    restitutionLink.setClass('icn icon-link link');
                }
                // static
                if (objectSelected.isLinked[PHYSICS_PROP]) {
                    physicsModeLink.setClass('icn icon-link linked');
                } else {
                    physicsModeLink.setClass('icn icon-link link');
                }

            } else {
                $(frictionLink.dom).hide();
                $(restitutionLink.dom).hide();
                $(physicsModeLink.dom).hide();
            }

        } else {

            container.setDisplay('none');

        }

    });

    return container;

};
