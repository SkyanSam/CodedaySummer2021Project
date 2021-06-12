class LiveAssetObject extends AssetObject {
    constructor(model, texture, position, scale, rotate, collision, life = 100) {
        super(model, texture, position, scale, rotate, collision);
        this.life = 100;
    }

    hit(value) {
        this.life -= value;
        if(this.life <= 0) {
            LiveAssetObject.triggerDeathEvent(this);
        }
    }

    static triggerDeathEvent(asset) {
        let event = new CustomEvent("death-event", {detail: asset});
        canvas.dispatchEvent(event);
    }
}