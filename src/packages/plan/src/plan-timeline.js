export default {
  data () {
    return {
      largeSplit: 24, // 时间轴划分多少大格
      normalSplit: 2, // 每个大格有多少中格
      smallSplit: 2 // 每个中格有多少个小格
    }
  },

  computed: {
    // 均等分隔总数
    interval () {
      return this.largeSplit * this.normalSplit * this.smallSplit
    },
    // 计算格子间距
    spacing () {
      return (this.width + 1) / this.interval - 1
    }
  },

  props: {
    width: Number
  },

  watch: {
    'width': 'setSplit'
  },

  // 渲染逻辑较复杂，不适合用template标签，直接用vue自带的render方法渲染
  render (createElement) {
    return createElement('ul',
      { class: 'h-plan-timeline' },
      Array.apply(null, { length: this.interval }).map((item, index) => {
        let child
        let size = 'long'

        if (index % (this.normalSplit * this.smallSplit) === 0) {
          child = [createElement(
            'span',
            { class: 'h-tickline-label' },
            index === this.interval ? null : index / (this.normalSplit * this.smallSplit) * 24 / this.largeSplit
          )]
        } else if (index % this.smallSplit === 0) {
          size = 'normal'
        } else {
          size = 'small'
        }

        return createElement('li', {
          class: 'h-tickline h-tickline-' + size,
          style: {
            marginRight: this.spacing + 'px'
          }
        }, child)
      })
    )
  },

  methods: {
    // 根据总宽度设置切割数
    setSplit () {
      if (this.width > 800) {
        this.largeSplit = 24
        this.normalSplit = 2
      } else if (this.width > 480) {
        this.largeSplit = 12
        this.normalSplit = 2
      } else {
        this.largeSplit = 8
        this.normalSplit = 3
      }
    }
  }
}
