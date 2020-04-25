const structureSetting = require("./setting.structure");
const creepSetting = require("./setting.creep");

module.exports = () => {
  // console.log();
  let thisSpawn = Game.getObjectById(structureSetting.Spawn);
  for (const name in Memory.creeps) {
    /* 尝试获取 creep */
    let creep = Game.creeps[name];
    /* 获取不到就说明已经死 了 */
    if (!creep) {
      let deadRole = Memory.creeps[name].role;
      delete Memory.creeps[name];
      let task = {
        taskName: deadRole,
        level: creepSetting[deadRole].level,
      };
      // console.log(task);

       thisSpawn.addTask(task);
    }
  }
  thisSpawn.CheckList();

  // 定期校验队列
  if (Game.time % 3000 == 0) {
    console.log("执行校验");
    thisSpawn.CheckList();
  }
};
