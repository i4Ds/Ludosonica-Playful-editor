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

        editor.selectTemplateById( parseInt(outliner.getValue()) );

    });
    container.add(outliner);


    // events

    // todo templatez
    var templateList = function () {
        var options = [];


        (function addObjects(objects, pad) {

            if(objects) {

                for (var i = 0, l = objects.length; i < l; i++) {

                    var object = objects[i];

                    var html = pad + '</span> ' + '<span class="objNameDisplay">' + objService.getName(object) + '</span>';


                    html += ' <span class="icn-delete icon-del-small" title="delete template"></span>';
                    html += ' <span class="icn icon-add" title="add instance of this template"></span>';


                    options.push({value: object.id, html: html});

                }
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

                // todo remove all instances? maybe better: detach all inst.
                editor.removeTemplate(this.value);
                editor.select( null );

            }.bind(options[x]));

            if(addBtn.length > 0) $(addBtn[0]).click(function ( el ){

                var instanceObj = templManager.getInstanceForTemplate( this.value );

                if (instanceObj.geometry.boundingBox == undefined) instanceObj.geometry.computeBoundingBox();

                instanceObj.position.y = instanceObj.geometry.boundingBox.size().y / 2;

                editor.addObject( instanceObj );

                //editor.select( instanceObj );

            }.bind(options[x]));
        }
    };

    signals.templateAdded.add(templateList);
    signals.templateDeleted.add(templateList);


    signals.menuButtonClicked.add(function (name, attr) {

        templateList();

        if (name == "add-template" && !(attr == "added")) {

            // Show this sidebar panel when add menu button is clicked and if there are templates
            $(container.dom).toggle(200);
            //if (templManager.getTemplates().length < 0) $(container.dom).hide();
            editor.deselect();
        } else if (name == "add-template" && attr == "added") {

            // Show this sidebar panel when add menu button is clicked and if there are templates
            $(container.dom).toggle(200);

            editor.deselect();

            // after template was generated select generated template in list.
            var value = outliner.options[ outliner.options.length- 1].value;

            editor.selectTemplateById( parseInt(value) );

            outliner.setValue(editor.selected.id);

        }
        else {
            $(container.dom).hide();
        }

    });

    $(container.dom).addClass('top');


    return container;

};