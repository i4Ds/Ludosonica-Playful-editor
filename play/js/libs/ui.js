
var UI = {};

UI.Element = function () {};

UI.Element.prototype = {

	setId: function ( id ) {

		this.dom.id = id;

		return this;

	},

	setClass: function ( name ) {

		this.dom.className = name;

		return this;

	},

	setStyle: function ( style, array ) {

		for ( var i = 0; i < array.length; i ++ ) {

			this.dom.style[ style ] = array[ i ];

		}

	},

	setDisabled: function ( value ) {

		this.dom.disabled = value;

		return this;

	},

	setTextContent: function ( value ) {

		this.dom.textContent = value;

		return this;

	}

};

// properties

var properties = [ 'position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'border', 'borderLeft',
'borderTop', 'borderRight', 'borderBottom', 'borderColor', 'display', 'overflow', 'margin', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom', 'padding', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'color',
'backgroundColor', 'opacity', 'fontSize', 'fontWeight', 'textTransform', 'cursor' ];

properties.forEach( function ( property ) {

	var method = 'set' + property.substr( 0, 1 ).toUpperCase() + property.substr( 1, property.length );

	UI.Element.prototype[ method ] = function () {

		this.setStyle( property, arguments );
		return this;

	};

} );

// events

var events = [ 'KeyUp', 'KeyDown', 'MouseOver', 'MouseOut', 'Click', 'Change' ];

events.forEach( function ( event ) {

	var method = 'on' + event;

	UI.Element.prototype[ method ] = function ( callback ) {

		this.dom.addEventListener( event.toLowerCase(), callback.bind( this ), false );

		return this;

	};

} );


// Panel

UI.Panel = function ( dom ) {

	UI.Element.call( this );

	if ( !dom ) {
		dom = document.createElement( 'div' );
		dom.className = 'Panel';
	}
	//TODO: else both classes?

	this.dom = dom;

	return this;
};

UI.Panel.prototype = Object.create( UI.Element.prototype );

UI.Panel.prototype.add = function () {

	for ( var i = 0; i < arguments.length; i ++ ) {

		this.dom.appendChild( arguments[ i ].dom );

	}

	return this;

};


UI.Panel.prototype.remove = function () {

	for ( var i = 0; i < arguments.length; i ++ ) {

		this.dom.removeChild( arguments[ i ].dom );

	}

	return this;

};

UI.Panel.prototype.clear = function () {

	while ( this.dom.children.length ) {

		this.dom.removeChild( this.dom.lastChild );

	}

};

// Text

UI.Text = function ( text ) {

	UI.Element.call( this );

	var dom = document.createElement( 'span' );
	dom.className = 'Text';
	dom.style.cursor = 'default';
	dom.style.display = 'inline-block';
	dom.style.verticalAlign = 'middle';

	this.dom = dom;
	this.setValue( text );

	return this;

};

UI.Text.prototype = Object.create( UI.Element.prototype );

UI.Text.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		this.dom.textContent = value;

	}

	return this;

};


// Input

UI.Input = function () {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Input';
	dom.style.padding = '2px';
	dom.style.border = '1px solid #ccc';

	dom.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

	}, false );

	this.dom = dom;

	return this;

};

UI.Input.prototype = Object.create( UI.Element.prototype );

UI.Input.prototype.getValue = function () {

	return this.dom.value;

};

UI.Input.prototype.setValue = function ( value ) {

	this.dom.value = value;

	return this;

};


// TextArea

UI.TextArea = function () {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'textarea' );
	dom.className = 'TextArea';
	dom.style.padding = '2px';
	dom.style.border = '1px solid #ccc';

	dom.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

	}, false );

	this.dom = dom;

	return this;

};

UI.TextArea.prototype = Object.create( UI.Element.prototype );

UI.TextArea.prototype.getValue = function () {

	return this.dom.value;

};

UI.TextArea.prototype.setValue = function ( value ) {

	this.dom.value = value;

	return this;

};


// Select

UI.Select = function () {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'select' );
	dom.className = 'Select';
	dom.style.width = '10em';
	dom.style.height = '2em';
	dom.style.border = '0px';
	dom.style.padding = '0px';

	this.dom = dom;

	return this;

};

UI.Select.prototype = Object.create( UI.Element.prototype );

UI.Select.prototype.setMultiple = function ( boolean ) {

	this.dom.multiple = boolean;

	return this;

};

UI.Select.prototype.setOptions = function ( options ) {

	var selected = this.dom.value;

	while ( this.dom.children.length > 0 ) {

		this.dom.removeChild( this.dom.firstChild );

	}

	for ( var key in options ) {

		var option = document.createElement( 'option' );
		option.value = key;
		option.innerHTML = options[ key ];
		this.dom.appendChild( option );

	}

	this.dom.value = selected;

	return this;

};

UI.Select.prototype.getValue = function () {

	return this.dom.value;

};

UI.Select.prototype.setValue = function ( value ) {

	this.dom.value = value;

	return this;

};

// FancySelect

UI.FancySelect = function () {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'div' );
	dom.className = 'Panel FancySelect';
	dom.tabIndex = 0;	// keyup event is ignored without setting tabIndex

	// Broadcast for object selection after arrow navigation
	var changeEvent = document.createEvent('HTMLEvents');
	changeEvent.initEvent( 'change', true, true );

	// Prevent native scroll behavior
	dom.addEventListener( 'keydown', function (event) {

		switch ( event.keyCode ) {
			case 38: // up
			case 40: // down
				event.preventDefault();
				event.stopPropagation();
				break;
		}

	}, false);

	// Keybindings to support arrow navigation
	dom.addEventListener( 'keyup', function (event) {

		switch ( event.keyCode ) {
			case 38: // up
			case 40: // down
				scope.selectedIndex += ( event.keyCode == 38 ) ? -1 : 1;

				if ( scope.selectedIndex >= 0 && scope.selectedIndex < scope.options.length ) {

					// Highlight selected dom elem and scroll parent if needed
					scope.setValue( scope.options[ scope.selectedIndex ].value );

					// Invoke object/helper/mesh selection logic
					scope.dom.dispatchEvent( changeEvent );

				}

				break;
		}
	}, false);

	this.dom = dom;

	this.options = [];
	this.selectedIndex = -1;
	this.selectedValue = null;

	return this;

};

UI.FancySelect.prototype = Object.create( UI.Element.prototype );

