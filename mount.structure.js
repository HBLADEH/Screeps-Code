/**
 * 建筑物的扩展方法
 */
module.exports = function () {
  /**
   * tower 主方法
   */
  StructureTower.prototype.work = function () {
    // 先攻击敌人
    if (this.doAttack()) {
    }
    // 找不到敌人再维修建筑
    else if (this.doRepair()) {
    }
    // 找不到要维修的建筑就刷墙
    // else if (this.doFillWall()) {
    // }
  };

  /**
   * tower 攻击方法
   */
  StructureTower.prototype.doAttack = function () {
    const searchTime = 5; /* 每 5 tick 搜索一次敌人 */
    let target;

    if (Game.time % searchTime) {
      /* 如果缓存里有敌人 id 则先看看那个敌人还在吗,在就锁定,不在就把它移除缓存 */
      if (this.room.memory.targetHostileId) {
        target = Game.getObjectById(this.room.memory.targetHostileId);
        if (!target) {
          target = undefined;
          delete this.room.memory.targetHostileId;
        }
      } else if (!this.room._enemys) {
        this.room._enemys = this.room.find(FIND_HOSTILE_CREEPS);
      }

      if (this.room._enemys && this.room._enemys.length > 0) {
        target = this.pos.findClosestByPath(this.room._enemys);
        this.room.memory.targetHostileId = target.id;
      }

      if (!target) return false;
      this.attack(target);
      return true;
    }
  };
  StructureTower.prototype.doRepair = function () {
    const searchTime = 8;
    if (Game.time % searchTime) return false;

    // 寻找受损建筑物
    if (!this.room._damagedStructure) {
      const damagedStructures = this.room.find(FIND_STRUCTURES, {
        filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_RAMPART && this.structureType != STRUCTURE_WALL,
      });

      // 找到了
      if (damagedStructures.length > 0) {
        this.room._damagedStructure = this.pos.findClosestByPath(damagedStructures);
      } else {
        this.room._damagedStructure = 1;
        return false;
      }

      if (this.room._damagedStructure != 1) {
        this.repair(this.room._damagedStructure);
        if (this.room._damagedStructure.hits + 500 >= this.room._damagedStructure.hits.hitsMax) this.room._damagedStructure = 1;

        return true;
      }
      return false;
    }
  };

  /**
   * 维修墙
   */
  StructureTower.prototype.doFillWall = function () {
    const searchTime = 3;
    const energyLimit = 600; // tower 的能量高于此值才修墙
    const focusWall = this.room.focusWall;
    let targetWall = null;

    if (Game.time % searchTime) return false;
    if (this.room._hasFillWall) return false;
    if (this.store[RESOURCE_ENERGY] < energyLimit) return false;

    if (!focusWall || (focusWall && focusWall.endTime)) {
      // 获取所有要修的墙
      const walls = this.room.find(FIND_STRUCTURES, {
        filter: (s) => s.hits < s.hitsMax && (s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART),
      });

      // 没有目标就啥都不干
      if (walls.length <= 0) return false;

      // 找到血量最小的墙
      targetWall = walls.sort((a, b) => a.hits - b.hits)[0];

      // 将其缓存在内存里
      this.room.memory.focusWall = {
        id: targetWall.id,
        endTime: Game.time + 100,
      };

      // 获取墙壁
      if (!targetWall) targetWall = Game.getObjectById(focusWall.id);

      // 如果缓存里的 id 找不到墙壁，就清除缓存下次再找
      if (!targetWall) {
        delete this.room.memory.focusWall;
        return false;
      }
      // 填充墙壁
      this.repair(targetWall);
      // 标记一下防止其他 tower 继续刷墙
      this.room._hasFillWall = true;
      return true;
    }
  };
};
