export class LevelManager {
    /**
     * @param {Phaser.Scene} scene 
     */
    constructor(scene) {
        this.scene = scene;
        this.map = null;
        this.collisionLayer = null;
    }

    /**
     * Loads, builds, and paints tile assets onto the scene context canvas
     * @param {string} mapKey - The asset key configured during Preloader execution
     * @param {string} tilesetKey - The graphic tileset key configuration
     */
    loadLevel(mapKey, tilesetKey) {
        // 1. Create the tilemap object structure
        this.map = this.scene.make.tilemap({ key: mapKey });

        // 2. Pair the loaded artwork sheet image with the map structural data
        // Parameters: (Name inside Tiled software, Phaser Cache Key mapping)
        const tileset = this.map.addTilesetImage('computer_tileset', tilesetKey);

        // 3. Generate layers
        // Renders static layout architecture decoration
        if (this.map.getLayer('Background')) {
            this.map.createLayer('Background', tileset, 0, 0);
        }

        // Renders the tangible solid terrain walls and sectors
        this.collisionLayer = this.map.createLayer('CollisionLayer', tileset, 0, 0);

        // 4. Set up physics boundaries inside the data file maps
        if (this.collisionLayer) {
            // Tells Phaser to listen to tiles that have the custom "collides" property checked in Tiled
            this.collisionLayer.setCollisionByProperty({ collides: true });
        }

        return {
            map: this.map,
            collisionLayer: this.collisionLayer
        };
    }

    /**
     * Parses the Object Layer inside the map data to gather coordinates
     * @param {string} layerName 
     * @returns {Array<object>}
     */
    getSpawnPoints(layerName = 'ObjectLayer') {
        const objectLayer = this.map.getObjectLayer(layerName);
        if (!objectLayer) return [];
        return objectLayer.objects;
    }
}