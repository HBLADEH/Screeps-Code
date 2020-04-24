const roles = {
  /**
   * 采集虫
   * sourceId: 从指定矿中挖矿
   * targetid: 将矿物存储在指定位置
   *
   * @param sourceId 要挖的矿 id
   */
  harvester: (sourceId, targetid) => ({
    // 采集能量矿
    source: (creep) => {
      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true;
      const source = Game.getObjectById(sourceId);
      creep.getEngryFrom(source);
    },
    target: (creep) => {
      const target = Game.getObjectById(targetid);
      creep.autoPut(creep, target);
      if (creep.store.getUsedCapacity() === 0) return true;
    },
  }),

  /**
   * 升级虫
   * @param sourceId 要挖的矿 id
   */
  upgrader: (sourceId) => ({
    // 采集能量矿
    source: (creep) => {
      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true;
      const source = Game.getObjectById(sourceId);
      creep.getEngryFrom(source);
    },
    // 升级控制器
    target: (creep) => {
      creep.upgrade();
      if (creep.store.getUsedCapacity() === 0) return true;
    },
  }),

  /**
   * 建筑虫
   */
  builder: (sourceId) => ({
    source: (creep) => {
      // 获取能量
      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true;
      const source = Game.getObjectById(sourceId);
      creep.getEngryFrom(source);
    },
    target: (creep) => {
      // 建造建筑
      if (creep.buildStructure() !== ERR_NOT_FOUND) {
      } else if (creep.upgrade()) {
      }

      if (creep.store.getUsedCapacity() === 0) return true;
    },
  }),
};
module.exports = roles;
