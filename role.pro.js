/**
 * tranfser 触发后事处理的最小生命
 */
const TRANSFER_DEATH_LIMIT = 20;

const roles = {
  /**
   * 处理从目标地点把资源传入指定地点的 creeps
   */
  transfer: (sourceId, targetId) => ({
    source: (creep) => {
      if (creep.ticksToLive <= TRANSFER_DEATH_LIMIT) return deathPrepare(creep, targetId);
      if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) return true;
      creep.getEngryFrom(Game.getObjectById(sourceId));
      const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
      // if (target) {
        // if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
        //   creep.moveTo(target, {
        //     visualizePathStyle: {
        //       stroke: "#CC9999",
        //     },
        //     reusePath: 20,
        //   });
        // }
      // }
    },
    target: (creep) => {
      if (creep.ticksToLive <= TRANSFER_DEATH_LIMIT) return deathPrepare(creep, targetId);
      creep.transferTo(Game.getObjectById(targetId), RESOURCE_ENERGY);
      if (creep.store.getUsedCapacity() === 0) return true;
    },
  }),
  /**
   * 处理从目标地点把资源传入需要资源的目的地的 creeps
   */
  centerTransfer: (targetId) => ({
    // source: (creep) => {
    //   if (creep.ticksToLive <= TRANSFER_DEATH_LIMIT) return deathPrepare(creep, targetId);
    //   if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) return true;
    //   let container = Game.getObjectById("5e917152af620e72b6ce628d");

    //   if (container.store.getUsedCapacity() > creep.store.getCapacity()) {
    //     creep.getEngryFrom(container);
    //   } else {
    //     creep.getEngryFrom(Game.getObjectById(targetId));
    //   }
    // },
    target: (creep) => {
      if (creep.ticksToLive <= TRANSFER_DEATH_LIMIT) return deathPrepare(creep, targetId);

      let needTarget = creep.findNeedEnergyTarget(creep);
      // console.log(needTarget);

      let container = Game.getObjectById("5e917152af620e72b6ce628d");

      if (needTarget) {
        if (creep.store.getUsedCapacity() === 0) {
          if (container.store.getUsedCapacity() > creep.store.getCapacity()) {
            creep.getEngryFrom(container);
          } else {
            creep.getEngryFrom(Game.getObjectById(targetId));
          }
        } else {
          creep.transferTo(needTarget, RESOURCE_ENERGY);
        }
      } else {
        if (container.store.getUsedCapacity() > creep.store.getCapacity() && creep.store.getUsedCapacity() === 0) {
          creep.getEngryFrom(container);
        } else if (creep.store.getUsedCapacity() != 0) {
          // needTarget = Game.getObjectById(targetId);
          needTarget = Game.getObjectById("5e9067e0c49f497fc3bcbc2a");
          creep.transferTo(needTarget, RESOURCE_ENERGY);
        }
      }
    },
  }),
  /**
   * 使用 container 来采矿的 creeps
   * @param sourceId 要挖的矿 id
   * @param targetId 要去的 container id
   */
  cotainerHarvester: (sourceId, targetId) => ({
    prepare: (creep) => {
      let target = Game.getObjectById(targetId);
      creep.goTo(target.pos);

      if (creep.posCheck(creep.pos, target.pos)) return true;
      else return false;
    },
    target: (creep) => {
      creep.getEngryFrom(Game.getObjectById(sourceId));
    },
  }),
};

/**
 * 快死时的后事处理
 * 将资源存放在对应的地方
 * 存完了就自杀
 *
 * @param creep transfer
 * @param sourceId 能量存放处
 */
function deathPrepare(creep, sourceId) {
  if (creep.store.getUsedCapacity() > 0) {
    for (const resourceType in creep.store) {
      let target;
      // 不是能量就放到 terminal 里
      if (resourceType != RESOURCE_ENERGY && resourceType != RESOURCE_POWER && creep.room.terminal) {
        target = creep.room.terminal;
      } else {
        // 否则就放到 storage 或者玩家指定的地方
        target = sourceId ? Game.getObjectById(sourceId) : creep.room.storage;
      }
      // 转移资源
      const transferResult = creep.transfer(target, resourceType);
      if (transferResult == ERR_NOT_IN_RANGE) creep.goTo(target.pos);

      return false;
    }
  } else creep.suicide();
}

/**
 * 获取指定房间的物流任务
 *
 * @param room 要获取物流任务的房间名
 */
function getRoomTransferTask(room) {
  const task = room.getRoomTransferTask();
}

module.exports = roles;
