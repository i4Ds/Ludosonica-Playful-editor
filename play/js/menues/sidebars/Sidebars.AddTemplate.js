/**
 * Created by Fiona on 13.07.16.
 */
Sidebars.AddTemplate = function (editor) {

    var signals = editor.signals;
    var objService = editor.objectPropertyService;
    var templManager = editor.templateManager;

    var container = new UI.Panel();
    container.setDisplay('none');

    $("<h2/>").html("Add Object from Template").appendTo(container.dom);

    var outliner = new UI.FancySelect().setId('outliner');
    outliner.onChange(function () {

        //editor.selectById(parseInt(outliner.getValue()));
        editor.selectTemplateById( parseInt(outliner.getValue()) );

    });
    container.add(outliner);


    // events

    signals.templateAdded.add(function () {

        var options = [];


        (function addObjects(objects, pad) {

            for (var i = 0, l = objects.length; i < l; i++) {

                var object = objects[i];

                var html = pad + '</span> ' + '<span class="objNameDisplay">' + objService.getName(object) + '</span>';


                html += ' <span class="icn-delete icon-del-small" title="delete template"></span>';
                html += ' <span class="icn icon-add" title="add instance of this template"></span>';


                options.push({value: object.id, html: html});

                //addObjects( editor.getTemplates(), pad + '&nbsp;&nbsp;&nbsp;' );

            }

        })(templManager.getTemplates(), '&nbsp;&nbsp;&nbsp;');

        outliner.setOptions(options);

        if (editor.selected !== null) {

            outliner.setValue(editor.selected.id);

        }

        for (var x = 0; x < options.length; x++) {
            var child = $(outliner.dom.children[x]);
            var deleteBtn = child.find('.icon-del-small');
            var addBtn = child.find('.icon-add');

            if (deleteBtn.length > 0) $(deleteBtn[0]).click(function (el) {

                // todo remove all instances
                templManager.removeTemplate(this);

            }.bind(options[x]));

            if(addBtn.length > 0) $(addBtn[0]).click(function ( el ){

                var instanceObj = templManager.getInstanceForTemplate( this.value );
                if (instanceObj.geometry.boundingBox == undefined) instanceObj.geometry.computeBoundingBox();

                instanceObj.position.y = instanceObj.geometry.boundingBox.size().y / 2;

                editor.addObject(instanceObj);
                editor.select(instanceObj);

            }.bind(options[x]));
        }

    });


    signals.menuButtonClicked.add(function (name) {

        if (name == "add-template") {
            // Show this sidebar panel when add menu button is clicked and if there are templates
            $(container.dom).toggle(200);
            if (templManager.getTemplates().length < 0) $(container.dom).hide();
            editor.deselect();
        }
        else {
            $(container.dom).hide();
        }

    });


    return container;

    //var signals = editor.signals;
    //
    //var templContainer = new UI.Panel();
    //templContainer.setDisplay( 'none' );
    //
    //$("<h2/>").html("Add Object from Template").appendTo(templContainer.dom);
    //var addTemplateMenu = new UI.Panel();
    //
    //var TemplateList = $("<ul/>")
    //    .addClass("menu object")
    //    .appendTo(addTemplateMenu.dom);
    //
    //
    //editor.signals.templateAdded.add( function( ) {
    //
    //    TemplateList.empty();
    //
    //    var templates = editor.getTemplates();
    //
    //    for(var i = 0; i < templates.length; i++){
    //
    //        var template = templates[i];
    //
    //        var templateLink = $('<a><img src="' + editor.theme.currentTheme.getImage( template.getType() ) + '"/> ' + template.getName() + '</a></li>');
    //        templateLink.click( function (e) {
    //
    //            var template = this;        // this holds the clicked template
    //
    //            var p = template.getInstance();
    //            p.instanceChanged = template.getSignal();
    //
    //            //this.templatedChanged.add( function () {
    //            //    Logger.warn("doodli doo template changed");
    //            //});
    //
    //            //Logger.warn(p, "Sidebars.AddTemplate.js");
    //            if (p.geometry.boundingBox == undefined) p.geometry.computeBoundingBox();
    //
    //            p.position.y = p.geometry.boundingBox.size().y / 2;
    //
    //            editor.templateManager.addInstanceOfTemplate( p, template);
    //            editor.addObject( p );
    //            editor.select( p );
    //
    //        }.bind( template ) );
    //        $('<li/>').html(templateLink).appendTo( TemplateList );
    //
    //    }
    //
    //    Logger.warn("template added", editor.getTemplates());
    //
    //} );
    //
    //
    //templContainer.add(addTemplateMenu);
    //
    //
    //signals.menuButtonClicked.add( function(name) {
    //
    //    if(name=="add-template")
    //    {
    //        // Show this sidebar panel when add menu button is clicked and if there are templates
    //        $(templContainer.dom).toggle(200);
    //        if(editor.getTemplates().length < 0) $(templContainer.dom).hide();
    //    }
    //    else {
    //        $(templContainer.dom).hide();
    //    }
    //
    //});
    //
    //
    //return templContainer;
};