import { _decorator, Component, Sprite, resources, v3, SpriteFrame, EventMouse, input, Input, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
// import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('Weapon')
export class Weapon extends Component {
    @property(Sprite)
    targetSprite: Sprite = null; // 目标Sprite组件

    loadAndSwitchAtlas(atlasPath: string) {
        resources.load(atlasPath, SpriteFrame, (err, spriteFrame) => {
            this.targetSprite.spriteFrame = spriteFrame;
        });
    }
}
