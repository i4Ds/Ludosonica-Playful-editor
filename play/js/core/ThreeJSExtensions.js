    // We also want the objects to clone other stuff, like sounds

    THREE.Object3D.prototype.cloneBase = THREE.Object3D.prototype.clone;
    THREE.Object3D.prototype.clone = function (object, recursive) {

        object = THREE.Object3D.prototype.cloneBase.call(this, object, recursive);

        // clone sounds
        if (this.sounds != undefined) {

            object.sounds = {};

            for (var key in this.sounds) {
                if (this.sounds.hasOwnProperty(key)) {

                    object.sounds[key] = this.sounds[key];

                }
            }
        }
        object = THREE.Object3D.prototype.cloneBase.call(this, object, recursive);

        // clone sounds
        if (this.sounds != undefined) {

            object.sounds = {};

            for (var key in this.sounds) {
                if (this.sounds.hasOwnProperty(key)) {

                    object.sounds[key] = this.sounds[key];

                }
            }
        }

        return object;

    };

    THREE.Geometry.prototype.clone = function () {

        var geometry = new THREE.Geometry(), geomParams = this.parameters;

        var handleParameters = function (type, params) {
            geometry = new type(
                    params[0] ? geomParams[params[0]] : undefined,
                    params[1] ? geomParams[params[1]] : undefined,
                    params[2] ? geomParams[params[2]] : undefined,
                    params[3] ? geomParams[params[3]] : undefined,
                    params[4] ? geomParams[params[4]] : undefined,
                    params[5] ? geomParams[params[5]] : undefined,
                    params[6] ? geomParams[params[6]] : undefined,
                    params[7] ? geomParams[params[7]] : undefined,
                    params[8] ? geomParams[params[8]] : undefined,
                    params[9] ? geomParams[params[9]] : undefined
            );
            /*console.log( geometry, params[0] ? geomParams[ params[0] ] : undefined,
             params[1] ? geomParams[ params[1] ] : undefined,
             params[2] ? geomParams[ params[2] ] : undefined );*/
        };

        if (this instanceof THREE.PlaneGeometry) {

            handleParameters(THREE.PlaneGeometry, ['width', 'height', 'widthSegments', 'heightSegments']);

        } else if (this instanceof THREE.BoxGeometry) {

            handleParameters(THREE.BoxGeometry, ['width', 'height', 'depth', 'widthSegments', 'heightSegments', 'depthSegments']);

        } else if (this instanceof THREE.CircleGeometry) {

            handleParameters(THREE.CircleGeometry, ['radius', 'segments']);

        } else if (this instanceof THREE.CylinderGeometry) {

            handleParameters(THREE.CylinderGeometry, ['radiusTop', 'radiusBottom', 'height', 'radialSegments', 'heightSegments', 'openEnded']);

        } else if (this instanceof THREE.SphereGeometry) {

            handleParameters(THREE.SphereGeometry, ['radius', 'widthSegments', 'heightSegments', 'phiStart', 'phiLength', 'thetaStart', 'thetaLength']);

        } else if (this instanceof THREE.IcosahedronGeometry) {

            handleParameters(THREE.IcosahedronGeometry, ['radius', 'detail']);

        } else if (this instanceof THREE.TorusGeometry) {

            handleParameters(THREE.TorusGeometry, ['radius', 'tube', 'radialSegments', 'tubularSegments', 'arc']);

        } else if (this instanceof THREE.TorusKnotGeometry) {

            handleParameters(THREE.TorusKnotGeometry, ['radius', 'tube', 'radialSegments', 'tubularSegments', 'p', 'q', 'heightScale']);

        } else {

            var vertices = this.vertices;

            for (var i = 0, il = vertices.length; i < il; i++) {

                geometry.vertices.push(vertices[i].clone());

            }

            var faces = this.faces;

            for (var i = 0, il = faces.length; i < il; i++) {

                geometry.faces.push(faces[i].clone());

            }

            var uvs = this.faceVertexUvs[0];

            for (var i = 0, il = uvs.length; i < il; i++) {

                var uv = uvs[i], uvCopy = [];

                for (var j = 0, jl = uv.length; j < jl; j++) {

                    uvCopy.push(new THREE.Vector2(uv[j].x, uv[j].y));

                }

                geometry.faceVertexUvs[0].push(uvCopy);

            }

        }

        return geometry;

    }