UI.FancySelect.prototype.setOptions = function ( options ) {

	var scope = this;

	var changeEvent = document.createEvent( 'HTMLEvents' );
	changeEvent.initEvent( 'change', true, true );

	while ( scope.dom.children.length > 0 ) {

		scope.dom.removeChild( scope.dom.firstChild );

	}

	scope.options = [];

	for ( var i = 0; i < options.length; i ++ ) {

		var option = options[ i ];

		var div = document.createElement( 'div' );
		div.className = 'option';
		div.innerHTML = option.html;
		div.value = option.value;
		scope.dom.appendChild( div );

		scope.options.push( div );

		div.addEventListener( 'click', function ( event ) {

			scope.setValue( this.value );
			scope.dom.dispatchEvent( changeEvent );

		}, false );

	}

	return scope;

};

UI.FancySelect.prototype.getValue = function () {

	return this.selectedValue;

};

UI.FancySelect.prototype.setValue = function ( value ) {

	for ( var i = 0; i < this.options.length; i ++ ) {

		var element = this.options[ i ];

		if ( element.value === value ) {

			element.classList.add( 'active' );

			// scroll into view

			var y = element.offsetTop - this.dom.offsetTop;
			var bottomY = y + element.offsetHeight;
			var minScroll = bottomY - this.dom.offsetHeight;

			if ( this.dom.scrollTop > y ) {

				this.dom.scrollTop = y

			} else if ( this.dom.scrollTop < minScroll ) {

				this.dom.scrollTop = minScroll;

			}

			this.selectedIndex = i;

		} else {

			element.classList.remove( 'active' );

		}

	}

	this.selectedValue = value;

	return this;

};


// Checkbox

UI.Checkbox = function ( boolean ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Checkbox';
	dom.type = 'checkbox';

	this.dom = dom;
	this.setValue( boolean );

	return this;

};

UI.Checkbox.prototype = Object.create( UI.Element.prototype );

UI.Checkbox.prototype.getValue = function () {

	return this.dom.checked;

};

UI.Checkbox.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		this.dom.checked = value;

	}

	return this;

};


// Color

UI.Color = function () {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Color';
	dom.style.width = '4em';
	dom.style.height = '2em';
	dom.style.border = '0px';
	dom.style.padding = '0px';
	dom.style.backgroundColor = 'transparent';

	try {

		dom.type = 'color';
		dom.value = '#ffffff';

	} catch ( exception ) {}

	this.dom = dom;

	return this;

};

UI.Color.prototype = Object.create( UI.Element.prototype );

UI.Color.prototype.getValue = function () {

	return this.dom.value;

};

UI.Color.prototype.getHexValue = function () {

	return parseInt( this.dom.value.substr( 1 ), 16 );

};

UI.Color.prototype.setValue = function ( value ) {

	this.dom.value = value;

	return this;

};

UI.Color.prototype.setHexValue = function ( hex ) {

	this.dom.value = "#" + ( '000000' + hex.toString( 16 ) ).slice( -6 );

	return this;

};


// Number

UI.Number = function ( number ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Number';
	dom.value = '0.00';

	dom.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

		if ( event.keyCode === 13 ) dom.blur();

	}, false );

	this.min = - Infinity;
	this.max = Infinity;

	this.precision = 2;
	this.step = 1;

	this.dom = dom;
	this.setValue( number );

	var changeEvent = document.createEvent( 'HTMLEvents' );
	changeEvent.initEvent( 'change', true, true );

	var distance = 0;
	var onMouseDownValue = 0;

	var pointer = new THREE.Vector2();
	var prevPointer = new THREE.Vector2();

	var onMouseDown = function ( event ) {

		event.preventDefault();

		distance = 0;

		onMouseDownValue = parseFloat( dom.value );

		prevPointer.set( event.clientX, event.clientY );

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	};

	var onMouseMove = function ( event ) {

		var currentValue = dom.value;

		pointer.set( event.clientX, event.clientY );

		distance += ( pointer.x - prevPointer.x ) - ( pointer.y - prevPointer.y );

		var number = onMouseDownValue + ( distance / ( event.shiftKey ? 5 : 50 ) ) * scope.step;

		dom.value = Math.min( scope.max, Math.max( scope.min, number ) ).toFixed( scope.precision );

		if ( currentValue !== dom.value ) dom.dispatchEvent( changeEvent );

		prevPointer.set( event.clientX, event.clientY );

	};

	var onMouseUp = function ( event ) {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		if ( Math.abs( distance ) < 2 ) {

			dom.focus();
			dom.select();

		}

	};

	var onChange = function ( event ) {

		var number = parseFloat( dom.value );

		dom.value = isNaN( number ) === false ? number : 0;

	};

	var onFocus = function ( event ) {

		dom.style.backgroundColor = '';
		dom.style.borderColor = '#ccc';
		dom.style.cursor = '';

	};

	var onBlur = function ( event ) {

		dom.style.backgroundColor = 'transparent';
		dom.style.borderColor = 'transparent';
		dom.style.cursor = 'col-resize';

	};

	dom.addEventListener( 'mousedown', onMouseDown, false );
	dom.addEventListener( 'change', onChange, false );
	dom.addEventListener( 'focus', onFocus, false );
	dom.addEventListener( 'blur', onBlur, false );

	return this;

};

UI.Number.prototype = Object.create( UI.Element.prototype );


UI.Number.prototype.getValue = function () {

	return parseFloat( this.dom.value );

};

UI.Number.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		this.dom.value = value.toFixed( this.precision );

	}

	return this;

};

UI.Number.prototype.setRange = function ( min, max ) {

	this.min = min;
	this.max = max;

	return this;

};

UI.Number.prototype.setPrecision = function ( precision ) {

	this.precision = precision;

	return this;

};


// Integer

