Editor.TemplateManager = function (editor) {


    this.templateInstanceMap = [];

    this.objService = editor.objectPropertyService;
    this.signals = editor.signals;

    editor.signals.objectChanged.add( updateInstancesOfTemplate.bind( this ) );


    this.addTemplate = function (template) {
        // todo add only if not yet added. Otherwise throw error.
        // todo store in localstorage

        this.templateInstanceMap.push({
            template: template,
            instances: []
        });

        this.signals.templateAdded.dispatch();
    };


    this.removeTemplate = function ( template ){

        var templIndex = this._getIndexOfTemplate( template.id );
        this.templateInstanceMap.splice( templIndex, 1);

    };


    this.getTemplates = function (){
        var templates = [];

        for( var i = 0; i < this.templateInstanceMap.length; i++){
            templates.push(this.templateInstanceMap[i].template);
        }

        return templates;
    };


    this.getTemplateById = function ( id ) {

        var templIndex = this._getIndexOfTemplate( id );

        return this.templateInstanceMap[templIndex].template;

    };



    this.getInstanceForTemplate = function ( templateId ) {

        var index = this._getIndexOfTemplate( templateId );

        var instance = this.templateInstanceMap[index].template.clone();
        instance.material = instance.material.clone();

        this._addInstanceOfTemplate( instance, templateId );

        return instance;
    };


    this.getInstancesOfTemplate = function ( templateId ) {

        var templIndex = this._getIndexOfTemplate( templateId );

        return this.templateInstanceMap[templIndex].instances;
    };



    this._addInstanceOfTemplate = function (instanceObj, templateId) {

        var templIndex = this._getIndexOfTemplate(templateId);

        this.templateInstanceMap[templIndex].instances.push(instanceObj);

    };



    this._getIndexOfTemplate = function ( templateId ) {

        for (var i = 0; i < this.templateInstanceMap.length; i++) {
            if (this.templateInstanceMap[i].template.id == templateId) return i;
        }

        return -1;
    };



    function updateInstancesOfTemplate( templateObj ) {

        var manager = this;

        var templIndex = manager._getIndexOfTemplate( templateObj.id );

        // check if object is template
        if ( templIndex > -1) {

            var instances = manager.templateInstanceMap[templIndex].instances;
            for( var i = 0; i < instances.length; i++){

                var currentInstance = instances[i];

                if( !manager.objService.isDetachedFromTemplate( currentInstance, manager.objService.updateableProps.FRICTION ) ){

                    var templFriction = manager.objService.getFriction( templateObj );
                    manager.objService.setFriction( currentInstance, templFriction );

                }

                if( !manager.objService.isDetachedFromTemplate( currentInstance, manager.objService.updateableProps.RESTITUTION ) ){

                    var templRestitution = manager.objService.getRestitution( templateObj );
                    manager.objService.setRestitution( currentInstance, templRestitution );

                }

                if( !manager.objService.isDetachedFromTemplate( currentInstance, manager.objService.updateableProps.STATIC ) ){

                    var templIsStatic = manager.objService.getIsStatic( templateObj );
                    manager.objService.setIsStatic( currentInstance, templIsStatic );

                }

            }

        }

    }



};