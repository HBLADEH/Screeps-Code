// 挂载 creep 拓展
const mountFun = require("./mount");

const creepController = require("./controller.creep");

const mark = require("./mark");

module.exports.loop = function () {
  mountFun();
  creepController();
  // console.log(Game.rooms['W31S41'].find(RESOURCE_ENERGY));
  // 遍历所有 creep 并执行 work 方法
  for (const name in Game.creeps) {
    Game.creeps[name].work();
  }
  
  // Game.spawns["MotherBase"].work()
  Object.values(Game.structures).forEach((item) => {
    if (item.work) item.work();
  });
//   mark();
  if (Game.time % 10 == 0) {
    mark();
  }

};
