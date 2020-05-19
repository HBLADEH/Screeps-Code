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

  miner: () => ({
    source: (creep) => {
      // console.log(creep.room.name)
      // 要占领的房间
      const room = Game.rooms["W31S40"];
      // 如果该房间不存在就先往房间走
      if (!room) {
        creep.moveTo(new RoomPosition(25, 25, "W31S40"));
      } else {
        let mineral = Game.getObjectById("5ebd9729ab4a7b4585369edd");
        // 检测如果 creep 的剩余生命过少,则跳过采矿阶段
        if (creep.ticksToLive <= 140) return true;
        else if (creep.store.getFreeCapacity() === 0) return true; // 如果 creep 的矿物储存达到满,则直接跳过采矿阶段

        const harvestResult = creep.harvest(mineral);

        // console.log(creep.room.mineral);
        if (harvestResult == ERR_NOT_IN_RANGE) creep.goTo(mineral);
      }
      // let mineral = Game.getObjectById("5bbcb1d440062e4259e933b1")
      // // 检测如果 creep 的剩余生命过少,则跳过采矿阶段
      // if (creep.ticksToLive <= creep.memory.travelTime + 30) return true;
      // else if (creep.store.getFreeCapacity() === 0) return true; // 如果 creep 的矿物储存达到满,则直接跳过采矿阶段

      // const harvestResult = creep.harvest(mineral);
      // // console.log(creep.room.mineral);

      // if (harvestResult == ERR_NOT_IN_RANGE) creep.goTo(mineral)
    },
    target: (creep) => {
      // 要返回的房间
      const room = creep.room.name == "W31S41";
      //  console.log(room)
      // 如果该房间不存在就先往房间走
      if (!room) {
        creep.moveTo(new RoomPosition(25, 25, "W31S41"));
      } else {
        const target = creep.room.terminal;
        if (!target) {
          return false;
        }
        if (creep.transfer(target, "metal") == ERR_NOT_IN_RANGE) creep.goTo(target.pos);
        if (creep.store.getUsedCapacity() === 0) return true;
      }
    },
  }),

  /**
   * 负责暂时预定房间或者是要占领房间的 creeps
   * @param RoomName 要预定或者占领的房间
   */
  claimer: (RoomName) => ({
    prepare: (creep) => {
      const room = creep.room.name == RoomName;
      // console.log(room);
      
      if (!room) {
        creep.goTo(new RoomPosition(25, 25, RoomName));
      } else {
        return true;
      }
      
    },
    source: (creep) => {
      // console.log(12);
      
      if (creep.room.controller) {
        if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
          creep.goTo(creep.room.controller);
        }
      }
      // if (creep.room.controller) {
      //   let result = creep.signController(creep.room.controller, "PJBOY!!!!!!");
      //   if (result == ERR_NOT_IN_RANGE) {
      //     creep.moveTo(creep.room.controller);
      //   }
      //   console.log(result);
        
      // }
    },
    target: (creep) => {},
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