UI.Integer = function ( number ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Number';
	dom.value = '0.00';

	dom.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

	}, false );

	this.min = - Infinity;
	this.max = Infinity;

	this.step = 1;

	this.dom = dom;
	this.setValue( number );

	var changeEvent = document.createEvent( 'HTMLEvents' );
	changeEvent.initEvent( 'change', true, true );

	var distance = 0;
	var onMouseDownValue = 0;

	var pointer = new THREE.Vector2();
	var prevPointer = new THREE.Vector2();

	var onMouseDown = function ( event ) {

		event.preventDefault();

		distance = 0;

		onMouseDownValue = parseFloat( dom.value );

		prevPointer.set( event.clientX, event.clientY );

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	};

	var onMouseMove = function ( event ) {

		var currentValue = dom.value;

		pointer.set( event.clientX, event.clientY );

		distance += ( pointer.x - prevPointer.x ) - ( pointer.y - prevPointer.y );

		var number = onMouseDownValue + ( distance / ( event.shiftKey ? 5 : 50 ) ) * scope.step;

		dom.value = Math.min( scope.max, Math.max( scope.min, number ) ) | 0;

		if ( currentValue !== dom.value ) dom.dispatchEvent( changeEvent );

		prevPointer.set( event.clientX, event.clientY );

	};

	var onMouseUp = function ( event ) {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		if ( Math.abs( distance ) < 2 ) {

			dom.focus();
			dom.select();

		}

	};

	var onChange = function ( event ) {

		var number = parseInt( dom.value );

		if ( isNaN( number ) === false ) {

			dom.value = number;

		}

	};

	var onFocus = function ( event ) {

		dom.style.backgroundColor = '';
		dom.style.borderColor = '#ccc';
		dom.style.cursor = '';

	};

	var onBlur = function ( event ) {

		dom.style.backgroundColor = 'transparent';
		dom.style.borderColor = 'transparent';
		dom.style.cursor = 'col-resize';

	};

	dom.addEventListener( 'mousedown', onMouseDown, false );
	dom.addEventListener( 'change', onChange, false );
	dom.addEventListener( 'focus', onFocus, false );
	dom.addEventListener( 'blur', onBlur, false );

	return this;

};

UI.Integer.prototype = Object.create( UI.Element.prototype );

UI.Integer.prototype.getValue = function () {

	return parseInt( this.dom.value );

};

UI.Integer.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		this.dom.value = value | 0;

	}

	return this;

};

UI.Integer.prototype.setRange = function ( min, max ) {

	this.min = min;
	this.max = max;

	return this;

};


// Break

UI.Break = function () {

	UI.Element.call( this );

	var dom = document.createElement( 'br' );
	dom.className = 'Break';

	this.dom = dom;

	return this;

};

UI.Break.prototype = Object.create( UI.Element.prototype );


// HorizontalRule

UI.HorizontalRule = function () {

	UI.Element.call( this );

	var dom = document.createElement( 'hr' );
	dom.className = 'HorizontalRule';

	this.dom = dom;

	return this;

};

UI.HorizontalRule.prototype = Object.create( UI.Element.prototype );


// Button

UI.Button = function ( value ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'button' );
	dom.className = 'Button';

	this.dom = dom;
	this.dom.textContent = value;

	return this;

};

UI.Button.prototype = Object.create( UI.Element.prototype );

UI.Button.prototype.setLabel = function ( value ) {

	this.dom.textContent = value;

	return this;

};


// Sound

UI.Sound = function (  ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'div' );
	dom.className = 'SoundDrop';

	this.dom = dom;

	this.dom.dropArea = document.createElement( 'div' );
	this.dom.dropArea.className = 'dropArea';
	this.dom.dropArea.textContent = 'Drop audio file here';

	this.dom.appendChild( this.dom.dropArea );

	var playButton = document.createElement( 'button' );
	playButton.textContent = '>';
	playButton.style.display = 'none';
	this.dom.playButton = playButton;

	this.dom.appendChild( playButton );


	this.dom._deleteSoundButton = document.createElement( 'button' );
	this.dom._deleteSoundButton.className = 'deleteButton';
	this.dom._deleteSoundButton.textContent = 'x';
	this.dom._deleteSoundButton.addEventListener( 'click', this.setValue.bind(this) );

	// Setup the dnd listeners.
	this.dom.addEventListener('dragover', this.handleDragOver.bind(this), false);
	this.dom.addEventListener('drop', this.handleFileSelect.bind(this), false);

	// create the (initially inactive) play listeners
	this._mouseListeners = {
		down: this.play.bind(this),
		up: this.stop.bind(this)
	};

	return this;

};

UI.Sound.prototype = Object.create( UI.Element.prototype );

UI.Sound.prototype.setLabel = function ( value ) {

	this.dom.textContent = value;

	return this;

};

UI.Sound.prototype.handleFileSelect = function(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	var files = evt.dataTransfer.files; // FileList object.

	if (files && files[0]) {
		this.setValue( files[0] );
	}
}

