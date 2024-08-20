import { _decorator, Component, Sprite, Color, Collider2D, Contact2DType, Animation } from 'cc';
import { Monster } from './Monster';
import { Player } from './Player';
import { ActionStatus } from './Game';
const { ccclass, property } = _decorator;

const isMonster = (name: string) => {
    return ['Fly'].some((n) => n === name);
}

const componentMap = {
    Fly: Monster,
    Player: Player,
}

type Script = Player | Monster;

@ccclass('Character')
export class Character extends Component {
    @property(Sprite)
    sprite: Sprite = null; // 精灵组件

    @property
    blood = 0;

    private collider: Collider2D = null;
    private originalColor: Color = new Color(); // 原始颜色
    

    start() {
        // 记录精灵的原始颜色
        this.originalColor.set(this.sprite.color);
        // 获取碰撞组件
        this.collider = this.getComponent(Collider2D);
        if (this.collider) {
            // 监听碰撞事件
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    getScript(name: string) {
       return 
    }

    get script () {
       return this.node.getComponent<Script>(componentMap[this.node.name])
    }


    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        const nodeName = this.node.name;
        const targetName = otherCollider?.node?.name;
        const targetScript = otherCollider?.node?.getComponent<Script>(componentMap[targetName]);
        if (this.blood <= 0 || targetScript?.status === ActionStatus.DEATH) return;
        if (isMonster(nodeName) && targetName === 'Weapon' || nodeName === 'Player' && isMonster(targetName)) {
            this.takeDamage()
        }
    }

    getHurt() {
        // 将精灵颜色设置为红色
        this.sprite.color = new Color(255, 0, 0);
        // 在一段时间后恢复原来的颜色
        this.scheduleOnce(() => {
            this.sprite.color = this.originalColor;
        }, 0.2); // 0.2秒后恢复颜色
    }

    takeDamage() {
        this.blood = Number(this.blood) - 1;
       if (this.blood <= 0)  {
            this.script.doAnimation?.(ActionStatus.DEATH);
            this.getHurt();
            this.node.emit('death', this.node);
                // 在一段时间后恢复原来的颜色
            this.scheduleOnce(() => {
                this.node.removeFromParent();
            }, 10); // 0.2秒后恢复颜色
       } else {
            this.getHurt();
       }
    }
}