const mountCreep = require("./mount.creep");
const mountRoom = require("./mount.room");
const mountStructure = require("./mount.structure");

module.exports = () => {
  if (!global.hasExtension) {
    console.log("[mount] 重新挂载扩展");
    mountCreep();
    mountRoom();
    mountStructure();
    global.hasExtension = true;
  }
};
