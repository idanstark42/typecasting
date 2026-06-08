import { Spell } from '../prefabs/Spell';

// Individual spell implementations inheriting from BaseSpell
class CompileSpell extends Spell {
    cast() {
        // Mechanical effect: Spawn a projectile from the manager's physics pool
        const direction = this.player.flipX ? -1 : 1;
        const projectile = this.scene.spellManager.spawnProjectile(this.player.x, this.player.y);
        
        if (projectile) {
            projectile.body.setVelocityX(500 * direction);
            projectile.body.setAllowGravity(false);
            projectile.setTint(0x00ff00); // Terminal green
            projectile.damageValue = 10;
        }
    }

    vfx() {
        // Visual effect: Screen flash or simple character tint burst
        this.scene.cameras.main.flash(50, 0, 255, 0, false);
    }
}

class SudoShieldSpell extends Spell {
    cast() {
        // Mechanical effect: Turn on player temporary invulnerability flag
        if (this.player.setInvulnerable) {
            this.player.setInvulnerable(3000); // 3 seconds
        }
    }

    vfx() {
        // Visual effect: Create a localized follow-tween particle burst
        const circle = this.scene.add.circle(this.player.x, this.player.y, 30, 0x00ffff, 0.3);
        this.scene.tweens.add({
            targets: circle,
            scale: 1.5,
            alpha: 0,
            duration: 500,
            onComplete: () => circle.destroy()
        });
    }
}

// Map the lowercase typed keywords directly to the structural classes
export const SpellDictionary = {
    'compile': CompileSpell,
    'sudo shield': SudoShieldSpell
};