// 引入 creep 配置项
const creepConfigs = require("./config.creep");

module.exports = function () {
  // 添加 work 方法
  Creep.prototype.work = function () {
    // 检查 creep 内存中的角色是否存在
    if (!(this.memory.role in creepConfigs)) {
      console.log(`creep ${this.name} 内存属性 role 不属于任何已存在的 creepConfigs 名称`);
      return;
    }
    // 获取对应配置项
    const creepConfig = creepConfigs[this.memory.role];

    // 没准备的时候就执行准备阶段
    if (!this.memory.ready) {
      // 有准备阶段配置则执行
      if (creepConfig.prepare) {
        this.memory.ready = creepConfig.prepare(this);
      }
      // 没有就直接准备完成
      else this.memory.ready = true;
      return;
    }

    // 获取是否工作
    const working = creepConfig.source ? this.memory.working : true;

    let stateChange = false;
    // 执行对应操作
    if (working) {
      if (creepConfig.target && creepConfig.target(this)) stateChange = true;
    } else {
      if (creepConfig.source && creepConfig.source(this)) stateChange = true;
    }

    if (stateChange) {
      this.memory.working = !this.memory.working;
    }
  };

  /**
   * 从目标结构获取能量
   *
   * @param target 提供能量的结构
   * @returns 执行 harvest 或 withdraw 后的返回值
   */
  Creep.prototype.getEngryFrom = function (target) {
    let result;
    // 判断对象是否有建筑类型; 有就是容器,没有就是矿
    if (target.structureType == null) {
      result = this.harvest(target);
    } else {
      result = this.withdraw(target, RESOURCE_ENERGY);
    }

    // 距离不够就走过去咯
    if (result === ERR_NOT_IN_RANGE) {
      this.goTo(target.pos);
    }
  };

  /**
   *  Creep 的寻路
   *
   * @param target 要移动到的位置
   */
  Creep.prototype.goTo = function (pos) {
    const moveResult = this.moveTo(pos, { reusePath: 20 });
    return moveResult;
  };

  /**
   *  Creep 位置校验
   *
   * @param pos1 位置1
   * @param pos2 位置2
   */
  Creep.prototype.posCheck = function (pos1, pos2) {
    return pos1.x == pos2.x && pos1.y == pos2.y;
  };

  /**
   *  Creep 升级控制器
   */
  Creep.prototype.upgrade = function () {
    const actionResult = this.upgradeController(this.room.controller);
    return true;
  };

  /**
   * 转移资源到结构
   *
   * @param target 要转移到的目标
   * @param RESOURCE 要转移的资源类型
   */
  Creep.prototype.transferTo = function (target, RESOURCE) {
    const result = this.transfer(target, RESOURCE);
    if (result == ERR_NOT_IN_RANGE) {
      this.goTo(target.pos);
    }
    return result;
  };

  /**
   * 当前资源自动放到需要能源的地方
   *
   * @param creep 当前 creep
   * @param claimTarget 要转移到的指定目标
   */
  Creep.prototype.autoPut = function (creep, claimTarget) {
    let target;
    // 存放倒指定容器
    // 第一次搜索容器,然后存储在缓存里方便以后调用,避免多次搜索
    if (creep.memory.fillStructureId) {
      target = Game.getObjectById(creep.memory.fillStructureId);

      // tower 的能量大于设定值, 或者当前要填充的容器已满则清楚缓存
      if ((target.structureType == STRUCTURE_TOWER && target.store[RESOURCE_ENERGY] < 1000) || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
        delete creep.memory.fillStructureId;
        target = undefined;
      }
    }
    if (!target) {
      let targets = creep.room.find(FIND_STRUCTURES, {
        filter: (s) => {
          // 先找 extension 和 spawn
          const hasTargetES = (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.store[RESOURCE_ENERGY] < s.energyCapacity;
          // 再看看有没有 tower
          const hasTargetTower = s.structureType == STRUCTURE_TOWER && s.store[RESOURCE_ENERGY] < 1000;
          return hasTargetES || hasTargetTower;
        },
      });

      // 如果有则寻找最近的
      if (targets.length > 0) {
        target = creep.pos.findClosestByRange(targets);
        // 然后写进缓存
        creep.memory.fillStructureId = target.id;
      } else {
        // 如果没有条件则尝试存入指定的地方
        if (claimTarget === "" || !claimTarget) return;
        target = Game.getObjectById(claimTarget);
        if (!target) return;
      }
    }

    creep.transferTo(target, RESOURCE_ENERGY);
  };

  /**
   * 当前资源自动放到需要能源的地方
   *
   * @param creep 当前 creep
   * @param claimTarget 要转移到的指定目标
   */
  Creep.prototype.findNeedEnergyTarget = function (creep, claimTarget) {
    let target;
    // 存放倒指定容器
    // 第一次搜索容器,然后存储在缓存里方便以后调用,避免多次搜索
    if (creep.memory.fillStructureId) {
      target = Game.getObjectById(creep.memory.fillStructureId);

      // tower 的能量大于设定值, 或者当前要填充的容器已满则清楚缓存
      if ((target.structureType == STRUCTURE_TOWER && target.store[RESOURCE_ENERGY] >= 900) || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
        delete creep.memory.fillStructureId;
        target = undefined;
      }
    }
    if (!target) {
      let targets = creep.room.find(FIND_STRUCTURES, {
        filter: (s) => {
          // 先找 extension 和 spawn
          const hasTargetES = (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.store[RESOURCE_ENERGY] < s.energyCapacity;
          // 再看看有没有 tower
          const hasTargetTower = s.structureType == STRUCTURE_TOWER && s.store[RESOURCE_ENERGY] < 600;
          return hasTargetES || hasTargetTower;
        },
      });

      // 如果有则寻找最近的
      if (targets.length > 0) {
        target = creep.pos.findClosestByRange(targets);
        // 然后写进缓存
        creep.memory.fillStructureId = target.id;
      }
    }

    return target;
  };

  /**
   * 建设房间内的建筑工地
   *
   */
  Creep.prototype.buildStructure = function () {
    let target; // 工地

    // 先看看房间缓存内有无建筑工地
    if (this.room.memory.constructionSiteId) {
      target = Game.getObjectById(this.room.memory.constructionSiteId);
      // 若缓存中的工地没有的话说明上一个建筑已经造好了
      if (!target) {
        // // 获取曾经工地的位置
        // const constructionSitePos = new RoomPosition(this.room.memory.constructionSitePos[0], this.room.memory.constructionSitePos[1], this.room.name);
        // // 检查上面是否有已经造好的同类型建筑，如果有的话就执行回调
        // const structure = _.find(constructionSitePos.lookFor(LOOK_STRUCTURES), (s) => s.structureType === this.room.memory.constructionSiteType);
        // if (structure && structure.onBuildComplete) structure.onBuildComplete();
        // // 获取下个建筑目标
        target = this._updateConstructionSite();
      }
    } else target = this._updateConstructionSite();

    target = this._updateConstructionSite();

    if (!target) return ERR_NOT_FOUND;

    const buildResult = this.build(target);
    if (buildResult == OK) {
      // 如果修好的是 rempart 的话就移除墙壁缓存
      // 让维修单位可以快速发现新 rempart
      if (target.structureType == STRUCTURE_RAMPART) delete this.room.memory.focusWall;
    } else if (buildResult == ERR_NOT_IN_RANGE) this.goTo(target.pos);

    return buildResult;
  };

  /**
   * 寻找下一个建筑工地
   * @returns 下一个建筑工地，或者 null
   */
  Creep.prototype._updateConstructionSite = function () {
    const targets = this.room.find(FIND_MY_CONSTRUCTION_SITES);
    if (targets.length > 0) {
      const target = targets[0];
      // 把工地的信息存入缓存,用于在建造后验证是否已经完成建造了
      this.room.memory.constructionSiteId = target.id;
      // this.room.memory.constructionSiteType = target.structureType;
      // this.room.memory.constructionSitePos = [target.pos.x, target.pos.y];
      return target;
    } else {
      delete this.room.memory.constructionSiteId;
      // delete this.room.memory.constructionSiteType;
      return undefined;
    }
  };

  /**
   * 升级本房间的controller
   */
  Creep.prototype.upgrade = function () {
    const actionResult = this.upgradeController(this.room.controller);
    // 如果刚开始站定工作，就把自己的位置设置为禁止通行点
    // if (actionResult === OK && !this.memory.standed) {
    //   this.memory.standed = true;
    //   this.room.addRestrictedPos(this.name, this.pos);
    // } else
    if (actionResult == ERR_NOT_IN_RANGE) {
      this.goTo(this.room.controller.pos);
    }
    return true;
  };
};
