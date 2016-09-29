var ObjectPropertyService = function () {

    this.updateableProps = {
        //BEHAVIOURS: 'behaviors',
        //EVENTS: 'events',
        FRICTION: 'friction',
        RESTITUTION: 'restitution',
        STATIC: 'static',
        COLOR: 'color'
    };

};

ObjectPropertyService.prototype = {

    isDetachedFromTemplate: function (obj, property) {

        if (obj.detachedFromTemplate == undefined) return false;

        return (obj.detachedFromTemplate.indexOf(property) > -1);
    },


    // add to detached list
    detachFromTemplate: function (obj, property) {

        if (obj.detachedFromTemplate == undefined) obj.detachedFromTemplate = [];

        obj.detachedFromTemplate.push(property);
    },


    // remove from detached list
    attachToTemplate: function (obj, property) {

        var index = obj.detachedFromTemplate.indexOf(property);

        obj.detachedFromTemplate.splice(index, 1);

    },


    getName: function (obj) {
        return obj.name;
    },


    setFriction: function (obj, friction) {
        var physics = obj.material._physijs;
        physics.friction = friction;
    },

    getFriction: function (obj) {
        var physics = obj.material._physijs;
        return physics.friction;
    },


    setRestitution: function (obj, restitution) {
        var physics = obj.material._physijs;
        physics.restitution = restitution;
    },

    getRestitution: function (obj) {
        var physics = obj.material._physijs;
        return physics.restitution;
    },


    setIsStatic: function (obj, isStatic) {
        var physics = obj.material._physijs;
        physics.isStatic = isStatic;
    },

    getIsStatic: function (obj) {
        var physics = obj.material._physijs;
        return (physics.isStatic) ? physics.isStatic : false;
    },


    setColor: function ( obj, hexColor ) {
        var material = obj.material;

        if ( material.color !== undefined ) {

            material.color.setHex( hexColor );

        }

    },

    getColor: function ( obj ){
        return obj.material.color;
    }
};