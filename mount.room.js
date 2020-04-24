const creepSetting = require("./setting.creep");

module.exports = function () {
  /**
   * 检查任务队列
   */
  Spawn.prototype.work = function () {
    if (!this.room.memory.spawnList) this.room.memory.spawnList = [];
    /* 当前正在生产 | 内存中无生产队列 | 生产队列为空 就不执行操作 */
    this.room.memory.spawnList = this.room.memory.spawnList.sort(compare("level"));
    // for (let key in this.room.memory.spawnList) {
    //   console.log(this.room.memory.spawnList[key].taskName);
    // }
    if (this.spawning || this.room.memory.spawnList.length == 0) return;

    /* 执行生产操作 */
    const spawnSuccess = this.mainSpawn(this.room.memory.spawnList[0]);

    /* 返回成功则移除当前任务 */
    if (spawnSuccess == 0) this.room.memory.spawnList.shift();
  };

  /**
   * 添加任务队列
   * @return 队列长度
   */
  Spawn.prototype.addTask = function (task) {
    if (!this.room.memory.spawnList) this.room.memory.spawnList = [];

    this.room.memory.spawnList.push(task);
    this.room.memory.spawnList = this.room.memory.spawnList.sort(compare("level"));
    // console.log(this.room.memory.spawnList);

    return this.room.memory.spawnList.length;
  };
  var compare = function (prop) {
    return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      if (val1 < val2) {
        return 1;
      } else if (val1 > val2) {
        return -1;
      } else {
        return 0;
      }
    };
  };
  /**
   * creep 生成实现方法
   */
  Spawn.prototype.mainSpawn = function (task) {
    let workerName = task.taskName + Game.time;
    let result = this.spawnCreep(creepSetting[task.taskName].com, workerName, creepSetting[task.taskName].opt);

    return result;
  };

  /**
   * 计算任务数量
   * @return 队列长度
   */
  Spawn.prototype.taskCount = function () {
    const res = {};
    // console.log(this.room.memory.spawnList);
    if (this.room.memory.spawnList) {
      this.room.memory.spawnList.forEach((key) => {
        if (key.taskName) {
          res[key.taskName]++;
        } else {
          res[key.taskName] = 1;
        }
      });
      return res;
    } else {
      return 0;
    }
  };

  /**
   * 确认 Spawn 的队列
   * @return 队列长度
   */
  Spawn.prototype.CheckList = function () {
    for (let key in creepSetting) {
      let nowList = _.sum(Game.creeps, (creep) => creep.memory.role == key); // 获取当前该种类工蜂集合
      let taskCounts = this.taskCount();
      let taskCount;

      taskCounts[key] == undefined ? (taskCount = 0) : (taskCount = taskCounts[key]);
      // console.log(key + " "+ taskCount);
      // console.log(creepSetting[key].level);

      if (nowList + taskCount < creepSetting[key].sum) {
        let task = {
          taskName: key,
          level: creepSetting[key].level,
        };
        this.addTask(task);
      }
    }
  };
};
