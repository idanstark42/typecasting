import { Physics } from 'phaser';

export class SpellManager {
    /**
     * @param {Phaser.Scene} scene 
     */
    constructor(scene) {
        this.scene = scene;

        // Instantiate an Arcade Physics group acting as our reusable projectile pool
        this.projectilePool = this.scene.physics.add.group({
            defaultKey: 'projectile_particle', // Asset loaded in Preloader
            maxSize: 30,                       // Limit max overhead projectiles
            active: false,
            visible: false
        });
    }

    /**
     * Grabs an inactive element from the pool and revives it at target coordinates
     * @param {number} x 
     * @param {number} y 
     * @returns {Phaser.Physics.Arcade.Sprite|null}
     */
    spawnProjectile(x, y) {
        const projectile = this.projectilePool.get(x, y);

        if (!projectile) return null; // Pool is entirely full

        // Activate components
        projectile.setActive(true);
        projectile.setVisible(true);
        
        // Ensure standard body physics properties are re-enabled
        if (projectile.body) {
            projectile.body.enable = true;
        }

        return projectile;
    }

    /**
     * Clears out single runtime projectile objects cleanly back into the passive pool
     * @param {Phaser.Physics.Arcade.Sprite} projectile 
     */
    recycleProjectile(projectile) {
        projectile.setActive(false);
        projectile.setVisible(false);
        if (projectile.body) {
            projectile.body.disable = true;
            projectile.body.setVelocity(0, 0);
        }
    }

    /**
     * Centralized updates loop triggered via Main Scene loop execution
     */
    update() {
        // Automatically reclaim projectiles that fly outside the active camera bounds
        const cameraBounds = this.scene.cameras.main.worldView;
        
        this.projectilePool.getChildren().forEach((proj) => {
            if (proj.active && !cameraBounds.contains(proj.x, proj.y)) {
                this.recycleProjectile(proj);
            }
        });
    }
}