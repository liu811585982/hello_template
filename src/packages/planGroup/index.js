import PlanGroup from '../plan/src/plan-group'

/* istanbul ignore next */
PlanGroup.install = function (Vue) {
  Vue.component(PlanGroup.name, PlanGroup)
}

export default PlanGroup
