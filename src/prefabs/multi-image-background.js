class MultiImageBackground {
    constructor(scene, imageKeys, speed) {
        this.scene = scene;
        this.imageKeys = imageKeys;
        this.imagePairs = imageKeys.map((key, i) => new ImagePair(scene, key, speed * i)); // Each image pair moves at a different speed for parallax effect
    }

    preload() {
        this.imagePairs.forEach(imagePair => imagePair.preload());
    }

    create() {
        this.imagePairs.forEach((imagePair, i) => {
            imagePair.create();
        });
        this.scene.add.existing(this);
    }

    update() {
        // Reset position of images that have moved off-screen
        this.imagePairs.forEach((imagePair, i) => {
            imagePair.setX(imagePair.x - imagePair.speed);
        });
    }

    setSpeed(newSpeed) {
        this.imagePairs.forEach((imagePair, i) => {
            imagePair.speed = newSpeed * (i + 1); // Each image pair moves at a different speed for parallax effect
        });
    }
}

class ImagePair {
    constructor(scene, imageKey, speed) {
        this.scene = scene;
        this.imageKey = imageKey;
        this.speed = speed;
        this.images = [];
        this.x = 0;
    }

    preload() {
        this.scene.load.image(this.imageKey, `assets/${this.imageKey}.png`);
    }

    create() {
        this.images[0] = this.scene.add.image(0, 0, this.imageKey).setOrigin(0, 0);
        this.images[1] = this.scene.add.image(this.images[0].width, 0, this.imageKey).setOrigin(0, 0);
        this.images.forEach(img => {
            img.setScale(Math.min(this.scene.cameras.main.width / img.width, this.scene.cameras.main.height / img.height));
            img.setScrollFactor(0);
        });
    }

    setX(x) {
        this.x = x;

        if (this.x + this.images[0].width < 0) {
            this.x += this.images[0].width;
        }

        this.images[0].x = this.x;
        this.images[1].x = this.x + this.images[0].width;
    }
}

export default MultiImageBackground;
