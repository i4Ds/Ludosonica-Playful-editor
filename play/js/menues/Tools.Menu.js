Tools.Menu = function (editor) {

    var signals = editor.signals;
    this.signals = editor.signals;

    //var buttonpanel = new UI.ButtonHelper.createButtonPanel( "menu" );
    //
    ////buttonpanel.addButton( "icon-file", function() { signals.menuButtonClicked.dispatch("file+help"); } );
    //buttonpanel.addButton( "icon-add", function() { signals.menuButtonClicked.dispatch("add"); } );
    ////buttonpanel.addButton( "icon-sound", function() { signals.menuButtonClicked.dispatch("sound"); } );

    var buttonPanels = [];

    var activeButton = "add";


    var backPanel = new UI.ButtonHelper.createButtonPanel("menu");
    backPanel.addButton("icon-back", function () {
        signals.menuButtonClicked.dispatch("back-to-gallery");
    }, 'menu-gallery', 'go back to gallery');

    this.sceneButton = backPanel.dom.children[0];
    setButtonActivationCallback(this.sceneButton, "back-to-gallery");

    buttonPanels.push(backPanel);

    signals.menuButtonClicked.add( function(name) {
        if(name=="back-to-gallery")
        {
            console.log(document.referrer);
            //window.history.back();
            //location.href = location.origin+'/play/gallery/main';
            location.href = document.referrer;
        }
    });



    var editPanel = new UI.ButtonHelper.createButtonPanel("menu");
    editPanel.addButton("icon-file", function () {
        signals.menuButtonClicked.dispatch("file+help");
    }, 'menu-file');

    setButtonActivationCallback(editPanel.dom.children[0], "file+help");


    editPanel.addButton("icon-save", function () {
        signals.menuButtonClicked.dispatch("save");
    }, 'menu-save', 'save the scene');

    setButtonActivationCallback(editPanel.dom.children[1], "save");

    buttonPanels.push(editPanel);

    signals.menuButtonClicked.add( function(name) {
        if(name=="save")
        {
            showHide('sceneSave');
        }
    });



    var addPanel = new UI.ButtonHelper.createButtonPanel("menu");
    addPanel.addButton("icon-object active", function () {
        signals.menuButtonClicked.dispatch("add");
    }, 'menu-object', 'open panel to add objects');

    setButtonActivationCallback(addPanel.dom.children[0], "add");

    // todo AFTER MAKESHOP
    //addPanel.addButton("icon-template", function () {
    //    signals.menuButtonClicked.dispatch("add-template");
    //}, 'menu-template', 'open panel to add and edit templates');
    //setButtonActivationCallback(addPanel.dom.children[1], "add-template");

    addPanel.addButton("icon-scene", function () {
        signals.menuButtonClicked.dispatch("scene-properties");
    }, 'menu-scene', 'open scene panel');

    this.sceneButton = addPanel.dom.children[1];
    setButtonActivationCallback(this.sceneButton, "scene-properties");

    buttonPanels.push(addPanel);


    // todo AFTER MAKESHOP
    //var scenePanel = new UI.ButtonHelper.createButtonPanel("menu");
    //scenePanel.addButton("icon-scene", function () {
    //    signals.menuButtonClicked.dispatch("scene-properties");
    //});
    //this.sceneButton = scenePanel.dom.children[0];
    //setButtonActivationCallback(this.sceneButton, "scene-properties");
    //buttonPanels.push(scenePanel);


    function setButtonActivationCallback(button, key) {

        signals.menuButtonClicked.add(function (name) {
            if (name == key) {
                if ($(button).hasClass("active")) {
                    $(button).removeClass("active");
                } else {
                    $(button).addClass("active");
                }
            }
            else {
                $(button).removeClass("active");
            }
        });

    }


    function showHide ( id ) {
        var panel = $('#'+id);
        var inputs = $('.'+id);

        if(panel.css('display') == 'none'){
            panel.css('display','block');

            if( sessionStorage.getItem('scene') !== 'null'){
                inputs.hide();

                var uploadButton = $('.galleryUploadButton');
                uploadButton.text('Saving...').addClass('saving');
                uploadButton.click();

            }else {
                inputs.show();
            }

        }else{
            panel.css('display','none');

            inputs.hide();
        }
    }


    signals.objectSelected.add(function (object) {

        if (object != null) {

            if (!object.isTemplate && !$(this.sceneButton).hasClass("active")) {

                this.signals.menuButtonClicked.dispatch("scene-properties");
            }

        }

    }.bind(this));


    //return buttonpanel;
    return buttonPanels;
};
