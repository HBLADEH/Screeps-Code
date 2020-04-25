// 挂载 creep 拓展
const mountFun = require("./mount");

const creepController = require("./controller.creep");

module.exports.loop = function () {
  mountFun();
  creepController();

  // 遍历所有 creep 并执行 work 方法
  for (const name in Game.creeps) {
    Game.creeps[name].work();
  }
  
  // Game.spawns["MotherBase"].work()
  Object.values(Game.structures).forEach((item) => {
    if (item.work) item.work();
  });
};
