<template>
  <div class="grid-panel clearfix">
    <div class="grid-card" v-for="(menu, index) in menus" :key="index" @click.stop="handleClick(menu)">
      <div class="mask" @mouseover="($event) => handleMouseover($event, index)" @mouseleave="($event) => handleMouseleave($event, index)"></div>
      <div class="box" :data-content="menu.name" :class="getClass(index)"></div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        direction: '',
        menus: [
          {name: 'Hello', router: '/hik/hello'},
          // {name: '节点管理', router: '/hos/node'},
          // {name: '云存储管理', router: '/hos/cloud'},
          // {name: '用户管理', router: '/hos/user/list'},
          // {name: '系统管理', router: '/hos/configuration'}
          // {name: '日志管理', router: ''}
        ],
        curIndex: -1
      }
    },
    computed: {
      classes () {
        if (this.direction) {
          return `rotate-${this.direction}`
        } else {
          return ''
        }
      }
    },
    methods: {
      handleMouseover (e, index) {
        this.curIndex = index;
        this.direction = this.getDirection(e)
      },
      handleMouseleave (e, index) {
        this.curIndex = -1;
        const target = e.target;
        const w = target.offsetWidth
        const h = target.offsetHeight
        const offsetLeft = target.getBoundingClientRect().left
        const offsetTop = target.getBoundingClientRect().top
        const { pageX, pageY } = e
        if (pageX <= offsetLeft || pageX >= offsetLeft + w || pageY <= offsetTop || pageY >= offsetTop + h) {
          this.direction = ''
        }
      },
      // 判断鼠标进入方向
      getDirection (e) {
        const target = e.target
        const w = target.offsetWidth
        const h = target.offsetHeight
        const offsetLeft = target.getBoundingClientRect().left
        const offsetTop = target.getBoundingClientRect().top
        const { pageX, pageY } = e
        let direction = -1
        if (pageX >= offsetLeft && pageX <= offsetLeft + w && pageY >= offsetTop && pageY <= offsetTop + h) {
          const x = (pageX - offsetLeft - (w / 2)) * (w > h ? (h / w) : 1)
          const y = (pageY - offsetTop - (h / 2)) * (h > w ? (w / h) : 1)
          direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4
        }
        const dirName = new Array('top','right','bottom', 'left')
        return dirName[direction] || 'top'
      },
      getClass (index) {
        if (index === this.curIndex) {
          return this.classes
        } else {
          return ''
        }
      },
      handleClick (menu) {
        if (menu.router) {
          this.$router.push(menu.router)
        }
      }
    }
  }
</script>
<style scoped>
  .grid-panel {
    width: 100%;
    perspective: 1000px;
    -webkit-perspective: 1000px;
  }

  .grid-panel .grid-card {
    position: relative;
    display: inline-block;
    margin: 6px;
    width: calc(150px - 12px);
    height: calc(150px - 12px);
  }

  .grid-panel .grid-card .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    z-index: 1000 !important;
  }

  .rotate-top {
    transform: rotateX(180deg);
  }
  .grid-panel .grid-card .box.rotate-top:after {
    transform: rotateX(-180deg);
  }

  .rotate-right {
    transform: rotateY(180deg);
  }
  .grid-panel .grid-card .box.rotate-right:after {
    transform: rotateY(-180deg);
  }

  .rotate-bottom {
    transform: rotateX(-180deg);
  }
  .grid-panel .grid-card .box.rotate-bottom:after {
    transform: rotateX(-180deg);
  }

  .rotate-left {
    transform: rotateY(-180deg);
  }
  .grid-panel .grid-card .box.rotate-left:after {
    transform: rotateY(-180deg);
  }

  /* ie firefox 兼容处理 */
  [class*=rotate-]:before {
    opacity: 0;
  }

  .grid-panel .grid-card .box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    transform-style: preserve-3d;
    transition: transform .3s ease-in-out;
    pointer-events: none;
  }

  .grid-panel .grid-card .box:before, .grid-panel .grid-card .box:after {
    position: absolute;
    display: inline-block;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    color: #fff;
    border-radius: 2px;
    pointer-events: none;
  }

  .grid-panel .grid-card .box:before {
    content: '';
    line-height: 188px;
    backface-visibility: hidden;
    z-index: 2;
    transition-delay: .15s;
  }

  .grid-panel .grid-card .box:after {
    content: attr(data-content);
    font-size: 22px;
    line-height: 138px;
    transition-delay: .15s;
  }

  .grid-panel .grid-card:nth-child(1) .box:before {
    content: url('../assets/images/home/cluster.png');
    background: #79C1EE;
  }
  .grid-panel .grid-card:nth-child(1) .box:after {
    background: #79C1EE;
  }

  .grid-panel .grid-card:nth-child(2) .box:before {
    content: url('../assets/images/home/node.png');
    background: #7ECDC8;
  }
  .grid-panel .grid-card:nth-child(2) .box:after {
    background: #7ECDC8;
  }

  .grid-panel .grid-card:nth-child(3) .box:before {
    content: url('../assets/images/home/cloud.png');
    background: #79C1FE;
  }
  .grid-panel .grid-card:nth-child(3) .box:after {
    background: #79C1FE;
  }

  .grid-panel .grid-card:nth-child(4) .box:before {
    content: url('../assets/images/home/user.png');
    background: #49C1FE;
  }
  .grid-panel .grid-card:nth-child(4) .box:after {
    background: #49C1FE;
  }

  .grid-panel .grid-card:nth-child(5) .box:before {
    content: url('../assets/images/home/system.png');
    background: #16c9A9;
  }
  .grid-panel .grid-card:nth-child(5) .box:after {
    background: #16c9A9;
  }

  .grid-panel .grid-card:nth-child(6) .box:before {
    content: url('../assets/images/home/log.png');
    background: #5699A9;
  }
  .grid-panel .grid-card:nth-child(6) .box:after {
    background: #5699A9;
  }

  .clearfix {
    zoom: 1
  }
  .clearfix:after {
    content: " ";
    display: block;
    clear: both;
  }
</style>

<style>
</style>