Sidebars.Properties.Material = function (editor) {

    var signals = editor.signals;

    var objService = editor.objectPropertyService;

    var materialClasses = {

        'LineBasicMaterial': THREE.LineBasicMaterial,
        'LineDashedMaterial': THREE.LineDashedMaterial,
        'MeshBasicMaterial': THREE.MeshBasicMaterial,
        'MeshDepthMaterial': THREE.MeshDepthMaterial,
        'MeshFaceMaterial': THREE.MeshFaceMaterial,
        'MeshLambertMaterial': THREE.MeshLambertMaterial,
        'MeshNormalMaterial': THREE.MeshNormalMaterial,
        'MeshPhongMaterial': THREE.MeshPhongMaterial,
        'ParticleSystemMaterial': THREE.ParticleSystemMaterial,
        'ShaderMaterial': THREE.ShaderMaterial,
        'SpriteMaterial': THREE.SpriteMaterial,
        'SpriteCanvasMaterial': THREE.SpriteCanvasMaterial,
        'Material': THREE.Material

    };

    var container = new UI.Panel();
    container.setDisplay('none');

    $("<h3/>", {html: "Material"}).appendTo(container.dom);

    // uuid (disabled)

    var materialUUIDRow = new UI.Panel();
    materialUUIDRow.setClass("row");
    var materialUUID = new UI.Input().setWidth('115px').setColor('#444').setFontSize('12px').setDisabled(true);
    var materialUUIDRenew = new UI.Button('⟳').setMarginLeft('7px').onClick(function () {

        materialUUID.setValue(THREE.Math.generateUUID());
        update();

    });
    materialUUIDRow.add(new UI.Text('UUID').setWidth('90px'));
    materialUUIDRow.add(materialUUID);
    materialUUIDRow.add(materialUUIDRenew);
    //container.add( materialUUIDRow );


    // name (disabled)

    var materialNameRow = new UI.Panel();
    materialNameRow.setClass("row easy");
    var materialName = new UI.Input().setWidth('150px').setColor('#444').setFontSize('12px').onChange(function () {

        editor.setMaterialName(editor.selected.material, materialName.getValue());

    });
    materialNameRow.add(new UI.Text('Name').setWidth('90px'));
    materialNameRow.add(materialName);
    //container.add( materialNameRow );


    // class (disabled)

    var materialClassRow = new UI.Panel();
    materialClassRow.setClass("row advanced");
    var materialClass = new UI.Select().setOptions({

        'LineBasicMaterial': 'LineBasicMaterial',
        'LineDashedMaterial': 'LineDashedMaterial',
        'MeshBasicMaterial': 'MeshBasicMaterial',
        'MeshDepthMaterial': 'MeshDepthMaterial',
        'MeshFaceMaterial': 'MeshFaceMaterial',
        'MeshLambertMaterial': 'MeshLambertMaterial',
        'MeshNormalMaterial': 'MeshNormalMaterial',
        'MeshPhongMaterial': 'MeshPhongMaterial',
        'SpriteMaterial': 'SpriteMaterial'

    }).setWidth('150px').setColor('#444').setFontSize('12px').onChange(update);
    materialClassRow.add(new UI.Text('Type').setWidth('90px'));
    materialClassRow.add(materialClass);
    //container.add( materialClassRow );


    // color

    var materialColorRow = new UI.Panel();
    materialColorRow.setClass("row easy");
    var materialColor = new UI.Color().onChange(update);

    materialColorRow.add(new UI.Text('Color').setWidth('90px'));
    materialColorRow.add(materialColor);

    container.add(materialColorRow);


    // edges (disabled)

    var edgesRow = new UI.Panel();
    edgesRow.setClass("row advanced disabled");
    var edgesCheckbox = new UI.Checkbox(false).onChange(update);
    edgesRow.add(new UI.Text('Edges').setWidth('90px'));
    edgesRow.add(edgesCheckbox);
    container.add(edgesRow);


    // ambient (disabled)

    var materialAmbientRow = new UI.Panel();
    materialAmbientRow.setClass("row disabled");
    var materialAmbient = new UI.Color().onChange(update);

    materialAmbientRow.add(new UI.Text('Ambient').setWidth('90px'));
    materialAmbientRow.add(materialAmbient);
    container.add(materialAmbientRow);


    // emissive (disabled)

    var materialEmissiveRow = new UI.Panel();
    materialEmissiveRow.setClass("row disabled");
    var materialEmissive = new UI.Color().onChange(update);

    materialEmissiveRow.add(new UI.Text('Emissive').setWidth('90px'));
    materialEmissiveRow.add(materialEmissive);

    container.add(materialEmissiveRow);


    // specular (disabled)

    var materialSpecularRow = new UI.Panel();
    materialSpecularRow.setClass("row");
    var materialSpecular = new UI.Color().onChange(update);

    materialSpecularRow.add(new UI.Text('Specular').setWidth('90px'));
    materialSpecularRow.add(materialSpecular);
    //container.add( materialSpecularRow );


    // shininess (disabled)

    var materialShininessRow = new UI.Panel();
    materialShininessRow.setClass("row disabled");
    var materialShininess = new UI.Number(30).onChange(update);

    materialShininessRow.add(new UI.Text('Shininess').setWidth('90px'));
    materialShininessRow.add(materialShininess);
    container.add(materialShininessRow);


    // vertex colors (disabled)

    var materialVertexColorsRow = new UI.Panel();
    materialVertexColorsRow.setClass("row disabled");
    var materialVertexColors = new UI.Select().setOptions({

        0: 'No',
        1: 'Face',
        2: 'Vertex'

    }).onChange(update);

    materialVertexColorsRow.add(new UI.Text('Vertex Colors').setWidth('90px'));
    materialVertexColorsRow.add(materialVertexColors);
    container.add(materialVertexColorsRow);


    // map

    var materialMapRow = new UI.Panel();
    materialMapRow.setClass("row advanced");
    //var materialMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialMap = new UI.Texture().setColor('#444').onChange(update);

    materialMapRow.add(new UI.Text('Texture').setWidth('90px'));
    //materialMapRow.add(materialMapEnabled);
    materialMapRow.add(materialMap);

    container.add(materialMapRow);


    // light map (disabled)

    var materialLightMapRow = new UI.Panel();
    materialLightMapRow.setClass("row disabled");
    var materialLightMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialLightMap = new UI.Texture().setColor('#444').onChange(update);

    materialLightMapRow.add(new UI.Text('Light Map').setWidth('90px'));
    materialLightMapRow.add(materialLightMapEnabled);
    materialLightMapRow.add(materialLightMap);

    container.add(materialLightMapRow);


    // bump map (disabled)

    var materialBumpMapRow = new UI.Panel();
    materialBumpMapRow.setClass("row disabled");
    var materialBumpMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialBumpMap = new UI.Texture().setColor('#444').onChange(update);
    var materialBumpScale = new UI.Number(1).setWidth('30px').onChange(update);

    materialBumpMapRow.add(new UI.Text('Bump Map').setWidth('90px'));
    materialBumpMapRow.add(materialBumpMapEnabled);
    materialBumpMapRow.add(materialBumpMap);
    materialBumpMapRow.add(materialBumpScale);

    container.add(materialBumpMapRow);


    // normal map (disabled)

    var materialNormalMapRow = new UI.Panel();
    materialNormalMapRow.setClass("row disabled");
    var materialNormalMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialNormalMap = new UI.Texture().setColor('#444').onChange(update);

    materialNormalMapRow.add(new UI.Text('Normal Map').setWidth('90px'));
    materialNormalMapRow.add(materialNormalMapEnabled);
    materialNormalMapRow.add(materialNormalMap);

    container.add(materialNormalMapRow);


    // specular map (disabled)

    var materialSpecularMapRow = new UI.Panel();
    materialSpecularMapRow.setClass("row disabled");
    var materialSpecularMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialSpecularMap = new UI.Texture().setColor('#444').onChange(update);

    materialSpecularMapRow.add(new UI.Text('Specular Map').setWidth('90px'));
    materialSpecularMapRow.add(materialSpecularMapEnabled);
    materialSpecularMapRow.add(materialSpecularMap);

    container.add(materialSpecularMapRow);


    // env map (disabled)

    var materialEnvMapRow = new UI.Panel();
    materialEnvMapRow.setClass("row disabled");
    var materialEnvMapEnabled = new UI.Checkbox(false).onChange(update);
    var materialEnvMap = new UI.CubeTexture().setColor('#444').onChange(update);
    var materialReflectivity = new UI.Number(1).setWidth('30px').onChange(update);

    materialEnvMapRow.add(new UI.Text('Env Map').setWidth('90px'));
    materialEnvMapRow.add(materialEnvMapEnabled);
    materialEnvMapRow.add(materialEnvMap);
    materialEnvMapRow.add(materialReflectivity);

    container.add(materialEnvMapRow);


    // blending (diabled)

    var materialBlendingRow = new UI.Panel();
    materialBlendingRow.setClass("row advanced disabled");
    var materialBlending = new UI.Select().setOptions({

        0: 'No',
        1: 'Normal',
        2: 'Additive',
        3: 'Subtractive',
        4: 'Multiply',
        5: 'Custom'

    }).setWidth('150px').setColor('#444').setFontSize('12px').onChange(update);

    materialBlendingRow.add(new UI.Text('Blending').setWidth('90px'));
    materialBlendingRow.add(materialBlending);

    container.add(materialBlendingRow);


    // side (disabled)

    var materialSideRow = new UI.Panel();
    materialSideRow.setClass("row disabled");
    var materialSide = new UI.Select().setOptions({

        0: 'Front',
        1: 'Back',
        2: 'Double'

    }).setWidth('150px').setColor('#444').setFontSize('12px').onChange(update);

    materialSideRow.add(new UI.Text('Side').setWidth('90px'));
    materialSideRow.add(materialSide);

    container.add(materialSideRow);


    // opacity

    var materialOpacityRow = new UI.Panel();
    materialOpacityRow.setClass("row");
    var materialOpacity = new UI.Number().setWidth('24px').setRange(0, 1).onChange(update);

    materialOpacityRow.add(new UI.Text('Opacity').setWidth('90px'));
    materialOpacityRow.add(materialOpacity);

    container.add(materialOpacityRow);


    // transparent (disabled)

    var materialTransparentRow = new UI.Panel();
    materialTransparentRow.setClass("row disabled");
    var materialTransparent = new UI.Checkbox().setLeft('100px').onChange(update);

    materialTransparentRow.add(new UI.Text('Transparent').setWidth('90px'));
    materialTransparentRow.add(materialTransparent);

    container.add(materialTransparentRow);


    // wireframe (disabled)

    var materialWireframeRow = new UI.Panel();
    materialWireframeRow.setClass("row disabled");
    var materialWireframe = new UI.Checkbox(false).onChange(update);
    var materialWireframeLinewidth = new UI.Number(1).setWidth('60px').setRange(0, 100).onChange(update);

    materialWireframeRow.add(new UI.Text('Wireframe').setWidth('90px'));
    materialWireframeRow.add(materialWireframe);
    materialWireframeRow.add(materialWireframeLinewidth);

    container.add(materialWireframeRow);


    // runtime material

    var runtimeMaterialRow = new UI.Panel();
    runtimeMaterialRow.setClass("row advanced");
    var runtimeMaterial = new UI.RuntimeMaterial().onChange(update);

    runtimeMaterialRow.add(new UI.Text('Runtime material changes').setWidth('300px'));
    runtimeMaterialRow.add(runtimeMaterial);

    container.add(runtimeMaterialRow);


    //
    // DISABLED PROPERTIES DO NOT UPDATE TEMPLATE INSTANCES

    function update() {


        var object = editor.selected;
        var geometry = object.geometry;
        var material = object.material;
        var textureWarning = false;
        var objectHasUvs = false;

        if (object instanceof THREE.Sprite) objectHasUvs = true;
        if (geometry instanceof THREE.Geometry && geometry.faceVertexUvs[0].length > 0) objectHasUvs = true;
        if (geometry instanceof THREE.BufferGeometry && geometry.attributes.uv !== undefined) objectHasUvs = true;

        if (material) {

            if (material.uuid !== undefined) {

                material.uuid = materialUUID.getValue();

            }

            if (material instanceof materialClasses[materialClass.getValue()] === false) {

                material = new materialClasses[materialClass.getValue()]();
                object.material = material;

            }


            // COLOR UPDATE

            if (material.color !== undefined) {

                // COLOR UPDATE OF TEMPLATE AND ITS INSTANCES
                if (object.isTemplate) {

                    var instObjects = editor.templateManager.getInstancesOfTemplate(object.id);

                    for (var i = 0; i < instObjects.length; i++) {

                        var instMaterial = instObjects[i].material;

                        // check if property of the current instance is linked to the template or not.
                        if (instObjects[i].isLinked.color) {
                            instMaterial.color.setHex(materialColor.getHexValue());
                        }

                    }
                }

                // COLOR UPDATE OF NORMAL OBJECT
                material.color.setHex(materialColor.getHexValue());


            }


            // EDGES UPDATED

            if (edgesCheckbox.getValue() == true && object._egh == undefined) {

                editor.setEdge(object, !object.events ? 1 : object.events.length);

            } else if (edgesCheckbox.getValue() == false && object._egh != undefined) {

                object.remove(object._egh);
                delete object._egh;

            }
            material.edges = edgesCheckbox.getValue();
            Logger.info('EDGES', material.edges, "logged by Sidebars.Properties.Material.js, row 385");

            if (material.ambient !== undefined) {

                material.ambient.setHex(materialAmbient.getHexValue());

            }

            if (material.emissive !== undefined) {

                material.emissive.setHex(materialEmissive.getHexValue());

            }

            if (material.specular !== undefined) {

                material.specular.setHex(materialSpecular.getHexValue());

            }

            if (material.shininess !== undefined) {

                material.shininess = materialShininess.getValue();

            }

            if (material.vertexColors !== undefined) {

                geometry.buffersNeedUpdate = true;
                geometry.colorsNeedUpdate = true;

                material.vertexColors = parseInt(materialVertexColors.getValue());
                material.needsUpdate = true;

            }

            // TEXTURE MAP

            if (material.map !== undefined) {

                //var mapEnabled = materialMapEnabled.getValue() === true;
                var mapEnabled = true;

                // COLOR UPDATE OF TEMPLATE AND ITS INSTANCES
                if (object.isTemplate) {

                    var instObjects = editor.templateManager.getInstancesOfTemplate(object.id);

                    for (var i = 0; i < instObjects.length; i++) {

                        var instMaterial = instObjects[i].material;
                        var instGeometry = instObjects[i].geometry;

                        // check if property of the current instance is linked to the template or not.
                        if (instObjects[i].isLinked.color) {

                            if (objectHasUvs) {

                                if (instGeometry !== undefined) {

                                    instGeometry.buffersNeedUpdate = true;
                                    instGeometry.uvsNeedUpdate = true;

                                }

                                instMaterial.map = mapEnabled ? materialMap.getValue() : null;
                                instMaterial.needsUpdate = true;

                            } else {

                                if (mapEnabled) textureWarning = true;

                            }
                        }

                    }
                }

                if (objectHasUvs) {

                    if (geometry !== undefined) {

                        geometry.buffersNeedUpdate = true;
                        geometry.uvsNeedUpdate = true;

                    }

                    material.map = mapEnabled ? materialMap.getValue() : null;
                    material.needsUpdate = true;

                } else {

                    if (mapEnabled) textureWarning = true;

                }


            }

            /*
             if ( material.lightMap !== undefined ) {

             var lightMapEnabled = materialLightMapEnabled.getValue() === true;

             if ( objectHasUvs )  {

             geometry.buffersNeedUpdate = true;
             geometry.uvsNeedUpdate = true;

             material.lightMap = lightMapEnabled ? materialLightMap.getValue() : null;
             material.needsUpdate = true;

             } else {

             if ( lightMapEnabled ) textureWarning = true;

             }

             }
             */

            if (material.bumpMap !== undefined) {

                var bumpMapEnabled = materialBumpMapEnabled.getValue() === true;

                if (objectHasUvs) {

                    geometry.buffersNeedUpdate = true;
                    geometry.uvsNeedUpdate = true;

                    material.bumpMap = bumpMapEnabled ? materialBumpMap.getValue() : null;
                    material.bumpScale = materialBumpScale.getValue();
                    material.needsUpdate = true;

                } else {

                    if (bumpMapEnabled) textureWarning = true;

                }

            }

            if (material.normalMap !== undefined) {

                var normalMapEnabled = materialNormalMapEnabled.getValue() === true;

                if (objectHasUvs) {

                    geometry.buffersNeedUpdate = true;
                    geometry.uvsNeedUpdate = true;

                    material.normalMap = normalMapEnabled ? materialNormalMap.getValue() : null;
                    material.needsUpdate = true;

                } else {

                    if (normalMapEnabled) textureWarning = true;

                }

            }

            if (material.specularMap !== undefined) {

                var specularMapEnabled = materialSpecularMapEnabled.getValue() === true;

                if (objectHasUvs) {

                    geometry.buffersNeedUpdate = true;
                    geometry.uvsNeedUpdate = true;

                    material.specularMap = specularMapEnabled ? materialSpecularMap.getValue() : null;
                    material.needsUpdate = true;

                } else {

                    if (specularMapEnabled) textureWarning = true;

                }

            }

            if (material.envMap !== undefined) {

                var envMapEnabled = materialEnvMapEnabled.getValue() === true;

                if (objectHasUvs) {

                    geometry.buffersNeedUpdate = true;
                    geometry.uvsNeedUpdate = true;

                    material.envMap = envMapEnabled ? materialEnvMap.getValue() : null;
                    material.reflectivity = materialReflectivity.getValue();
                    material.needsUpdate = true;

                } else {

                    if (envMapEnabled) textureWarning = true;

                }

            }

            if (material.blending !== undefined) {

                material.blending = parseInt(materialBlending.getValue());

            }

            if (material.side !== undefined) {

                material.side = parseInt(materialSide.getValue());

            }

            // OPACITY

            if (material.opacity !== undefined) {

                // OPACITY UPDATE OF TEMPLATE AND ITS INSTANCES
                if (object.isTemplate) {

                    var instObjects = editor.templateManager.getInstancesOfTemplate(object.id);

                    for (var i = 0; i < instObjects.length; i++) {

                        var instMaterial = instObjects[i].material;

                        // check if property of the current instance is linked to the template or not.
                        if (instObjects[i].isLinked.opacity) {

                            instMaterial.opacity = materialOpacity.getValue();
                            // CUSTOM
                            instMaterial.transparent = material.opacity > 0 ? true : false;

                        }

                    }
                }


                // OPACITY UPDATE OF NORMAL OBJECT
                material.opacity = materialOpacity.getValue();
                // CUSTOM
                material.transparent = material.opacity > 0 ? true : false;


            }

            /*if ( material.transparent !== undefined ) {

             material.transparent = materialTransparent.getValue();

             }*/

            if (material.wireframe !== undefined) {

                material.wireframe = materialWireframe.getValue();

            }

            if (material.wireframeLinewidth !== undefined) {

                material.wireframeLinewidth = materialWireframeLinewidth.getValue();

            }

            material.runtimeMaterials = runtimeMaterial.getValue();

            //updateRows();

            signals.materialChanged.dispatch(material);

        }

        if (textureWarning) {

            Logger.error("Can't set texture, model doesn't have texture coordinates", "logged by Sidebars.Properties.Material.js, row 597");

        }

    };

    function updateRows() {

        var properties = {
            'name': materialNameRow,
            'color': materialColorRow,
            'ambient': materialAmbientRow,
            'emissive': materialEmissiveRow,
            'specular': materialSpecularRow,
            'shininess': materialShininessRow,
            'vertexColors': materialVertexColorsRow,
            'map': materialMapRow,
            'lightMap': materialLightMapRow,
            'bumpMap': materialBumpMapRow,
            'normalMap': materialNormalMapRow,
            'specularMap': materialSpecularMapRow,
            'envMap': materialEnvMapRow,
            'blending': materialBlendingRow,
            'side': materialSideRow,
            'opacity': materialOpacityRow,
            'transparent': materialTransparentRow,
            'wireframe': materialWireframeRow,
            'runtimeMaterials': runtimeMaterialRow,
            'edges': edgesRow
        };

        var material = editor.selected.material;

        for (var property in properties) {

            //var visible = material[ property ] !== undefined ? true: false;

            properties[property].setDisplay(visible ? '' : 'none');

        }

    };

    // signals

    signals.defaultColorTypeChanged.add(function (defaultColorType) {

        update(); //TODO: maybe race condition

    });

    // events

    signals.objectSelected.add(function (object) {

        if (object && object.material) {

            container.setDisplay('');

            var material = object.material;

            if (material.uuid !== undefined) {

                materialUUID.setValue(material.uuid);

            }

            if (material.name !== undefined) {

                materialName.setValue(material.name);

            }

            materialClass.setValue(editor.getMaterialType(material));

            if (material.color !== undefined) {

                materialColor.setHexValue(material.color.getHexString());

            }

            edgesCheckbox.setValue(object.material.edges);
            Logger.info('HASEDGES', object.material.edges, "logged by Sidebars.Properties.Materials.js, row 679");
            if (object.material.edges) {
                editor.setEdge(object);
            }

            if (material.ambient !== undefined) {

                materialAmbient.setHexValue(material.ambient.getHexString());

            }

            if (material.emissive !== undefined) {

                materialEmissive.setHexValue(material.emissive.getHexString());

            }

            if (material.specular !== undefined) {

                materialSpecular.setHexValue(material.specular.getHexString());

            }

            if (material.shininess !== undefined) {

                materialShininess.setValue(material.shininess);

            }

            if (material.vertexColors !== undefined) {

                materialVertexColors.setValue(material.vertexColors);

            }

            if (material.map !== undefined) {

                //materialMapEnabled.setValue(material.map !== null);
                materialMap.setValue(material.map);

            }

            /*
             if ( material.lightMap !== undefined ) {

             materialLightMapEnabled.setValue( material.lightMap !== null );
             materialLightMap.setValue( material.lightMap );

             }
             */

            if (material.bumpMap !== undefined) {

                materialBumpMapEnabled.setValue(material.bumpMap !== null);
                materialBumpMap.setValue(material.bumpMap);
                materialBumpScale.setValue(material.bumpScale);

            }

            if (material.normalMap !== undefined) {

                materialNormalMapEnabled.setValue(material.normalMap !== null);
                materialNormalMap.setValue(material.normalMap);

            }

            if (material.specularMap !== undefined) {

                materialSpecularMapEnabled.setValue(material.specularMap !== null);
                materialSpecularMap.setValue(material.specularMap);

            }

            if (material.envMap !== undefined) {

                materialEnvMapEnabled.setValue(material.envMap !== null);
                materialEnvMap.setValue(material.envMap);
                materialReflectivity.setValue(material.reflectivity);

            }

            if (material.blending !== undefined) {

                materialBlending.setValue(material.blending);

            }

            if (material.side !== undefined) {

                materialSide.setValue(material.side);

            }

            if (material.opacity !== undefined) {

                materialOpacity.setValue(material.opacity);

            }

            if (material.transparent !== undefined) {

                materialTransparent.setValue(material.transparent);

            }

            if (material.wireframe !== undefined) {

                materialWireframe.setValue(material.wireframe);

            }

            if (material.wireframeLinewidth !== undefined) {

                materialWireframeLinewidth.setValue(material.wireframeLinewidth);

            }

            if (material.runtimeMaterials !== undefined) {

                runtimeMaterial.setValue(material.runtimeMaterials);

            }

            //updateRows();

        } else {

            container.setDisplay('none');

        }

    });

    signals.objectChanged.add(function (object) {

        if (object._egh) editor.setEdge(object);

    });

    return container;

}
