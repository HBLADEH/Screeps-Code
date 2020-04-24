/**
 * creep 配置项
 *
 * @property prepare 准备阶段执行的方法
 * @property isReady 是否准备完成，该方法必须位于 Creep 上, 且返回 boolean 值
 * @property source 阶段A执行的方法
 * @property target 阶段B执行的方法
 * @property switch 更新状态时触发的方法, 该方法必须位于 Creep 上, 且返回 boolean 值
 */
interface ICreepConfig {
  prepare?: (creep: Creep) => any
  isReady?: (creep: Creep) => boolean
  target?: (creep: Creep) => any
  source?: (creep: Creep) => any
  switch?: (creep: Creep) => boolean
}