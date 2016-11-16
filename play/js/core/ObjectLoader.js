///**
// * @author fiona
// * @author mrdoob / http://mrdoob.com/
// */
//
THREE.ObjectLoader.prototype.parseMaterials = function ( json ) {

    var materials = {};

    if ( json !== undefined ) {

        var loader = new THREE.MaterialLoader();

        for ( var i = 0, l = json.length; i < l; i ++ ) {

            var data = json[ i ];

            var material = loader.parse( data );

            material.uuid = data.uuid;

            material.edges = data.edges;

            material.runtimeMaterials = data.runtimeMaterials;

            // load textures
            if ( data.map ) {
                var loadedFile = editor.loadedTexturesFolder.file( data.map );
                console.log(loadedFile);
                if ( loadedFile ) {
                    material.map = new THREE.Texture(); //shim so that uv buffers get allocated at init

                    var loadedTexture = loadedFile.asArrayBuffer();
                    var file = new Blob([loadedTexture]);

                    var reader = new FileReader();
                    reader.addEventListener( 'load', function ( event ) {

                        var image = document.createElement( 'img' );
                        image.addEventListener( 'load', function( event ) {
                            var args = this;

                            var texture = new THREE.Texture( image );
                            texture.sourceFile = args[ 2 ];
                            texture.sourceBlob = args[ 1 ];
                            texture.needsUpdate = true;

                            args[ 0 ].map = texture;
                            args[ 0 ].needsUpdate = true;

                            editor.signals.materialChanged.dispatch( args[ 0 ] );

                        }.bind( this ), false );

                        image.src = event.target.result;

                    }.bind( [material, file, data.map] ), false );

                    reader.readAsDataURL( file );

                }

            }


            //create a physical material
            var friction = data.friction || 0;
            var restitution = data.restitution || 0;
            material = Physijs.createMaterial(
                material,
                friction,
                restitution
            );


            if ( data.name !== undefined ) material.name = data.name;

            materials[ data.uuid ] = material;

        }

    }

    return materials;

};

// substitutes the sounds with the sound name
var traverseForSound = function ( object ) {

    for (var k in object) {

        if (object.hasOwnProperty( k )) {

            if ( k == 'sound' && object[ k ] != undefined ) {

                var soundName = object[ k ];


                var loadedFile = editor.loadedSoundsFolder.file( soundName );

                if ( loadedFile ) {
                    var loadedSound = loadedFile.asArrayBuffer();
                    object[ k ] = new Blob([loadedSound]);
                    object[ k ].name = soundName;

                } else {

                    console.warn( 'Could not find soundfile ' + soundName );

                }

            } else if ( typeof object[ k ] == 'object' ) {
                //console.log('else');
                traverseForSound( object[ k ]);
            }

        }
    }

};

