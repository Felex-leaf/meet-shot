import { _decorator, Component, Sprite, resources, v3, SpriteFrame, EventMouse, input, Input, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WeaponWrapper')
export class WeaponWrapper extends Component {
    start() {
       // this.loadAndSwitchAtlas('Weapon/Icon28_01/spriteFrame');
       input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this)
    }

    onMouseMove(event: EventMouse) {
        // const parentScript = this.node.parent.getComponent(Player);
        // const { x, y } = parentScript?.currentPosition || {};
        
        
        const mousePos = event.getUILocation();

        // 获取节点在世界坐标系中的位置
        const nodeWorldPos = this.node.getWorldPosition();

        // 计算精灵位置与鼠标位置之间的向量
        // const direction = v3(mousePos.x + x - nodeWorldPos.x, mousePos.y + y - nodeWorldPos.y, 0);
        const direction = v3(mousePos.x - nodeWorldPos.x, mousePos.y - nodeWorldPos.y, 0);

        // 计算向量的角度
        const angle = Math.atan2(direction.y, direction.x) * (180 / Math.PI);

        // 设置精灵的旋转角度
        this.node.setRotationFromEuler(0, 0, angle - 45);
    }

    onDestroy() {
        input.off(Input.EventType.MOUSE_MOVE)
    }
}

