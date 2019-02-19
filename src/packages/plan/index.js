import Plan from './src/plan'

/* istanbul ignore next */
Plan.install = function (Vue) {
  Vue.component(Plan.name, Plan)
}

export default Plan
