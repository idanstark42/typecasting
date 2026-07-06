// LevelManager.js
export const LevelManager = {
    loadLevel: (scene, mapKey, tilesetKey, tilesetImage) => {
        const map = scene.make.tilemap({ key: mapKey });
        const tileset = map.addTilesetImage(tilesetKey, tilesetImage);
        const groundLayer = map.createLayer('Ground', tileset, 0, 0);
        
        // Ensure collision is set
        groundLayer.setCollisionByProperty({ collides: true });

        // Retrieve the 'Objects' layer
        const objectLayer = map.getObjectLayer('Objects');

        return { map, groundLayer, objectLayer };
    },

    findObjectByName: (objectLayer, name) => {
        return objectLayer.objects.find(obj => obj.name === name);
    }
};