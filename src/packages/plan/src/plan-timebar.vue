<template>
  <div class="h-plan-wrapper" @mousedown="handleMouseDown">
    <!-- 计划时段组 -->
    <range v-for="(item,index) in value" :key="index" :ref="'range'+index" v-model="value[index]" :limitRange="getLimitRange(index)" @destroy="removeRange(index)">
    </range>
  </div>
</template>

<script>
  import Range from './plan-range'
  import { pixelToSecond } from './util'

  export default {
    components: {
      Range
    },

    props: {
      value: Array
    },

    data () {
      return {
        drawing: false,
        startX: null,
        startOffsetX: null,
        currentOffsetX: null
      }
    },

    computed: {
      // 是否禁用编辑
      disabled () {
        return this.$parent.disabled
      },

      // 排序后的数据副本拷贝，计算范围限制用到
      sortData () {
        let dataCopy = JSON.parse(JSON.stringify(this.value))
        return dataCopy.sort((item1, item2) => {
          return item1.from > item2.from
        })
      },

      // 时间轴像素长度
      panelWidth () {
        return this.$parent.panelWidth
      },

      // 步距配置项以分钟为单位，须转换为秒进行计算
      step () {
        return this.$parent.step * 60
      },

      currentType () {
        return this.$parent.currentType
      },

      maxRangeCount () {
        return this.$parent.maxRangeCount
      }
    },

    methods: {
      // 删除时段
      removeRange (index) {
        this.value.splice(index, 1)
      },

      // 计算时段的大小范围限制
      getLimitRange (i) {
        let limitRange = []
        this.sortData.forEach((item, index) => {
          if (this.value[i].from === item.from) {
            limitRange.push(index > 0 ? this.sortData[index - 1].to : 0)
            limitRange.push(this.sortData[index + 1] ? this.sortData[index + 1].from : 86400)
          }
        })
        return limitRange
      },

      handleMouseDown (event) {
        event.preventDefault()
        if (this.disabled) return
        if ((this.maxRangeCount && this.value.length < this.maxRangeCount) || !this.maxRangeCount) {
          this.onDrawStart(event)
          window.addEventListener('mousemove', this.onDrawing)
          window.addEventListener('mouseup', this.onDrawEnd)
          window.addEventListener('contextmenu', this.onDrawEnd)
        }
      },

      onDrawStart (event) {
        this.drawing = true
        this.startX = event.clientX
        this.startOffsetX = this.currentOffsetX = event.offsetX
        const startValue = Math.round(pixelToSecond(this.currentOffsetX, this.panelWidth) / this.step) * this.step
        this.value.push({
          type: this.currentType,
          from: startValue,
          to: startValue
        })
      },

      onDrawing (event) {
        if (this.drawing) {
          const last = this.value.length - 1
          this.currentOffsetX = event.clientX - this.startX + this.startOffsetX
          let $newRange = this.$refs['range' + last]
          $newRange && $newRange[0].startHandleDrag(this.currentOffsetX)
        }
      },

      onDrawEnd (event) {
        if (this.drawing) {
          /*
           * 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
           * 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
           */
          setTimeout(() => {
            this.drawing = false
            let $newRange = this.$refs['range' + last]
            $newRange && $newRange[0].hideTooltip()
            $newRange && $newRange[0].stopHandleDrag()
          }, 0)
          const last = this.value.length - 1
          let newValue = this.value[last]
          if (newValue.from === newValue.to) {
            this.value.pop()
          }

          window.removeEventListener('mousemove', this.onDrawing)
          window.removeEventListener('mouseup', this.onDrawEnd)
          window.removeEventListener('contextmenu', this.onDrawEnd)
        }
      }
    }
  }
</script>
