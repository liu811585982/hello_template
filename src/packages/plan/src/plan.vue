<template>
  <div class="h-plan" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <!-- 计划模板左侧放置标签，须自定义 -->
    <div class="h-plan-label" :style="labelStyle">
      <slot name="label"></slot>
    </div>
    <!-- 计划模板右侧放置操作按钮，须自定义 -->
    <div class="h-plan-action" :style="actionStyle">
      <slot name="action"></slot>
    </div>
    <!-- 时间轴面板 -->
    <timebar v-model="value"></timebar>
  </div>
</template>

<script>
  import Timebar from './plan-timebar'
  export default {
    name: 'Plan',

    components: {
      Timebar
    },

    props: {
      value: Array,

      labelWidth: String,

      actionWidth: String,

      disabled: {
        type: Boolean,
        default: false
      },

      step: {
        type: Number,
        default: 15
      },

      showTooltip: {
        type: Boolean,
        default: true
      },

      showPopover: {
        type: Boolean,
        default: true
      },

      customRangeClass: Object,

      currentType: [Number, String],

      maxRangeCount: Number
    },

    computed: {
      $group () {
        let parent = this.$parent
        while (parent.$options.componentName !== 'PlanGroup') {
          parent = parent.$parent
        }
        return parent
      },

      panelWidth () {
        return this.$group.panelWidth
      },

      labelStyle () {
        let labelWidth = this.$group.labelWidth || this.labelWidth
        return labelWidth ? {
          width: labelWidth,
          marginLeft: '-' + labelWidth
        } : null
      },

      actionStyle () {
        let actionWidth = this.$group.actionWidth || this.actionWidth
        return actionWidth ? {
          width: actionWidth,
          marginRight: '-' + actionWidth
        } : null
      }
    },

    methods: {
      handleMouseEnter (event) {
        this.$emit('mouseenter', event)
      },

      handleMouseLeave (event) {
        this.$emit('mouseleave', event)
      }
    }
  }
</script>

<style>

</style>
