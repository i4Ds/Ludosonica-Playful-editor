/**
 * Created by fiona on 16.11.16.
 */
var LoadingPanel = function (editor) {

    var signals = editor.signals;

    var container = new UI.Panel().setDisplay('none').setClass('loading-panel');

    var spinner = $(document.createElement('div')).addClass('spinner');
    var loadingText = $(document.createElement('div')).text('LOADING SCENE').addClass('loading-text');

    container.dom.appendChild(spinner[0]);
    container.dom.appendChild(loadingText[0]);


    var lockPanel = function () {
        container.setDisplay('block');
        spinner.css('background-image', 'url("./images/iconset/wait.gif")');
        spinner.css('background-repeat', 'no-repeat');
        spinner.css('background-position', 'left center');
    };

    var unlockPanel = function () {
        container.setDisplay('none');
        spinner.css('background-image', '');
        spinner.css('background-repeat', '');
        spinner.css('background-position', '');
    };

    signals.loadFile.add(lockPanel);
    signals.fileLoadCompleted.add(unlockPanel);


    return container;

};

