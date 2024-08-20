import { _decorator, Component, EventKeyboard, KeyCode, Vec3, input, Input, Sprite, Animation, log } from 'cc';
import { ActionStatus } from './Game';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    // 最大移动速度
    @property
    maxMoveSpeed = 0
    // 加速度
    @property
    accel = 0
    // 当前速度
    @property
    xSpeed = 0
    // 贴图动画
    @property(Sprite)
    Body: Sprite = null

    private accLeft = false;
    private accRight = false;
    private accTop = false;
    private accBottom = false;

    status: ActionStatus = undefined;

    initPosition = new Vec3();
    currentPosition = new Vec3();

    start() {
        this.initPosition = this.node.getPosition()
        this.node.setSiblingIndex(10000)
        this.doAnimation(ActionStatus.IDLE)
        // 监听键盘按下事件
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        // 监听键盘释放事件
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        // 移除键盘事件监听
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    doAnimation(status: ActionStatus) {
        if (status === this.status) return;
        this.status = status;
        this.Body.getComponent(Animation).play(status)
    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                this.accLeft = true;
                this.doAnimation(ActionStatus.RUN)
                break;
            case KeyCode.KEY_D:
                this.accRight = true;
                this.doAnimation(ActionStatus.RUN)
                break;
            case KeyCode.KEY_W:
                this.accTop = true;
                this.doAnimation(ActionStatus.RUN)
                break;
            case KeyCode.KEY_S:
                this.accBottom = true;
                this.doAnimation(ActionStatus.RUN)
                break;
        }
    }

    onKeyUp (event) {
        // unset a flag when key released
        switch(event.keyCode) {
            case KeyCode.KEY_A:
                this.accLeft = false;
                break;
            case KeyCode.KEY_D:
                this.accRight = false;
                break;
            case KeyCode.KEY_W:
                this.accTop = false;
                break;
            case KeyCode.KEY_S:
                this.accBottom = false;
                break;
        }
    }

    update(deltaTime: number) {
        if (this.accLeft || this.accBottom || this.accRight || this.accTop) {
            // 根据当前加速度方向每帧更新速度
            this.xSpeed += this.accel * deltaTime;
            // 限制主角的速度不能超过最大值
            if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
                // if speed reach limit, use max speed with current direction
                this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
            }
            let v = new Vec3();
            const distance = this.xSpeed * deltaTime;
            const body = this.node.getChildByName('Body');
            if (this.accLeft && this.accTop) {
                v = new Vec3(-distance, distance, 0)
                body.setScale(new Vec3(-1, body.scale.y, body.scale.z));
            } else if (this.accLeft && this.accBottom) {
                v = new Vec3(-distance, -distance, 0)
                body.setScale(new Vec3(-1, body.scale.y, body.scale.z));
            } else if (this.accRight && this.accTop) {
                v = new Vec3(distance, distance, 0)
                body.setScale(new Vec3(1, body.scale.y, body.scale.z));
            } else if (this.accRight && this.accBottom) {
                v = new Vec3(distance, -distance, 0)
                body.setScale(new Vec3(1, body.scale.y, body.scale.z));
            } else if (this.accLeft) {
                v = new Vec3(-distance, 0, 0)
                body.setScale(new Vec3(-1, body.scale.y, body.scale.z));
            } else if (this.accRight) {
                v = new Vec3(distance, 0, 0)
                body.setScale(new Vec3(1, body.scale.y, body.scale.z));
            } else if (this.accTop) {
                v = new Vec3(0, distance, 0)
            } else if (this.accBottom) {
                v = new Vec3(0, -distance, 0)
            }
            this.node.setPosition(this.node.getPosition().add(v))
        } else {
            this.xSpeed = 0
            this.doAnimation(ActionStatus.IDLE)
        }
        this.currentPosition = this.node.getPosition();
    }
}

