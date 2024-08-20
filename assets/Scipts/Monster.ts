import { _decorator, Animation, Collider2D, Component, find, Node, v3 } from 'cc';
import { ActionStatus, GameController } from './Game';
const { ccclass, property } = _decorator;


@ccclass('Monster')
export class Monster extends Component {
    @property
    speed: number = 0; // 怪物移动速度

    collider: Collider2D = null;

    player: Node = null;

    game: GameController = null;

    status: ActionStatus = undefined;

    start() {
        this.doAnimation(ActionStatus.IDLE);
        this.player = find('Canvas')?.getChildByName('Player');
    }

    doAnimation(status: ActionStatus) {
        if (status === this.status) return;
        this.status = status;
        this.getComponent(Animation).play(status)
    }

    update(deltaTime: number) {
        if (this.status === ActionStatus.DEATH) return;
        if (this.player) {
            // 获取怪物和主角的位置
            const monsterPos = this.node.getWorldPosition();
            const playerPos = this.player.getWorldPosition();

            // 计算怪物到主角的方向向量
            const direction = v3(playerPos.x - monsterPos.x, playerPos.y - monsterPos.y, 0).normalize();

            // 计算怪物的移动向量
            const moveVector = direction.multiplyScalar(this.speed * deltaTime);

            // 更新怪物的位置
            this.node.setWorldPosition(monsterPos.add(moveVector));
        }
    }
}