THREE.ObjectLoader.prototype.parseObject = function () {

    var matrix = new THREE.Matrix4();

    return function (data, geometries, materials) {

        var object;

        switch (data.type) {

            case 'Scene':

                object = new Physijs.Scene({fixedTimeStep: 1 / 120});

                if (data.fog !== undefined) {
                    object.fog = new THREE[data.fog.type](data.fog.color, data.fog.type == 'Fog' ? data.fog.near : data.fog.density, data.fog.far);
                    editor.signals.fogColorChanged.dispatch(data.fog.color);
                    Logger.info('loaded fog', object.fog, "logged by play/index.html, row 295");
                }


                if (data.templates !== undefined) {

                    object.templates = [];

                    for (var i = 0; i < data.templates.length; i++) {

                        var obj = data.templates[i];

                        var geometry = geometries[obj.template.geometry];
                        var material = materials[obj.template.material];

                        var tmpl = this.parseObject(obj.template, geometries, materials);
                        tmpl.isTemplate = true;

                        object.templates.push({
                            template: tmpl,
                            instances: obj.instances
                        });
                    }

                } else {
                    object.templates = [];
                }


                if (data.skybox) {

                    if (data.skybox.textures) {

                        var textureList = [];
                        for (var i = 0; i < 6; i++) {

                            var loadedFile = editor.loadedTexturesFolder.file(data.skybox.textures[i]);

                            if (loadedFile) {

                                var loadedTexture = loadedFile.asArrayBuffer();
                                var file = new Blob([loadedTexture]);

                                var reader = new FileReader();
                                reader.addEventListener('load', function (event) {

                                    var image = document.createElement('img');
                                    image.addEventListener('load', function (event) {
                                        var args = this;

                                        var texture = new THREE.Texture(image);
                                        texture.sourceFile = args[2];
                                        texture.sourceBlob = args[1];
                                        texture.needsUpdate = true;

                                        textureList[args[0]] = texture;
                                        editor.signals.skyboxChanged.dispatch('custom', textureList);

                                    }.bind(this), false);

                                    image.src = event.target.result;

                                }.bind([i, file, data.skybox.textures[i]]), false);

                                reader.readAsDataURL(file);

                            }

                        }

                    }

                    editor.signals.skyboxChanged.dispatch(data.skybox.type);

                }

                object.hasLeapBox = data.hasLeapBox;

                object.maxVelocity = data.maxVelocity ? data.maxVelocity : Infinity;

                if (!data._gravity) {
                    data._gravity = new THREE.Vector3(0, -16, 0)
                }

                object._gravity = data._gravity;
                object.setGravity(object._gravity);

                break;

            case 'PerspectiveCamera':

                object = new THREE.PerspectiveCamera(data.fov, data.aspect, data.near, data.far);

                break;

            case 'OrthographicCamera':

                object = new THREE.OrthographicCamera(data.left, data.right, data.top, data.bottom, data.near, data.far);

                break;

            case 'AmbientLight':

                object = new THREE.AmbientLight(data.color);

                break;

            case 'DirectionalLight':

                object = new THREE.DirectionalLight(data.color, data.intensity);
                object.shadowCameraNear = 0.5;
                object.shadowCameraFar = 30;
                object.shadowCameraLeft = -5;
                object.shadowCameraRight = 5;
                object.shadowCameraTop = 5;
                object.shadowCameraBottom = -3;
                object.castShadow = true;

                break;

            case 'PointLight':

                object = new THREE.PointLight(data.color, data.intensity, data.distance);

                break;

            case 'SpotLight':

                object = new THREE.SpotLight(data.color, data.intensity, data.distance, data.angle, data.exponent);
                object.castShadow = true;

                break;

            case 'HemisphereLight':

                object = new THREE.HemisphereLight(data.color, data.groundColor, data.intensity);

                break;

            case 'Mesh':

                var geometry = geometries[data.geometry];
                var material = materials[data.material];
                var sounds = data.sounds;

                if (geometry === undefined) {

                    console.error('THREE.ObjectLoader: Undefined geometry ' + data.geometry);

                }

                if (material === undefined) {

                    console.error('THREE.ObjectLoader: Undefined material ' + data.material);

                }


                // CUSTOM
                if (data.physiMeshType && Physijs[data.physiMeshType]) {
                    object = new Physijs[data.physiMeshType](geometry, material);
                }
                // END CUSTOM
                else {

                    object = new THREE.Mesh(geometry, material);

                }

                // CUSTOM

                // template link properties for instances
                if( data.isLinked ) {
                    object.isLinked = data.isLinked;
                }

                object.isStatic = data.isStatic;

                if (data.events != undefined) {

                    object.events = data.events;
                    traverseForSound(object.events);
                }

                if (data.behaviors !== undefined) {

                    object.behaviors = data.behaviors;

                }

                // every object will have shadows so it's not exported/imported
                object.castShadow = true;
                object.receiveShadow = true;


                if (material.edges) {
                    editor.setEdge(object);
                }

                /*if ( object.material.map ) {
                 console.log('has map');
                 object.material.map.image.addEventListener( 'load', function( event ) {

                 object.geometry.uvsNeedUpdate = true;
                 object.geometry.buffersNeedUpdate = true;
                 object.material.needsUpdate = true;

                 }, false );
                 }*/

                /*console.log('update uvs', object.geometry.faceVertexUvs[0].length, object.geometry.faceVertexUvs[0][0]);
                 object.geometry.uvsNeedUpdate = true;
                 object.geometry.buffersNeedUpdate = true;
                 object.geometry.stillSameGeometry = true;
                 object.material.needsUpdate = true;*/
                // END CUSTOM

                break;

            case 'Sprite':

                var material = materials[data.material];

                if (material === undefined) {

                    console.error('THREE.ObjectLoader: Undefined material ' + data.material);

                }

                object = new THREE.Sprite(material);

                break;

            default:

                //object = new THREE.Object3D();
                return;

        }

        object.uuid = data.uuid;

        if (data.name !== undefined) object.name = data.name;
        if (data.matrix !== undefined) {

            matrix.fromArray(data.matrix);
            matrix.decompose(object.position, object.quaternion, object.scale);

        } else {

            if (data.position !== undefined) object.position.fromArray(data.position);
            if (data.rotation !== undefined) object.rotation.fromArray(data.rotation);
            if (data.scale !== undefined) object.scale.fromArray(data.scale);

        }

        if (data.visible !== undefined) object.visible = data.visible;
        if (data.userData !== undefined) object.userData = data.userData;

        if (data.children !== undefined) {

            for (var child in data.children) {

                var childObj = this.parseObject(data.children[child], geometries, materials);

                object.add(childObj);

                if (data.templates !== undefined && data.templates.length > 0) {

                    data.templates = parseTemplates( data.templates, childObj );

                }

            }

        }

        return object;

    }

}();


var parseTemplates = function ( importTemplates, instanceObject ) {

    for( var j = 0; j < importTemplates.length; j++){

        var instances = importTemplates[j].instances;

        for( var i = 0; i < instances.length; i++){

            if( instances[i].template ){

                importTemplates = parseTemplates( importTemplates, instanceObject );

            } else {
                if( instances[i] == instanceObject.uuid ){

                    instanceObject.isInstance = true;

                    instances[i] = instanceObject;

                    return importTemplates;
                }
            }

        }

    }

    return importTemplates;
};
