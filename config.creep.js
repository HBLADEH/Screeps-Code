const roles = require("./role.base");
const rolesPro = require("./role.pro");
const source = require("./setting.source");
const structure = require("./setting.structure");

module.exports = {
  // 此处存放所有的 creep 配置
  harvester: roles.harvester(source.R1source1, source.storage),
  upgrader: roles.upgrader(structure.Room1, structure.storage),
  builder: roles.builder(structure.Room1, structure.storage),
  cotainerHarvester: rolesPro.cotainerHarvester(source.R1source1, structure.container1),
  cotainerHarvester2: rolesPro.cotainerHarvester(source.R1source2, structure.container2),
  transfer: rolesPro.transfer(structure.container2, structure.storage),
  centerTransfer: rolesPro.centerTransfer(structure.storage),
  miner: rolesPro.miner(),
  claimer: rolesPro.claimer(structure.Room2),
  upgrader2: roles.upgrader(structure.Room2, source.R2source1),
};
