<template>
  <div class="h-plan-group" :style="style">
    <!-- 时间轴 -->
    <plan-timeline :width="panelWidth"></plan-timeline>
    <!-- 计划组 -->
    <slot></slot>
  </div>
</template>

<script>
  import PlanTimeline from './plan-timeline'
  import { addResizeListener, removeResizeListener } from '../../../utils/resize-event'
  import throttle from 'throttle-debounce/throttle'

  export default {
    name: 'PlanGroup',

    componentName: 'PlanGroup',

    components: {
      PlanTimeline
    },

    props: {
      labelWidth: String,

      actionWidth: String,

      fit: {
        type: Boolean,
        default: true
      }
    },

    data () {
      return {
        panelWidth: 0
      }
    },

    computed: {
      style () {
        return {
          marginLeft: this.labelWidth,
          marginRight: this.actionWidth
        }
      }
    },

    mounted () {
      this.setWidth()
      this.bindEvents()
      this.$ready = true
    },

    destroyed () {
      // 组件销毁，一并移除绑定的resize事件
      if (this.windowResizeListener) removeResizeListener(this.$el, this.windowResizeListener)
    },

    methods: {
      // 计算元素宽度
      setWidth () {
        this.panelWidth = this.$el.clientWidth
      },

      // 绑定窗口resize事件
      bindEvents () {
        if (this.fit) {
          // throttle可避免窗口变化时，执行太多次回调函数
          this.windowResizeListener = throttle(50, () => {
            if (this.$ready) this.setWidth()
          })
          addResizeListener(this.$el, this.windowResizeListener)
        }
      }
    }
  }
</script>
