const creepSetting = {
  harvester: {
    sum: 0,
    level: 2,
    com: [WORK, CARRY, MOVE, MOVE],
    opt: {
      memory: {
        role: "harvester",
      },
    },
  },
  upgrader: {
    sum: 1,
    level: 1,
    com: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    opt: {
      memory: {
        role: "upgrader",
      },
    },
  },
  builder: {
    sum: 1,
    level: 1,
    com: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
    // com: [WORK, WORK, CARRY, MOVE, MOVE, MOVE],
    opt: {
      memory: {
        role: "builder",
      },
    },
  },
  miner: {
    sum: 2,
    level: 1,
    com: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    // com: [WORK, WORK, CARRY, MOVE, MOVE, MOVE],
    opt: {
      memory: {
        role: "miner",
      },
    },
  },
  remoteHarvester: {
    sum: 0,
    level: 1,
    com: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    // com: [WORK, WORK, CARRY, MOVE, MOVE, MOVE],
    opt: {
      memory: {
        role: "remoteHarvester",
      },
    },
  },
  cotainerHarvester: {
    sum: 1,
    level: 1,
    com: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
    opt: {
      memory: {
        role: "cotainerHarvester",
      },
    },
  },
  cotainerHarvester2: {
    sum: 1,
    level: 1,
    com: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
    opt: {
      memory: {
        role: "cotainerHarvester2",
      },
    },
  },
  transfer: {
    sum: 1,
    level: 2,
    com: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    opt: {
      memory: {
        role: "transfer",
      },
    },
  },
  centerTransfer: {
    sum: 1,
    level: 5,
    com: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    opt: {
      memory: {
        role: "centerTransfer",
      },
    },
  },
};
module.exports = creepSetting;