UI.Sound.prototype.handleDragOver = function(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

UI.Sound.prototype.getValue = function() {
	return this.sound;
};

// notSetInUI: is a hack for the template instance link functionality.
// it is needed in order that there is no change event triggered, when the value is set in code
// and not by user interaction.
UI.Sound.prototype.setValue = function(sound, notSetInUI) {

	if (sound instanceof Blob) {

		// add sound
		this.sound = sound;
		editor.soundCollection.add( sound, function( buffer ) {

			var changeEvent = document.createEvent('HTMLEvents');
			changeEvent.initEvent( 'change', true, true );
			changeEvent.buffer = buffer;
			if(!notSetInUI){
				this.dom.dispatchEvent( changeEvent );
			}


		}.bind(this) );
		this.dom.dropArea.textContent = sound.name;
		this.dom.dropArea.appendChild ( this.dom._deleteSoundButton );
		this.dom.playButton.style.display = '';
		this.dom.playButton.addEventListener( 'mousedown', this._mouseListeners.down, false );
		this.dom.playButton.addEventListener( 'mouseup', this._mouseListeners.up, false );

	} else {

		// remove sound
		this.stop();
		this.dom.playButton.style.display = 'none';
		this.dom.playButton.removeEventListener( 'mousedown', this._mouseListeners.down, false );
		this.dom.playButton.removeEventListener( 'mouseup', this._mouseListeners.up, false );
		this.dom.dropArea.textContent = 'Drop audio file here';
		this.sound = undefined;

		var changeEvent = document.createEvent('HTMLEvents');
		changeEvent.initEvent( 'change', true, true );
		if(!notSetInUI){
			this.dom.dispatchEvent( changeEvent );
		}
	}

};

UI.Sound.prototype.play = function() {
	console.log('play');
	if (this.sound) {
		editor.soundCollection.stop(this.sound);
		editor.soundCollection.play(this.sound);
	}
}

UI.Sound.prototype.stop = function() {
	if (this.sound) {
		editor.soundCollection.stop(this.sound);
	}
}



// Events
UI.EventList = function (  ) {

	UI.Element.call( this );

	var scope = this;

	this.eventList = [];


	var dom = document.createElement( 'div' );
	dom.className = 'EventList';

	this.dom = dom;

	this.dom.addButton = document.createElement( 'button' );
	this.dom.addButton.textContent = '+';
	this.dom.appendChild( this.dom.addButton );

	this.dom.addButton.addEventListener('click', this.add.bind(this), false);

	this.dom.eventTemplate = document.createElement( 'div' );
	this.dom.eventTemplate.innerHTML = this.createTemplate();

	this.dom._changeEvent = document.createEvent('HTMLEvents');
	this.dom._changeEvent.initEvent( 'change', true, true );
	this.fireChange = function() { this.dom.dispatchEvent( this.dom._changeEvent ); }.bind( this );

	return this;

};

UI.EventList.prototype = Object.create( UI.Element.prototype );

// triggerProperties and actionProperties is where you can define your triggers and actions!
// triggerProperties are defined in editor!
//UI.EventList.prototype.triggerProperties = {
//	"Touch Fist": {
//
//	},
//	"Touch Point": {
//
//	},
//	"Touch Stroke": {
//
//	},
//	Collision: {
//
//	},
//	Appear: {
//
//	}
//};


UI.EventList.prototype.createTemplate = function () {

	this.triggerProperties = editor.getTriggerProperties();

	var triggerHTML = '\
	<select size="1" class="eventTriggerSelector">\
		<option>...</option>';

	for(var trigger in this.triggerProperties){
		triggerHTML += '<option>'+trigger+'</option>';
	}

	triggerHTML += '</select>';

	var actionHTML = '\
	<select size="1" class="eventActionSelector" style="display: none;">\
		<option>...</option>\
		<option>Toss</option>\
		<option>Play sound</option>\
		<option>Stop sounds</option>\
		<option>Change Static</option>\
		<option>Notify Listeners</option>\
		<option>Resurrect</option>\
	</select>\
	<button style="display: none;">...</button>\
	<button class="icon-del-small eventDeleteButton"></button>\
	<div class="eventProperties" style="display: none;"></div>';

	return triggerHTML + actionHTML;
};

UI.EventList.prototype.actionProperties = {
    Toss: {
        getUI: function (  ) {

            var container = new UI.Panel();
            var xPanel = new UI.Panel();
            var yPanel = new UI.Panel();
            var zPanel = new UI.Panel();
            var randomPanel = new UI.Panel();

            // random text
            randomPanel.add(new UI.Text('').setWidth('140px'));
            randomPanel.add(new UI.Text('random'));

            // x property
            xPanel.add( new UI.Text( 'X' ).setWidth( '90px' ) );
            xPanel.add( new UI.Number( 0 ).setRange( -1, 1 ).onChange( this.fireChange ).setWidth('40px') );

            xPanel.add( new UI.Text( 'from' ).setMargin('2px').setDisplay('none') );
            xPanel.add( new UI.Input().onChange( this.fireChange ).setWidth('20px').setDisplay('none'));
            xPanel.add( new UI.Text( '').setClass('hiddenId').setWidth( '0px' ) );
            xPanel.add( new UI.Text( 'to' ).setMargin('2px').setDisplay('none') );
            xPanel.add( new UI.Input().onChange( this.fireChange ).setWidth('20px').setDisplay('none'));

            xPanel.add( new UI.Checkbox(false).setWidth('40px').onChange(update));
            xPanel.add( new UI.Text( '').setClass('hiddenId').setWidth( '0px' ) );

            // y property
            yPanel.add( new UI.Text( 'Y' ).setWidth( '90px' ) );
            yPanel.add( new UI.Number( 0 ).setRange( -1, 1 ).onChange( this.fireChange ).setWidth('40px') );

            yPanel.add( new UI.Text( 'from' ).setMargin('2px').setDisplay('none') );
            yPanel.add( new UI.Input().onChange( this.fireChange ).setWidth('20px').setDisplay('none'));
            yPanel.add( new UI.Text( '').setClass('hiddenId').setWidth( '0px' ) );
            yPanel.add( new UI.Text( 'to' ).setMargin('2px').setDisplay('none') );
            yPanel.add( new UI.Input().onChange( this.fireChange ).setWidth('20px').setDisplay('none'));

            yPanel.add( new UI.Checkbox(false).setWidth('40px').onChange(update));
            yPanel.add( new UI.Text( '').setClass('hiddenId').setWidth( '0px' ) );

            // z Property
            zPanel.add( new UI.Text( 'Z' ).setWidth( '90px' ) );
            zPanel.add( new UI.Number( 0 ).setRange( -1, 1 ).onChange( this.fireChange ).setWidth('40px') );

            zPanel.add( new UI.Text( 'from' ).setMargin('2px').setDisplay('none') );
            zPanel.add( new UI.Input().onChange( this.fireChange ).setWidth('20px').setDisplay('none'));
            zPanel.add( new UI.Text( '').setClass('hiddenId').setWidth( '0px' ) );
            zPanel.add( new UI.Text( 'to' ).setMargin('2px').setDisplay('none') );
            zPanel.add( new UI.Input().onChange( this.fireChange ).setWidth('20px').setDisplay('none'));

            zPanel.add( new UI.Checkbox(false).setWidth('40px').onChange(update));
            zPanel.add( new UI.Text( '').setClass('hiddenId').setWidth( '0px' ) );

            container.add(randomPanel);
            container.add( xPanel );
            container.add( yPanel );
            container.add( zPanel );
            return container;

            function update() {
                var text = container.dom.querySelectorAll('span.Text');
                var input = container.dom.querySelectorAll('input.Input');
                var checkBox = container.dom.querySelectorAll('input.Checkbox');
                var numbers = container.dom.querySelectorAll('input.Number');

                if (checkBox[0].checked) {
                    $(input[0]).show();
                    $(input[1]).show();
                    $(text[3]).show();
                    $(text[4]).show();
                    $(numbers[0]).hide();
                } else if (!checkBox[0].checked) {
                    $(input[0]).hide();
                    $(input[0]).val('');
                    $(input[1]).val('');
                    $(input[1]).hide();
                    $(text[3]).hide();
                    $(text[4]).hide();
                    $(numbers[0]).show();
                }
                if (checkBox[1].checked) {
                    $(input[2]).show();
                    $(input[3]).show();
                    $(text[7]).show();
                    $(text[6]).show();
                    $(numbers[1]).hide();
                } else if (!checkBox[1].checked) {
                    $(input[2]).hide();
                    $(input[2]).val('');
                    $(input[3]).val('');
                    $(input[3]).hide();
                    $(text[7]).hide();
                    $(text[6]).hide();
                    $(numbers[1]).show();
                }
                if (checkBox[2].checked) {
                    $(input[4]).show();
                    $(input[5]).show();
                    $(text[9]).show();
                    $(text[10]).show();
                    $(numbers[2]).hide();
                } else if (!checkBox[2].checked) {
                    $(input[4]).hide();
                    $(input[4]).val('');
                    $(input[5]).val('');
                    $(input[5]).hide();
                    $(text[9]).hide();
                    $(text[10]).hide();
                    $(numbers[2]).show();
                }
            }

        },
        getData: function ( container, resultObject ) {
            var text = container.dom.querySelectorAll('span.Text');
            var input = container.dom.querySelectorAll('input.Input');
            var numbers = container.dom.querySelectorAll('input.Number');
            var checkBox = container.dom.querySelectorAll('input.Checkbox');

            // make Fields empty if no value entered
            if (isNaN(input[0].value) || isNaN(input[1].value)) {
                input[0].value = '';
                input[1].value = '';
            }
            if (isNaN(input[2].value) || isNaN(input[3].value)) {
                input[2].value = '';
                input[3].value = '';
            }
            if (isNaN(input[4].value) || isNaN(input[5].value)) {
                input[4].value = '';
                input[5].value = '';
            }

            resultObject.x = parseFloat(numbers[0].value);
            resultObject.y = parseFloat(numbers[1].value);
            resultObject.z = parseFloat(numbers[2].value);

            // random TOSS
            resultObject.xIsRandomFrom = parseFloat(input[0].value);
            resultObject.yIsRandomFrom = parseFloat(input[2].value);
            resultObject.zIsRandomFrom = parseFloat(input[4].value);
            resultObject.xIsRandomTo = parseFloat(input[1].value);
            resultObject.yIsRandomTo = parseFloat(input[3].value);
            resultObject.zIsRandomTo = parseFloat(input[5].value);

            // random CHECKBOXES
            resultObject.xIsRandom = checkBox[0].checked;
            resultObject.yIsRandom = checkBox[1].checked;
            resultObject.zIsRandom = checkBox[2].checked;

            // hiding, showing fields and texts
            if (checkBox[0].checked) {
                $(input[0]).show();
                $(input[1]).show();
                $(text[3]).show();
                $(text[4]).show();
                $(numbers[0]).hide();
            } else if (!checkBox[0].checked) {
                $(input[0]).hide();
                $(input[1]).hide();
                $(text[3]).hide();
                $(text[4]).hide();
                $(numbers[0]).show();
            }
            if (checkBox[1].checked) {
                $(input[2]).show();
                $(input[3]).show();
                $(text[7]).show();
                $(text[6]).show();
                $(numbers[1]).hide();
            } else if (!checkBox[1].checked) {
                $(input[2]).hide();
                $(input[3]).hide();
                $(text[7]).hide();
                $(text[6]).hide();
                $(numbers[1]).show();
            }
            if (checkBox[2].checked) {
                $(input[4]).show();
                $(input[5]).show();
                $(text[9]).show();
                $(text[10]).show();
                $(numbers[2]).hide();
            } else if (!checkBox[2].checked) {
                $(input[4]).hide();
                $(input[5]).hide();
                $(text[9]).hide();
                $(text[10]).hide();
                $(numbers[2]).show();
            }
            //
            //console.log("x from:",resultObject.xIsRandomFrom);
            //console.log("x to:",resultObject.xIsRandomTo);
            //console.log("y from:",resultObject.yIsRandomFrom);
            //console.log("y to:",resultObject.yIsRandomTo);
            //console.log("z from:",resultObject.zIsRandomFrom);
            //console.log("z to:",resultObject.zIsRandomTo);

        },
        setData: function ( container, dataObject ) {
            var text = container.dom.querySelectorAll('span.Text');
            var input = container.dom.querySelectorAll('input.Input');
            var numbers = container.dom.querySelectorAll('input.Number');
            var checkBox = container.dom.querySelectorAll('input.Checkbox');

            // make Fields empty if no value entered
            if (isNaN(input[0].value) || isNaN(input[1].value)) {
                input[0].value = '';
                input[1].value = '';
            }
            if (isNaN(input[2].value) || isNaN(input[3].value)) {
                input[2].value = '';
                input[3].value = '';
            }
            if (isNaN(input[4].value) || isNaN(input[5].value)) {
                input[4].value = '';
                input[5].value = '';
            }

            numbers[0].value = dataObject.x;
            numbers[1].value = dataObject.y;
            numbers[2].value = dataObject.z;

            // random TOSS
            input[0].value = dataObject.xIsRandomFrom;
            input[2].value = dataObject.yIsRandomFrom;
            input[4].value = dataObject.zIsRandomFrom;
            input[1].value = dataObject.xIsRandomTo;
            input[3].value = dataObject.yIsRandomTo;
            input[5].value = dataObject.zIsRandomTo;

            // random CHECKBOXES
            checkBox[0].checked = dataObject.xIsRandom;
            checkBox[1].checked = dataObject.yIsRandom;
            checkBox[2].checked = dataObject.zIsRandom;

            // hiding, showing fields and texts
            if (checkBox[0].checked) {
                $(input[0]).show();
                $(input[1]).show();
                $(text[3]).show();
                $(text[4]).show();
                $(numbers[0]).hide();
            } else if (!checkBox[0].checked) {
                $(input[0]).hide();
                $(input[1]).hide();
                $(text[3]).hide();
                $(text[4]).hide();
                $(numbers[0]).show();
            }
            if (checkBox[1].checked) {
                $(input[2]).show();
                $(input[3]).show();
                $(text[7]).show();
                $(text[6]).show();
                $(numbers[1]).hide();
            } else if (!checkBox[1].checked) {
                $(input[2]).hide();
                $(input[3]).hide();
                $(text[7]).hide();
                $(text[6]).hide();
                $(numbers[1]).show();
            }
            if (checkBox[2].checked) {
                $(input[4]).show();
                $(input[5]).show();
                $(text[9]).show();
                $(text[10]).show();
                $(numbers[2]).hide();
            } else if (!checkBox[2].checked) {
                $(input[4]).hide();
                $(input[5]).hide();
                $(text[9]).hide();
                $(text[10]).hide();
                $(numbers[2]).show();
            }

        }
    },
	"Play sound": {
		getUI: function ( eventNode ) {

			var self = this;
			var container = new UI.Panel();
			var sound = new UI.Sound().onChange( function( event ) {

				if ( event.buffer ) {

					/*if ( editor.config.getKey('defaultColor') == 'RMS' ) {

						editor.signals.soundAdded.dispatch( event.buffer, editor.selected.material );

					}*/

				}

				// does it need this?
				self.fireChange();

			} );

			container.add( new UI.Text( 'Sound' ).setWidth( '90px' ) );
			container.add( sound );
			eventNode._soundProperty = sound;

			return container;

		},
		getData: function ( container, resultObject, eventNode ) {

			//save the sound itself in the event list
			resultObject.sound = eventNode._soundProperty.getValue();


		},
		setData: function ( container, dataObject, eventNode ) {

			eventNode._soundProperty.setValue( dataObject.sound, true);

		}
	},
	"Change Static": {
		getUI: function ( eventNode ) {

			var container = new UI.Panel();

			container.add( new UI.Text( 'Action' ).setWidth( '90px' ) );
			container.add( new UI.Select().setOptions( { 0:'Set dynamic', 1:'Set static', 2:'Toggle static' } ).onChange( this.fireChange ) );

			return container;

		},
		getData: function ( container, resultObject, eventNode ) {

			var staticSelect = container.dom.querySelector('select');
			resultObject.mode = staticSelect.value;

		},
		setData: function ( container, dataObject ) {

			var staticSelect = container.dom.querySelector('select');
			staticSelect.value = dataObject.mode;
		}
	},
	"Stop sounds": { },
	"Notify Listeners":{
		getUI: function ( ) {

			var container = new UI.Panel();

			container.add( new UI.Text( 'Name' ).setWidth( '90px' ) );
			container.add( new UI.Input().onChange( this.fireChange ));
			container.add( new UI.Text( '').setClass('hiddenId').setWidth( '0px' ) );

			return container;

		},
		getData: function ( container, resultObject ) {

			var name = container.dom.querySelector('input.Input');
			resultObject.mode = name.value;

			var id = container.dom.querySelector('span.hiddenId').value;
			if(!id){
				// generate id per topic // todo generate real id
				resultObject['topicId'] = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

			}else{
				resultObject['topicId'] = id;
			}

		},
		setData: function ( container, dataObject ) {

			var name = container.dom.querySelector('input.Input');
			name.value = dataObject.mode;

			var id = container.dom.querySelector('span.hiddenId');
			id.value = dataObject.topicId;

		}
	},
	"Resurrect":{
		getUI: function ( ) {

			var container = new UI.Panel();

			container.add( new UI.Text( 'Delay' ).setWidth( '90px' ) );
			container.add( new UI.Number( 0.5 ).setRange(0, 10000).onChange( this.fireChange ));

			return container;

		},
		getData: function ( container, resultObject, eventNode ) {

			var delay = container.dom.querySelector('input.Number');
			resultObject.mode = delay.value;

		},
		setData: function ( container, dataObject ) {

			var delay = container.dom.querySelector('input.Number');
			delay.value = dataObject.mode;

		}
	}

};

UI.EventList.prototype.setProperties = function ( trigger, action, propertiesElement, eventNode ) {

	// empty the maybe already used property field
	propertiesElement.clear();

	if ( this.triggerProperties[ trigger ] && this.triggerProperties[ trigger ].getUI ) propertiesElement.add( this.triggerProperties[ trigger ].getUI.call( this, eventNode ) );
	if ( this.actionProperties[ action ] && this.actionProperties[ action ].getUI ) propertiesElement.add( this.actionProperties[ action ].getUI.call( this, eventNode ) );

};

UI.EventList.prototype.getValue = function ( ) {

	var eventList = [];

	// get event and action for every row, and read the data
	var events = this.eventList;

	for(var i = 0; i < events.length; ++i) {

		var event = events[ i ];

		if ( event.parentNode != this.dom ) continue;

		var trigger = event.querySelector('select').value;
		var action = event.getElementsByClassName('eventActionSelector')[0].value;
		if ( trigger != '...' && action != '...' ) {

			var data = {
				trigger: { type: trigger },
				action: { type: action }
			};

			var propertiesElement = new UI.Panel( event.getElementsByClassName('eventProperties')[0] );

				if ( this.triggerProperties[ trigger ].getData ) this.triggerProperties[ trigger ].getData( propertiesElement, data.trigger, event );
				if ( this.actionProperties[ action ].getData ) this.actionProperties[ action ].getData( propertiesElement, data.action, event );

			eventList.push( data );
		}

	}

	return eventList;

};

UI.EventList.prototype.setValue = function ( events ) {

	this.dom.eventTemplate.innerHTML = this.createTemplate();

	// first, clear all entries
	var oldRows = this.dom.parentNode.querySelectorAll( 'div.EventList > div' );
	for ( var i = 0; i < oldRows.length; i++ ) {

		this.dom.removeChild( oldRows[ i ] );

	}
	this.eventList = [];

	if ( events != undefined ) {

		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("change", false, true);

		//temporarily disable the change events or they'll get fired all the time while setting default data
		var _fireChangeBackup = this.fireChange;
		this.fireChange = function() { };

		for ( var i = 0; i < events.length; i++ ) {

			var event = events[ i ];

			// take current trigger type of linked observable by id
			if(event.trigger.topicId) {
				for(var triggr in this.triggerProperties){
					if ( this.triggerProperties[triggr].topicId && this.triggerProperties[triggr].topicId == event.trigger.topicId ){
						event.trigger.type = triggr;
					}
				}
			}

			// only add the event if the linked observable still exists, otherwise it is not added to the eventlist.
			if(this.triggerProperties[event.trigger.type]){
				var row = this.add();

				var propertiesElement = new UI.Panel(row.getElementsByClassName('eventProperties')[0]);

				// set selects
				var selects = row.querySelectorAll('select');

				selects[0].value = event.trigger.type;
				selects[0].dispatchEvent(evt);
				selects[1].value = event.action.type;
				selects[1].dispatchEvent(evt);

				var eventNode = this.eventList[this.eventList.length - 1];

				// set properties
				if (this.triggerProperties[event.trigger.type].setData) this.triggerProperties[event.trigger.type].setData(propertiesElement, event.trigger, eventNode);
				if (this.actionProperties[event.action.type].setData) this.actionProperties[event.action.type].setData(propertiesElement, event.action, eventNode);
			}
		}

		// activate firing changes again
		this.fireChange = _fireChangeBackup;

	}

};


UI.EventList.prototype.setLabel = function ( value ) {

	this.dom.textContent = value;

	return this;

};

UI.EventList.prototype.add = function() {

	//properties will be attached to clone whenever necessary.
	var clone = this.dom.eventTemplate.cloneNode(true);

	//this.dom.insertBefore(clone, this.dom.firstChild);
	this.dom.appendChild(clone);

	var triggerDropdown = clone.querySelector('select');

	//first select
	triggerDropdown.addEventListener('change', function(event) {

		//get the next (hidden) select
		var actionSelect = event.target.nextSibling.nextSibling;

		if (event.target.selectedIndex == 0) {
			//selected the empty option. hide further elements.
			actionSelect.style.display = 'none';
		} else {
			actionSelect.style.display = '';
		}

	}.bind(this), false);


	//second select
	clone.getElementsByClassName('eventActionSelector')[0].addEventListener('change', function(event) {
		var actionSelect = event.target;

		if (actionSelect.selectedIndex == 0) {
			//selected the empty option. hide further elements.
			clone.querySelector('button').style.display = 'none';
		} else {
			clone.querySelector('button').style.display = '';

			this.setProperties( triggerDropdown.value, event.target.value, propertiesElement, clone );
		}

		this.fireChange();
	}.bind(this), false);

	var propertiesElement = new UI.Panel( clone.getElementsByClassName('eventProperties')[0] );

	//properties hide/show
	clone.querySelector('button').addEventListener('click', function(event) {

		//get the next (hidden) select

		if (propertiesElement.dom.style.display == 'none') {
			//selected the empty option.remove selection
			propertiesElement.dom.style.display = '';
			event.target.innerHTML = '-';
		} else {
			propertiesElement.dom.style.display = 'none';
			event.target.innerHTML = '...';
		}

	}.bind(this), false);

	clone.getElementsByClassName('eventDeleteButton')[0].addEventListener('click', function(event) {

		this.eventList.splice( this.eventList.indexOf( clone ), 1 );
		this.dom.removeChild( clone );
		this.fireChange();

	}.bind(this), false);

	this.eventList.push( clone );

	return clone;
};



// RuntimeMaterial
UI.RuntimeMaterial = function (  ) {

	UI.Element.call( this );

	var scope = this;

	this.runtimematerialList = [];

	var dom = document.createElement( 'div' );
	dom.className = 'RuntimeMaterial';

	this.dom = dom;

	this.dom.eventTemplate = document.createElement( 'div' );
	this.dom.eventTemplate.innerHTML = '\
	<select size="1">\
		<option>...</option>\
		<option>Amplitude</option>\
		<option>Time</option>\
	</select>\
	<select size="1" class="eventActionSelector" style="display: none;">\
		<option>...</option>\
		<option>Brightness</option>\
		<option>Color</option>\
		<option>Edges</option>\
	</select>\
	<button style="display: none;">+</button>\
	<button class="eventDeleteButton icon-del-small">\
	<div class="eventProperties" style="display: none;"></div>';


	this.dom.addButton = document.createElement( 'button' );
	this.dom.addButton.textContent = '+';
	this.dom.appendChild( this.dom.addButton );

	this.dom.addButton.addEventListener('click', this.add.bind(this), false);


	this.dom._changeEvent = document.createEvent('HTMLEvents');
	this.dom._changeEvent.initEvent( 'change', true, true );
	this.fireChange = function() { this.dom.dispatchEvent( this.dom._changeEvent ); }.bind( this );

	return this;

};

UI.RuntimeMaterial.prototype = Object.create( UI.Element.prototype );

// tripperProperties and actionProperties is where you can define your triggers and actions!
UI.RuntimeMaterial.prototype.triggerProperties = {
	"Amplitude": {
		getUI: function ( eventNode ) {

			var container = new UI.Panel();

			container.add( new UI.Text( 'Scale' ).setWidth( '90px' ) );
			var scale = new UI.Number(1).setRange(0,100);
			scale.setClass('amplitudeScale');
			scale.onChange( this.fireChange );
			container.add( scale );

			return container;

		},
		getData: function ( container, resultObject, eventNode ) {

			var scale = container.dom.querySelector('.amplitudeScale');
			resultObject.scale = scale.value;

		},
		setData: function ( container, dataObject ) {

			var scale = container.dom.querySelector('.amplitudeScale');
			scale.value = dataObject.scale;

		}
	},
	"Time": {
		getUI: function ( eventNode ) {

			var container = new UI.Panel();

			container.add( new UI.Text( 'Easing' ).setWidth( '90px' ) );
			var select = new UI.Select().setOptions( Object.keys(Play.Effects.prototype.easing) );
			select.setClass('timeEasing');
			select.onChange( this.fireChange );
			container.add( select );

			return container;

		},
		getData: function ( container, resultObject, eventNode ) {

			var easingSelect = container.dom.querySelector('.timeEasing');
			resultObject.easing = easingSelect.options[easingSelect.selectedIndex].text;

		},
		setData: function ( container, dataObject ) {

			var easingSelect = container.dom.querySelector('.timeEasing');
			for (var i = 0; i < easingSelect.options.length; i++) {
				if (easingSelect.options[i].text === dataObject.easing) {
					easingSelect.selectedIndex = i;
					break;
				}
			}

		}
	}
};

UI.RuntimeMaterial.prototype.actionProperties = {
	Brightness: {

	},
	"Color": {
		getUI: function ( eventNode ) {

			var container = new UI.Panel();

			container.add( new UI.Text( 'Color' ).setWidth( '90px' ) );
			var colorInput = new UI.Color();
			colorInput.setClass('colorSelect');
			colorInput.onChange( this.fireChange );
			container.add( colorInput );

			return container;

		},
		getData: function ( container, resultObject, eventNode ) {

			var colorSelect = container.dom.querySelector('.colorSelect');
			resultObject.color = colorSelect.value;

		},
		setData: function ( container, dataObject ) {

			var colorSelect = container.dom.querySelector('.colorSelect');
			colorSelect.value = dataObject.color;

		}
	},
	Edges: {

	}
};

UI.RuntimeMaterial.prototype.setProperties = function ( trigger, action, propertiesElement, eventNode ) {

	// empty the maybe already used property field
	propertiesElement.clear();

	if ( this.triggerProperties[ trigger ] && this.triggerProperties[ trigger ].getUI ) propertiesElement.add( this.triggerProperties[ trigger ].getUI.call( this, eventNode ) );
	if ( this.actionProperties[ action ] && this.actionProperties[ action ].getUI ) propertiesElement.add( this.actionProperties[ action ].getUI.call( this, eventNode ) );

};

UI.RuntimeMaterial.prototype.getValue = function ( ) {

	var runtimematerialList = [];

	// get event and action for every row, and read the data
	var runtimematerials = this.runtimematerialList;

	for(var i = 0; i < runtimematerials.length; ++i) {

		var rm = runtimematerials[ i ];
		if ( rm.parentNode != this.dom ) continue;

		var trigger = rm.querySelector('select').value;
		var action = rm.getElementsByClassName('eventActionSelector')[0].value;
		if ( trigger != '...' && action != '...' ) {

			var data = {
				trigger: { type: trigger },
				action: { type: action }
			}

			var propertiesElement = new UI.Panel( rm.getElementsByClassName('eventProperties')[0] );

			if ( this.triggerProperties[ trigger ].getData ) this.triggerProperties[ trigger ].getData( propertiesElement, data.trigger, rm );
			if ( this.actionProperties[ action ].getData ) this.actionProperties[ action ].getData( propertiesElement, data.action, rm );

			runtimematerialList.push( data );
		}

	}

	return runtimematerialList;

};

UI.RuntimeMaterial.prototype.setValue = function ( events ) {

	// first, clear all entries
	var oldRows = this.dom.parentNode.querySelectorAll( 'div.RuntimeMaterial > div' );
	for ( var i = 0; i < oldRows.length; i++ ) {

		this.dom.removeChild( oldRows[ i ] );

	}
	this.runtimematerialList = [];

	if ( events != undefined ) {

		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("change", false, true);

		//temporarily disable the change events or they'll get fired all the time while setting default data
		var _fireChangeBackup = this.fireChange;
		this.fireChange = function() { };

		for ( var i = 0; i < events.length; i++ ) {

			var event = events[ i ];

			var row = this.add();

			var propertiesElement = new UI.Panel( row.getElementsByClassName('eventProperties')[0] );

			// set selects
			var selects = row.querySelectorAll('select');
			selects[0].value = event.trigger.type;
			selects[0].dispatchEvent(evt);
			selects[1].value = event.action.type;
			selects[1].dispatchEvent(evt);

			var rmNode = this.runtimematerialList[ this.runtimematerialList.length - 1 ];

			// set properties
			if ( this.triggerProperties[ event.trigger.type ].setData ) this.triggerProperties[ event.trigger.type ].setData( propertiesElement, event.trigger, rmNode );
			if ( this.actionProperties[ event.action.type ].setData ) this.actionProperties[ event.action.type ].setData( propertiesElement, event.action, rmNode );
		}

		// activate firing changes again
		this.fireChange = _fireChangeBackup;

	}

}

UI.RuntimeMaterial.prototype.setLabel = function ( value ) {

	this.dom.textContent = value;

	return this;

};

UI.RuntimeMaterial.prototype.add = function() {

	//properties will be attached to clone whenever necessary.
	var clone = this.dom.eventTemplate.cloneNode(true);

	//this.dom.insertBefore(clone,this.dom.firstChild);
	this.dom.appendChild(clone);

	var triggerDropdown = clone.querySelector('select');
	var actionDropdown = clone.getElementsByClassName('eventActionSelector')[0];

	//first select
	triggerDropdown.addEventListener('change', function(event) {

		//get the next (hidden) select
		var actionSelect = event.target.nextSibling.nextSibling;

		if (event.target.selectedIndex == 0) {
			//selected the empty option. hide further elements.
			actionSelect.style.display = 'none';
		} else {
			actionSelect.style.display = '';

			this.setProperties( triggerDropdown.value, actionDropdown.value, propertiesElement, clone );
		}

	}.bind(this), false);


	//second select
	actionDropdown.addEventListener('change', function(event) {
		var actionSelect = event.target;

		if (actionSelect.selectedIndex == 0) {
			//selected the empty option. hide further elements.
			clone.querySelector('button').style.display = 'none';
		} else {
			clone.querySelector('button').style.display = '';

			this.setProperties( triggerDropdown.value, event.target.value, propertiesElement, clone );
		}

		this.fireChange();
	}.bind(this), false);

	var propertiesElement = new UI.Panel( clone.getElementsByClassName('eventProperties')[0] );

	//properties hide/show
	clone.querySelector('button').addEventListener('click', function(event) {

		//get the next (hidden) select

		if (propertiesElement.dom.style.display == 'none') {
			//selected the empty option.remove selection
			propertiesElement.dom.style.display = '';
			event.target.innerHTML = '-';
		} else {
			propertiesElement.dom.style.display = 'none';
			event.target.innerHTML = '+';
		}

	}.bind(this), false);

	clone.getElementsByClassName('eventDeleteButton')[0].addEventListener('click', function(event) {

		this.runtimematerialList.splice( this.runtimematerialList.indexOf( clone ), 1 );
		this.dom.removeChild( clone );
		this.fireChange();

	}.bind(this), false);

	this.runtimematerialList.push( clone );

	return clone;
};

// Behaviors
UI.Behavior = function ( name ) {

	UI.Element.call( this );

	var scope = this;

	this.dom = document.createElement( 'div' );
	this.dom.className = 'Behavior';

	this.dom._changeEvent = document.createEvent('HTMLEvents');
	this.dom._changeEvent.initEvent( 'change', true, true );
	this.fireChange = function() { this.dom.dispatchEvent( this.dom._changeEvent ); }.bind( this );

	this.dom.appendChild( new UI.Text( name ).setWidth( '90px' ).dom );

	this.dom.behaviorCheckbox = new UI.Checkbox( false ).setWidth( '50px' );
	this.dom.behaviorCheckbox.onChange( this.fireChange );
	this.dom.appendChild( this.dom.behaviorCheckbox.dom );

	this.dom.addButton = document.createElement( 'button' );
	this.dom.addButton.textContent = '+';
	this.dom.addButton.style.display = 'none';
	this.dom.addButton.addEventListener('click', this.toggleProperties.bind( this ), false);
	this.dom.appendChild( this.dom.addButton );

	this.dom.behaviorProperties = document.createElement( 'div' );
	this.dom.behaviorProperties.className = 'behaviorProperties';
	this.dom.behaviorProperties.style.display = 'none';
	this.dom.appendChild( this.dom.behaviorProperties );

	return this;

};

UI.Behavior.prototype = Object.create( UI.Element.prototype );

UI.Behavior.prototype.toggleProperties = function (  ) {

	//get the next (hidden) select
	if (this.dom.behaviorProperties.style.display == 'none') {
		//selected the empty option.remove selection
		this.dom.behaviorProperties.style.display = '';
		this.dom.addButton.innerHTML = '-';
	} else {
		this.dom.behaviorProperties.style.display = 'none';
		this.dom.addButton.innerHTML = '+';
	}

};

UI.Behavior.prototype.getValue = function (  ) {

	return this.dom.behaviorCheckbox.getValue();

};

UI.Behavior.prototype.setValue = function ( value ) {

	this.dom.behaviorCheckbox.setValue( value );
	//this.fireChange();

};

UI.Behavior.prototype.getProperties = function (  ) { };
UI.Behavior.prototype.setProperties = function (  ) { };
UI.Behavior.prototype.setPropertiesDOM = function ( html ) {

	this.dom.addButton.style.display = html == undefined ? 'none' : '';

	if ( html !== undefined ) {
		if ( typeof html == 'string' ) {

			this.dom.behaviorProperties.innerHTML = html;

		} else {

			this.dom.behaviorProperties.innerHTML = '';
			this.dom.behaviorProperties.appendChild( html );

		}
	}
};
