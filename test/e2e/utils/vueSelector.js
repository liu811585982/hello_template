import { Selector } from 'testcafe'

export default Selector((complexSelector, selectorOptions) => {
  function validateSelector (selector) {
    if (selector !== void 0 && typeof selector !== 'string') { throw new Error(`If the selector parameter is passed it should be a string, but it was ${typeof selector}`) }
  }

  function validateVueVersion (rootInstance) {
    const MAJOR_SUPPORTED_VUE_VERSION = 2
    const vueVersion = parseInt(findVueConstructor(rootInstance).version.split('.')[0], 10)

    if (vueVersion < MAJOR_SUPPORTED_VUE_VERSION) { throw new Error('testcafe-vue-selectors supports Vue version 2.x and newer') }
  }

  /* eslint-disable no-unused-vars, no-eval */
  function findVueConstructor (rootInstance) {
    // NOTE: Testcafe does not support a ClientFunction containing polyfilled functions. See list in
    // https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-runtime/src/definitions.js.
    // This is why, we use this hack.
    let Vue = eval('Object.getPrototypeOf(rootInstance)').constructor

    while (Vue.super) { Vue = Vue.super }

    return Vue
  }
  /* eslint-enable no-unused-vars, no-eval */

  function findFirstRootInstance () {
    let instance = null
    const treeWalker = document.createTreeWalker(
      document,
      NodeFilter.SHOW_ELEMENT,
      () => NodeFilter.FILTER_ACCEPT,
      false
    )

    while (!instance && treeWalker.nextNode()) { instance = treeWalker.currentNode.__vue__ }
    return instance
  }

  function getData (instance, prop) {
    const result = {}

    Object.keys(prop).forEach(key => {
      result[key] = instance[key]
    })

    return result
  }

  function getProps (instance) {
    return getData(instance, instance.$options.props || {})
  }

  function getComponentTagNames (componentSelector) {
    return componentSelector
      .split(' ')
      .filter(el => !!el)
      .map(el => el.trim())
  }

  function getComponentTag (instance) {
    let name = instance.$options.name ||
    instance.$options._componentTag ||
    instance.$options.__file ||
    ''
    console.log(name)
    return name
  }

  function filterNodes (root, tags) {
    const foundComponents = []

    function walkVueComponentNodes (node, tagIndex, checkFn) {
      if (checkFn(node, tagIndex)) {
        if (tagIndex === tags.length - 1) {
          foundComponents.push(node.$el)
          return
        }

        tagIndex++
      }

      for (let i = 0; i < node.$children.length; i++) {
        const childNode = node.$children[i]

        walkVueComponentNodes(childNode, tagIndex, checkFn)
      }
    }

    walkVueComponentNodes(root, 0, (node, tagIndex) => tags[tagIndex] === getComponentTag(node))
    console.log(tags.join(' '), foundComponents)
    return foundComponents
  }

  function checkOptions ({props, data}, instance) {
    let matchFlag = true
    if (props) {
      const nodeProps = getProps(instance)
      for (let key of Object.keys(props)) {
        if (props[key] !== nodeProps[key]) {
          matchFlag = false
          break
        }
      }
    }
    if (matchFlag && data) {
      const nodeData = getData(instance)
      for (let key of Object.keys(data)) {
        if (data[key] !== nodeData[key]) {
          matchFlag = false
          break
        }
      }
    }
    return matchFlag
  }

  function filterNodesByOptions (nodes, selectorOptions) {
    const result = nodes.filter(node => {
      return checkOptions(selectorOptions, node.__vue__)
    })
    return result
  }

  validateSelector(complexSelector)

  const rootInstance = findFirstRootInstance()

  if (!rootInstance) { return null }

  validateVueVersion(rootInstance)

  if (!complexSelector) { return rootInstance.$el }

  const componentTags = getComponentTagNames(complexSelector)
  const vueNodes = filterNodes(rootInstance, componentTags)
  return !selectorOptions ? vueNodes : filterNodesByOptions(vueNodes, selectorOptions)
}).addCustomMethods({
  getVue: (node, fn) => {
    const nodeVue = node.__vue__

    if (!nodeVue) { return null }

    function getData (instance, prop) {
      debugger
      const result = {}

      Object.keys(prop).forEach(key => {
        result[key] = instance[key]
      })

      return result
    }

    function getProps (instance) {
      return getData(instance, instance.$options.props || {})
    }

    function getState (instance) {
      const props = instance._props || instance.$options.props
      const getters = instance.$options.vuex && instance.$options.vuex.getters
      const result = {}

      Object.keys(instance._data)
        .filter(key => !(props && key in props) && !(getters && key in getters))
        .forEach(key => {
          result[key] = instance._data[key]
        })

      return result
    }

    function getComputed (instance) {
      return getData(instance, instance.$options.computed || {})
    }

    const props = getProps(nodeVue)
    const state = getState(nodeVue)
    const computed = getComputed(nodeVue)

    if (typeof fn === 'function') { return fn({ props, state, computed }) }

    return { props, state, computed }
  }
})
