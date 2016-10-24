Editor.TemplateManager = function ( editor ) {


    this.editor = editor;

    this.objService = editor.objectPropertyService;
    this.signals = editor.signals;

    this.addTemplate = function ( template, instance ) {

        var templateInstanceMap = editor.scene.templates || [];

        template.position.x = 0;
        template.position.y = 0.5;
        template.position.z = 0;

        template.isTemplate = true;

        instance.isInstance = true;

        this.isLinked = {
            'parent': true,
            'position': true,
            'rotation': true,
            'scale': true,
            'visible' : true,
            'geometry': true,
            'friction': true,
            'bounciness' : true,
            'static' : true,
            'color' : true,
            'edges': true,
            'texture' : true,
            'blending' : true,
            'opacity' : true,
            'runtimeMaterial' : true,
            'rocket' : true,
            'resurrection' : true
        };

        instance.isLinked = this.isLinked;

        templateInstanceMap.push({
            template: template,
            instances: [ instance ]
        });

        this.signals.templateAdded.dispatch();

        editor.setTemplates ( templateInstanceMap );

    };



    this.removeTemplate = function ( templateId ){

        var templateInstanceMap = editor.scene.templates;

        var templIndex = this._getIndexOfTemplate( templateInstanceMap, templateId );

        templateInstanceMap.splice( templIndex, 1);

        editor.setTemplates ( templateInstanceMap );

    };



    this.removeInstance = function ( instance ) {

        var templateInstanceMap = editor.scene.templates;

        for( var i = 0; i < templateInstanceMap.length; i++ ) {


            var instances = templateInstanceMap[i].instances;

            for ( var j = 0; j < instances.length; j++){


                var index = this._getIndexOfInstance( instances, instance.id );

                if( index > -1 ){
                    instances.splice( index, 1);
                    break;
                }

            }

        }

        editor.setTemplates ( templateInstanceMap );
    };



    this.getTemplates = function (){

        var templateInstanceMap = editor.scene.templates;

        var templates = [];

        if( templateInstanceMap ){

            for( var i = 0; i < templateInstanceMap.length; i++){
                templates.push( templateInstanceMap[i].template );
            }

        }


        return templates;
    };



    this.getTemplateById = function ( id ) {

        var templateInstanceMap = editor.scene.templates;

        var templIndex = this._getIndexOfTemplate( templateInstanceMap, id );

        if( templIndex > -1) {
            return templateInstanceMap[templIndex].template;
        }

    };



    this.getInstanceForTemplate = function ( templateId ) {

        var templateInstanceMap = editor.scene.templates;

        var index = this._getIndexOfTemplate( templateInstanceMap, templateId );

        var instance = templateInstanceMap[index].template.clone();
        instance.material = instance.material.clone();
        instance.isInstance = true;

        instance.isLinked = this.isLinked;

        this._addInstanceOfTemplate( templateInstanceMap, instance, templateId );

        editor.setTemplates ( templateInstanceMap );

        return instance;
    };



    this.getInstancesOfTemplate = function ( templateId ) {

        var templateInstanceMap = editor.scene.templates;

        var templIndex = this._getIndexOfTemplate( templateInstanceMap, templateId );

        return templateInstanceMap[templIndex].instances;
    };



    this._addInstanceOfTemplate = function ( map, instanceObj, templateId) {

        var templIndex = this._getIndexOfTemplate( map, templateId );

        map[templIndex].instances.push( instanceObj );

    };



    this._getIndexOfTemplate = function ( map, templateId ) {

        if( map ) {
            for (var i = 0; i < map.length; i++) {

                if (map[i].template.id == templateId) {

                    return i;
                }
            }
        }

        return -1;
    };


    this._getIndexOfInstance = function ( instances, instanceId ) {

        for( var i = 0; i < instances.length; i++){

            if( instances[i].id == instanceId){
                return i;
            }
        }

        return -1;
    };


};