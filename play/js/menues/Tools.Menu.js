Tools.Menu = function (editor) {

    var signals = editor.signals;

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
    });
    this.sceneButton = backPanel.dom.children[0];
    setButtonActivationCallback(this.sceneButton, "back-to-gallery");

    buttonPanels.push(backPanel);

    signals.menuButtonClicked.add( function(name) {
        if(name=="back-to-gallery")
        {
            window.history.back();
        }
    });



    var editPanel = new UI.ButtonHelper.createButtonPanel("menu");
    editPanel.addButton("icon-file", function () {
        signals.menuButtonClicked.dispatch("file+help");
    });
    setButtonActivationCallback(editPanel.dom.children[0], "file+help");

    editPanel.addButton("icon-save", function () {
        signals.menuButtonClicked.dispatch("save");
    });
    setButtonActivationCallback(editPanel.dom.children[0], "save");

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
    });
    setButtonActivationCallback(addPanel.dom.children[0], "add");

    addPanel.addButton("icon-template", function () {
        signals.menuButtonClicked.dispatch("add-template");
    });
    setButtonActivationCallback(addPanel.dom.children[1], "add-template");

    buttonPanels.push(addPanel);



    var scenePanel = new UI.ButtonHelper.createButtonPanel("menu");
    scenePanel.addButton("icon-scene", function () {
        signals.menuButtonClicked.dispatch("scene-properties");
    });
    this.sceneButton = scenePanel.dom.children[0];
    setButtonActivationCallback(this.sceneButton, "scene-properties");
    buttonPanels.push(scenePanel);


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
        if(panel.css('display') == 'none'){

            panel.css('display','block');
        }else{

            panel.css('display','none');
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
