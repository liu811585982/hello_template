<template>
  <div class="netTopo" ref="netTopo">
    <div ref="chart" class="chart"></div>
    <span ref="dataName" class="dataName">{{dataName}}</span>
  </div>
</template>

<script>
  import echarts from 'echarts/lib/echarts';
  import 'echarts/lib/chart/lines';
  import 'echarts/lib/chart/effectScatter';
  import 'echarts/lib/chart/scatter';
  import 'echarts/lib/component/grid';
  import 'echarts/lib/component/dataZoom';

  import debounce from 'lodash/debounce';
  import { SIZE, LEVEL_COLOR, tes, getTopology } from 'index@/utils/graph.js';
  import { flatten } from 'index@/utils/util.js';

  const _ = { debounce };
  const LEFT_WIDTH = 244;
  const RIGHT_WIDTH = 378;
  const BOTTOM_HEIGHT = 100;

  export default {
    name: 'topology-chart',
    props: {
      com: { type: Array, default: () => [] },
      machines: { type: Array, default: () => [] },
      groups: { type: Array, default: () => [] },
      alertStatus: { type: Object, default: () => ({}) },
      bottom: { type: Number, default: () => 100 },
      top:{ type: Number, default: () => -10 },
    },
    data() {
      return {
        dataName: '',
        chart: null,
        initialRange: 100,
        zoom: 1,
      };
    },
    watch: {
      machines() {
        this.renderCharts();
      },
    },
    mounted() {
      const vm = this;
      this.$nextTick(() => {
        vm.$refs.chart.style.height = this.$store.state.height + 'px';
        vm.chart = echarts.init(vm.$refs.chart);
        vm.chart.on('datazoom', _.debounce(({ batch }) => {
          const { start, end } = batch[0];
          const zoomFactor = vm.initialRange / (end - start);
          const zf = this.zoom * zoomFactor;
          const opt = vm.chart.getOption();
          vm.chart.setOption({
            series: opt.series
              .filter(({ name }) => /^node-/.test(name))
              .map(({ name, _baseSymbolSize }) => ({
                name,
                symbolSize: _baseSymbolSize * zoomFactor,
                .../^node-expand-button-/.test(name)
                  ? { symbolOffset: [32 * zf, -32 * zf] }
                  : {},
              })),
          },true);
        }, 500));
        vm.chart.on('click', ({ seriesName, seriesType, data: [,, data] }) => {
          if (/^node-expand-button-/.test(seriesName)) {
            tes.toggle('machine', data.id);
            const { dataZoom } = this.chart.getOption();
            const { start, end } = dataZoom[0];
            const zoomFactor = vm.initialRange / (end - start);
            vm.renderCharts({ noMerge: true, point: data, zoomFactor });
            return;
          }
          if (seriesType === 'scatter') {
              if ( seriesName != 'node-clouds' && vm.$route.path != '/visual/netTopo') {
                vm.$router.push({
                  path: '/visual/netTopo',
                  query: {id: data.id}
                });
              }
            /*if (data.resource === 'component') {
              vm.$router.push(`/status${data.id}?open=second`);
            }
            if (data.resource === 'machine') {
              vm.$router.push(`/status${data.id}?open=second`);
            }*/
            if (data.resource === 'group') {
              const hasGroup = !!data._.groups.length;
              const hasMachine = this.machines.some(machine => machine.group.id === data.id);
              if (hasGroup || hasMachine) {
                tes.toggle('group', data.id);
                // 收缩分组时把子分组也收缩掉
                if (!tes.get('group', data.id)) {
                  flatten(data._.groups, 'groups').forEach(({ id }) => {
                    tes.set('group', id, false);
                  });
                }
                const { dataZoom } = this.chart.getOption();
                const { start, end } = dataZoom[0];
                const zoomFactor = vm.initialRange / (end - start);
                vm.renderCharts({ noMerge: true, point: data, zoomFactor });
              }
            }
          }
        });

        vm.renderCharts();
      });

    },
    beforeDestroy() {
      this.chart.dispose();
    },
    methods: {
      getViewBox(nodes) {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        nodes.forEach(({ x, y, resource }) => {
          const { size } = SIZE[resource];
          minX = Math.min(minX, x - size);
          minY = Math.min(minY, y - size);
          maxX = Math.max(maxX, x + size);
          maxY = Math.max(maxY, y + size);
        });
        return { minX, minY, maxX, maxY };
      },
      getSeriesOfLinks(links) {
        return [
          links.filter(link => !link.showEffect),
          links.filter(link => link.showEffect),
        ]
          .map((data, idx) => ({
            name: `line-${idx ? 'with' : 'without'}-effect`,
            type: 'lines',
            coordinateSystem: 'cartesian2d',
            zlevel: idx,
            animation: false,
            effect: {
              show: !!idx,
              period: 6,
              trailLength: 0.7,
              color: '#fff',
              symbolSize: 3,
            },
            lineStyle: {
              color: idx ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.2)',
              opacity: 1,
              curveness: 0.2,
            },
            data,
          }));
      },
      getSeriesOfEffectNodes(nodes, zoom = 1, zoomFactor = 1) {
        return nodes
          .filter(node => node.showEffect)
          .map(node => ({
            name: `node-effect-${node.id}`,
            type: 'effectScatter',
            coordinateSystem: 'cartesian2d',
            zlevel: 2,
            rippleEffect: {
              scale: 2,
            },
            symbol: 'circle',
            // symbol: 'path://M0,-30L26,-15,26,15,0,30,-26,15,-26,-15Z',
            symbolSize: SIZE[node.resource].r * zoom * zoomFactor,
            // 作为原始值用作缩放时的基数
            _baseSymbolSize: SIZE[node.resource].r * zoom,
            itemStyle: {
              color: LEVEL_COLOR[node.level].effect,
            },
            data: [[node.x, node.y, node]],
          }));
      },
      //清空报表
      clearCharts () {
        this.chart && this.chart.clear();
      },
      getSeriesOfNodes(nodes, zoom = 1, zoomFactor = 1) {
        return nodes.map(node => ({
          name: `node-${node.id}`,
          type: 'scatter',
          coordinateSystem: 'cartesian2d',
          zlevel: 3,
          hoverAnimation: true,
          symbol: node.symbol,
          symbolSize: node.symbolSize * zoom * zoomFactor,
          _baseSymbolSize: node.symbolSize * zoom,
          itemStyle: node.itemStyle,
          label: node.label,
          data: [[node.x, node.y, node]],
        }));
      },
      getSeriesOfExpandButtons(nodes, zoom = 1, zoomFactor = 1) {
        return nodes
          .filter(({ resource }) => resource === 'machine')
          .filter(node => node._.components.length)
          .map((node) => {
            const zf = zoom * zoomFactor;
            const isExpand = tes.get('machine', node.id);
            const fragments = [
              {
                _delta: isExpand ? 2 : 0,
                name: `node-expand-button-bg-${node.id}`,
                zlevel: 4,
                itemStyle: { color: isExpand ? '#262c2f' : '#d5f9ff' },
                symbol: 'circle',
              },
              {
                _delta: 0,
                name: `node-expand-button-${node.id}`,
                zlevel: 5,
                itemStyle: { color: isExpand ? '#d5f9ff' : '#262c2f' },
                symbol: isExpand
                  ? 'path://M140,28.5c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5s7.5-3.358,7.5-7.5S144.142,28.5,140,28.5z M143.063,36.5h-6.125  c-0.242,0-0.438-0.224-0.438-0.5s0.196-0.5,0.438-0.5h6.125c0.242,0,0.438,0.224,0.438,0.5S143.304,36.5,143.063,36.5z'
                  : 'path://M7.5,0C3.4,0,0,3.4,0,7.5S3.4,15,7.5,15S15,11.6,15,7.5S11.6,0,7.5,0z M7.5,14C3.9,14,1,11.1,1,7.5S3.9,1,7.5,1S14,3.9,14,7.5S11.1,14,7.5,14zM11,7H8V4c0-0.3-0.2-0.5-0.5-0.5S7,3.7,7,4v3H4C3.7,7,3.5,7.2,3.5,7.5S3.7,8,4,8h3v3c0,0.3,0.2,0.5,0.5,0.5S8,11.3,8,11V8h3c0.3,0,0.5-0.2,0.5-0.5S11.3,7,11,7z',
              },
            ];
            return fragments.map(fragment => Object.assign({
              type: 'scatter',
              coordinateSystem: 'cartesian2d',
              hoverAnimation: false,
              symbolOffset: [32 * zf, -32 * zf],
              symbolSize: (32 + fragment._delta) * zf,
              _baseSymbolSize: (32 + fragment._delta) * zoom,
              data: [[node.x, node.y, node]],
            }, fragment));
          })
          .reduce((a, b) => [].concat(a, b), []);
      },
      renderCharts({ noMerge = false, point, zoomFactor = 1 } = {}) {
        let vm = this;
        if (!this.machines.length) {
          return Promise.resolve();
        } else {
          //云图超过20个不显示title，悬浮显示
          if (this.machines[0].components.length > 20) {
            vm.chart.on('mouseover', (obj) => {
              if (obj.data[2]) {
                vm.dataName = obj.data[2].name;

                //获取鼠标位置
                let evt = evt || window.event;
                let x = evt.clientX + document.body.scrollLeft - document.body.clientLeft - ((window.localStorage.submenu == 'true') ? 20 : 200);
                let y = evt.clientY + document.body.scrollTop - document.body.clientTop - 25;

                vm.$refs.dataName.style.left = x + 'px';
                vm.$refs.dataName.style.top = y + 'px';
              } else {
                vm.dataName = '';
              }
            });
            vm.chart.on('mouseout', (obj) => {
              if (obj.data[2])
                vm.dataName = '';
            });
          }
        }

        return getTopology({ machines: this.machines, groups: this.groups }, this.alertStatus, point)
          .then(({ nodes, links }) => {
            let BOTTOM_HEIGHT = this.bottom || BOTTOM_HEIGHT;
            const TOP_HEIGHT = this.top || -10;
            const cw = document.body.clientWidth;
            const ch = document.body.clientHeight;
            const width = cw + Math.abs(LEFT_WIDTH - RIGHT_WIDTH);
            const height = ch + Math.abs(TOP_HEIGHT - BOTTOM_HEIGHT);
            const sideLen = Math.max(width, height);

            const zoom = Math.min(
              (cw - LEFT_WIDTH - RIGHT_WIDTH) / sideLen,
              (ch - TOP_HEIGHT - BOTTOM_HEIGHT) / sideLen,
            );
            this.zoom = zoom;
            const { minX, minY, maxX, maxY } = this.getViewBox(nodes);
            const axisRange = Math.max(-minX, -minY, maxX, maxY) * 4 / zoom | 0;
            const maxRange = Math.max(maxX - minX, maxY - minY) / 2;
            const offsetX = (minX + maxX) / 2;
            const offsetY = (minY + maxY) / 2;
            const option = {
              grid: {
                width: sideLen,
                height: sideLen,
                left: Math.min(0, (width - height) / 2) +
                (LEFT_WIDTH - Math.max(LEFT_WIDTH, RIGHT_WIDTH)),
                right: 0,
                top: Math.min(0, (height - width) / 2) +
                (TOP_HEIGHT - Math.max(TOP_HEIGHT, BOTTOM_HEIGHT)),
                bottom: 0,
              },
              xAxis: { show: false, min: -axisRange, max: axisRange },
              yAxis: { show: false, min: -axisRange, max: axisRange },
              dataZoom: [
                {
                  type: 'inside',
                  xAxisIndex: [0],
                  filterMode: 'empty',
                  startValue: (-maxRange / zoom + offsetX) / zoomFactor,
                  endValue: (maxRange / zoom + offsetX) / zoomFactor,
                },
                {
                  type: 'inside',
                  yAxisIndex: [0],
                  filterMode: 'empty',
                  startValue: (-maxRange / zoom + offsetY) / zoomFactor,
                  endValue: (maxRange / zoom + offsetY) / zoomFactor,
                },
              ],
              series: [
                ...this.getSeriesOfLinks(links),
                ...this.getSeriesOfEffectNodes(nodes, zoom, zoomFactor),
                ...this.getSeriesOfNodes(nodes, zoom, zoomFactor),
                ...this.getSeriesOfExpandButtons(nodes, zoom, zoomFactor),
              ],
            };
            this.chart.setOption(option, noMerge);
            if (zoomFactor === 1) {
              const { dataZoom } = this.chart.getOption();
              this.initialRange = dataZoom[0].end - dataZoom[0].start;
            }
          })
          .catch(() => {});
      },
      resize: _.debounce(function resize() {
        this.chart.resize();
        this.renderCharts();
      }, 500),
    },
  };
</script>
