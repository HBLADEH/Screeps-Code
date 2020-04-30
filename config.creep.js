const roles = require("./role.base");
const rolesPro = require("./role.pro");
const source = require("./setting.source");
const structure = require("./setting.structure");

module.exports = {
  // 此处存放所有的 creep 配置
  harvester: roles.harvester(source.source1, source.storage),
  upgrader: roles.upgrader(structure.storage),
  builder: roles.builder(structure.storage),
  cotainerHarvester: rolesPro.cotainerHarvester(source.source1, structure.container1),
  cotainerHarvester2: rolesPro.cotainerHarvester(source.source2, structure.container2),
  transfer: rolesPro.transfer(structure.container2, structure.storage),
  centerTransfer: rolesPro.centerTransfer(structure.storage),
  miner: rolesPro.miner(),
};
