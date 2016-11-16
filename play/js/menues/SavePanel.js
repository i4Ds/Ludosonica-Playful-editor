/**
 * Created by fiona on 24.10.16.
 */
var SavePanel = function (editor) {
    var signals = editor.signals;

    var container = new UI.Panel().setDisplay('none');

    var inputPanel = new UI.Panel().setClass('sceneSavePanel');

    var labelSceneName = $(document.createElement('label')).text('Scenename:');
    labelSceneName.addClass('sceneSave');
    inputPanel.dom.appendChild(labelSceneName[0]);
    inputPanel.dom.appendChild(document.createElement("br"));
    var inputSceneName = $(document.createElement('input')).attr('type', 'text').attr('name', 'scenename').attr('size', '100');
    inputSceneName.addClass('sceneSave');
    deactivateEventListener(inputSceneName[0], 'keydown');
    inputPanel.dom.appendChild(inputSceneName[0]);

    inputPanel.dom.appendChild(document.createElement("br"));


    var labelDescription = $(document.createElement('label')).text('Description:');
    labelDescription.addClass('sceneSave');
    inputPanel.dom.appendChild(labelDescription[0]);

    inputPanel.dom.appendChild(document.createElement("br"));

    var inputDescription = $(document.createElement('textarea')).attr('name', 'description').attr('rows', '5').attr('cols', '100');
    inputDescription.addClass('sceneSave');
    deactivateEventListener(inputDescription[0], 'keydown');
    inputPanel.dom.appendChild(inputDescription[0]);
    container.add(inputPanel);

    //----------------------------------------------------------------------------------------

    var uploadButton = $(document.createElement('button')).text('Save').addClass('galleryUploadButton');
    inputPanel.dom.appendChild(uploadButton[0]);


    var lockPanel = function () {
        uploadButton.attr('disabled', 'disabled');
        uploadButton.css('background-image', 'url("./images/iconset/wait.gif")');
        uploadButton.css('background-repeat', 'no-repeat');
        uploadButton.css('background-position', 'left center');
        //removeLink.val('');
    };

    var unlockPanel = function () {
        uploadButton.removeAttr('disabled');
        uploadButton.css('background-image', '');
        uploadButton.css('background-repeat', '');
        uploadButton.css('background-position', '');
    };

    var checkFields = function () {

        if (inputSceneName.val().length == 0 || inputSceneName.val().length > 20) {
            statusLabel.text('Scenename must be between 1 and 20 characters');
            statusLabel.css('color', 'red');
            inputSceneName.css('border', '1px solid red');
            return false;
        } else {
            inputSceneName.css('border', '');
        }

        if (inputDescription.val().length > 500) {
            statusLabel.text('Description must be 500 characters or less');
            statusLabel.css('color', 'red');
            inputDescription.css('border', '1px solid red');
            return false;
        } else {
            inputDescription.css('border', '');
        }

        return true;

    };


    uploadButton.click(function () {

        if (checkFields()) {

            lockPanel();
            if ($('.imageContainer > a > canvas').length == 0) {
                //addCameras
                var addCameraButton = $('#cameraPanel > button:eq(0)');
                for (var i = 0; i < 3; i++) addCameraButton.click();

                //rearrange cameras
                var rearrangeCameraButton = $('#cameraPanel > button:eq(1)');
                rearrangeCameraButton.click();

                //take screenshots
                $('#imagePanel > button')[1].click();

            }

            var complete = function () {
                unlockPanel();
                //$('#gallery > iframe')[0].contentWindow.location.reload();
            };

            var error = function (a, b, c) {
                complete();

                console.log('error', a);

                var json = $.parseJSON(a.responseText);

                console.log(a.responseText);

                statusLabel.css('color', 'red');
                statusLabel.text(json['error-codes']);

            };


            var uploadData = function () {

                var formData = new FormData();

                var userId = sessionStorage.getItem('user');
                var sceneId = sessionStorage.getItem('scene');

                console.log('upload scene', sceneId, 'of user', userId);

                if (sceneId === 'null') {
                    formData.append("scenename", inputSceneName.val());
                    formData.append("description", inputDescription.val());
                }
                formData.append("scene", sceneId);
                formData.append("user", userId);

                editor.storage.createZip(function (blob) {

                    var zip = new JSZip();
                    var imageFolder = zip.folder('images');

                    $('.imageContainer > a > canvas').each(function (i, v) {
                        var data = v.toDataURL('image/png');
                        imageFolder.file('image' + i + '.png', data.substr(data.indexOf(',') + 1), {base64: true});
                    });
                    var imageBlob = zip.generate({type: 'blob'});

                    formData.append("images", imageBlob);
                    formData.append("playful", blob);


                    var success = function (a, b, c) {
                        complete();

                        console.log(a, b, c);

                        statusLabel.css('color', 'green');
                        statusLabel.text("Upload Successful!");

                        var timeout;
                        clearTimeout(timeout);

                        timeout = setTimeout(function () {
                            showHide('sceneSave');
                        }, 2000);
                    };

                    //console.log('send gallery');

                    $.ajax({
                        url: "gallery/upload",
                        type: "POST",
                        dataType: 'json',
                        data: formData,
                        crossDomain: true,
                        error: error,
                        success: success,
                        //complete: complete,
                        processData: false,  // tell jQuery not to process the data
                        contentType: false   // tell jQuery not to set contentType
                    });

                });
            };


            uploadData();
        }

    });

    inputPanel.dom.appendChild(document.createElement("br"));

    var statusLabel = $(document.createElement('label')).attr('id', 'galleryUploadStatus');
    inputPanel.dom.appendChild(statusLabel[0]);

    container.add(inputPanel);

    return container;

};

function deactivateEventListener(dom, type) {
    dom.addEventListener(type, function (event) {

        event.stopPropagation();

    }, false);
}


function showHide(id) {
    var panel = $('#' + id);
    if (panel.css('display') == 'none') {

        panel.css('display', 'block');
    } else {

        panel.css('display', 'none');
    }
}
