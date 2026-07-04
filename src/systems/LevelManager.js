// LevelManager.js
export const LevelManager = {
    loadLevel: (scene, mapKey, tilesetKey, tilesetImage) => {
        // 1. Create the tilemap from the JSON loaded in Preload
        const map = scene.make.tilemap({ key: mapKey });

        // 2. Add the tileset image to the map
        // 'tiles' must match the name defined in the Tiled editor
        const tileset = map.addTilesetImage(tilesetKey, tilesetImage);

        // 3. Create layers (assumes you have a layer named 'Ground' in Tiled)
        const groundLayer = map.createLayer('Ground', tileset, 0, 0);

        // 4. Setup collision for tiles with the 'collides' property in Tiled
        groundLayer.setCollisionByProperty({ collides: true });

        return { map, groundLayer };
    }
};