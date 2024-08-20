import { _decorator, Component, Node, Vec3, Prefab, instantiate, UITransform, math, Label } from 'cc';
const { ccclass, property } = _decorator;

export enum ActionStatus {
    IDLE = 'idle',
    RUN = 'run',
    DEATH = 'death'
}

@ccclass('GameController')
export class GameController extends Component {
    // 这个属性引用了预制资源
    @property(Prefab)
    prefab: Prefab = null;

    @property(Node)
    mapNode: Node = null; // 地图节点

    @property
    spawnDistance: number = 100; // 刷新距离

    @property
    allMonsterNumber: number = 10;

    currentMonsterNumber: number = 10;

    @property(Label)
    MonsterNumberLabel: Label = null;

    onLoad () {
        this.MonsterNumberLabel.string = this.allMonsterNumber?.toString();
        this.currentMonsterNumber = this.allMonsterNumber;
        // 定时刷新怪物
        this.schedule(this.spawnNewMonster, 0.5, this.allMonsterNumber - 1); // 每5秒刷新一次怪物
    }

    spawnNewMonster() {
        // 获取地图的边界
        const mapRect = this.mapNode.getComponent(UITransform).getBoundingBox();

        // 随机生成怪物的位置
        const position = this.getRandomPositionOutsideMap(mapRect);

        // 创建怪物节点
        const monster = instantiate(this.prefab);
        monster.setPosition(position);
        monster.on('death', this.monsterDeath.bind(this))
        this.node.addChild(monster);
    }

    monsterDeath(node: Node) {
        node.off('death')
        this.currentMonsterNumber -= 1;
        this.MonsterNumberLabel.string = this.currentMonsterNumber?.toString()
    }

    getRandomPositionOutsideMap(mapRect: math.Rect): Vec3 {
        const randomSide = Math.floor(Math.random() * 4); // 随机选择一个边界
        let x: number, y: number;

        switch (randomSide) {
            case 0: // 上边界
                x = math.randomRange(mapRect.xMin, mapRect.xMax);
                y = mapRect.yMax + this.spawnDistance;
                break;
            case 1: // 下边界
                x = math.randomRange(mapRect.xMin, mapRect.xMax);
                y = mapRect.yMin - this.spawnDistance;
                break;
            case 2: // 左边界
                x = mapRect.xMin - this.spawnDistance;
                y = math.randomRange(mapRect.yMin, mapRect.yMax);
                break;
            case 3: // 右边界
                x = mapRect.xMax + this.spawnDistance;
                y = math.randomRange(mapRect.yMin, mapRect.yMax);
                break;
        }
        return new Vec3(x, y, 0);
    }
}