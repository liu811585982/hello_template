import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';
import { legend } from 'index@/utils/legend.js';
import util from 'index@/utils/util'
const ROOT_GROUP_ID = '1';

export const SIZE = {
  group: { r: 125, size: 200, offset: 0 },
  machine: { r: 120, size: 120, offset: 32 ,sizeC:200},
  component: { r: 86, size: 120, offset: 24 },
  server: { r: 86, size: 120, offset: 24 },
  cloud: { r: 86, size: 200, offset: 24,sizeC:200 }
};

// 展开收缩状态维护
class TopologyExpandStatus {
  constructor() {
    let str = '';
    try {
      str = window.localStorage.getItem('topologyExpandStatus');
    } catch (e) {
      // console.error(e);
    }
    this.status = JSON.parse(str || '{"machine":{},"group":{}}');
    // 初始进来时不记住分组的状态
    this.status.group = {};
  }
  set(resource, id, val) {
    this.status[resource][id] = val;
    try {
      window.localStorage.setItem(
        'topologyExpandStatus',
        JSON.stringify(this.status),
      );
    } catch (e) {
      // console.error(e);
    }
  }
  get(resource, id) {
    const val = this.status[resource][id];
    // 服务器默认展开，分组默认折叠
    return val === undefined ? (resource === 'machine') : val;
  }
  toggle(resource, id) {
    const val = this.get(resource, id);
    this.set(resource, id, !val);
  }
  clear(machines, groups) {
    [
      { resource: 'machine', ids: machines.map(m => m.id) },
      { resource: 'group', ids: groups.map(m => m.id) },
    ].forEach(({ resource, ids }) => {
      Object.keys(this.status[resource]).forEach((key) => {
        if (!ids.includes(key)) {
          this.set(resource, key, undefined);
        }
      });
    });
  }
}

export const tes = new TopologyExpandStatus();

function uniquifyId(machines) {
  return machines.map(machine => Object.assign({}, machine, {
    id: `${machine.id}`,
    components: machine.components.map(component => Object.assign({}, component, {
      id: `${component.id}`,
    })),
  }));
}

// 计算服务器与组件们整体的半径
function getMachineR(machine) {
  if (!tes.get('machine', machine.id)) {
    return SIZE.machine.r;
  }
  // 服务器中点到组件中点的距离
  const d = Math.max(
    SIZE.machine.r + SIZE.component.r,
    SIZE.component.r * machine.components.length / Math.PI,
  );
  // 服务器和组件们整体的半径
  return d + SIZE.component.r;
}

function getNode(resource) {
  return node => ({
    _: node,
    id: node.id,
    name: node.name,
    resource,
    r: resource === 'machine' ? getMachineR(node) : SIZE[resource].r,
    symbolSize:  (vm.$route.path == '/visual/cloud') ? (SIZE[resource].sizeC || SIZE[resource].size) : SIZE[resource].size ,
  });
}

function getLink(source, target) {
  return {
    source: source.id,
    target: target.id,
  };
}

// 获取服务器和分组的 nodes、links
function getGraph({ machines, groups }) {
  return [].concat(
    ...groups.map((group) => {
      // 当前分组下的服务器
      const ms = machines.filter(machine => machine.group.id === group.id);
      const isRoot = group.id === ROOT_GROUP_ID;
      // 当前分组是否展开
      const isExpand = isRoot || tes.get('group', group.id);
      // 根分组用中心服务器代替
      const center = isRoot ? machines.find(machine => machine.isCenter) : group;
      return [
        {
          nodes: [
            // 分组本身
            ...isRoot ? [] : [getNode('group')(group)],
            // 分组下的服务器
            ...isExpand ? ms.map(getNode('machine')) : [],
          ],
          links: [
            // 分组到子分组
            ...isExpand ? group.groups.map(g => getLink(center, g)) : [],
            // 分组到服务器
            ...isExpand ? ms.filter(m => !m.isCenter).map(m => getLink(center, m)) : [],
          ],
        },
        // 子分组
        ...isExpand ? getGraph({ machines, groups: group.groups }) : [],
      ];
    }),
  );
}

let simulation = forceSimulation();

// 力布局算法
function force({ nodes, links }, point = { id: '', x: 0, y: 0 }) {
  return new Promise((resolve) => {
    // 上次力布局已存在的点
    const snodes = simulation.nodes();
    nodes.forEach((node) => {
      Object.assign(node, { fx: null, fy: null });
      const snode = snodes.find(sn => sn.id === node.id);
      if (snode) {
        // 已存在的点从自己所在位置开始力布局
        const { index, x, y, vx, vy } = snode;
        Object.assign(node, { index, x, y, vx, vy });
      } else if (point.id) {
        // 新增的点从被点击的地方开始力布局
        Object.assign(node, { x: point.x, y: point.y });
      }
      // 中心固定在坐标 (0, 0) 上
      if (node._.isCenter) {
        Object.assign(node, { fx: 0, fy: 0 });
      }
      // 触发此次力布局的分组节点固定在原位置
      if (node.id === point.id && point.resource === 'group') {
        Object.assign(node, { fx: point.x, fy: point.y });
      }
    });
    simulation = forceSimulation(nodes)
      .alphaMin(0.5)
      .force('x', forceX())
      .force('y', forceY())
      .force('collide', forceCollide().radius(d => d.r + 130))
      .on('end', () => resolve({ nodes, links }));
  });
}

// 加上组件的 nodes、links
function addGraphOfComponent({ nodes, links }) {
  const machines = nodes
    .filter(({ resource }) => resource === 'machine')
    .filter(({ id }) => tes.get('machine', id));
  return {
    nodes: nodes.concat(
      ...machines.map(machine => (
        machine._.components.map((component, idx) => {
      //wangjing9 备注多云的resource为cloud
		  let childTips = 'component';
		  if (machine.name == '运维平台') {
			childTips = 'cloud';
		  }
          const deg = Math.PI * (0.5 - 2 * idx / machine._.components.length);
          const delta = (vm.$route.path == '/visual/cloud') ? 800 : (machine.r - SIZE.component.r);

          return Object.assign(getNode(childTips)(component), {
            x: machine.x + delta * Math.sin(deg),
            y: machine.y + delta * Math.cos(deg),
          });
        })
      )),
    ),
    links: links.concat(
      ...machines.map(machine => (
        machine._.components.map(component => getLink(machine, component))
      )),
    ),
  };
}

/*// 加上组件的 nodes、links
function addGraphOfComponent({ nodes, links }) {
  const machines = nodes
    .filter(({ resource }) => resource === 'machine')
    .filter(({ id }) => tes.get('machine', id));

  let defComponent = null,linksResult=[];

  machines.forEach(function(machine){
    if (machine.id == 'virIp')
      defComponent = machine._.components[machine._.components.length - 1];
  });

  //wangjing修改存储节点和管理节点的展示

  linksResult = links.concat(
    ...machines.map(machine => (
      machine._.components.map((component) => {
        if (component.resource == 'server') {
          let r = getLink(defComponent || component,component);
          defComponent = component;
          return r;
        } else {
          return getLink(machine, component);
        }
      })
    ))
  );

  machines.forEach(function(machine){
    if (machine.id == 'virIp') {
      machine._.components.forEach(function (v) {
        linksResult.push({
          source: v.id,
          target: defComponent ? defComponent.id : null,
        });
        defComponent = v;
      });
    }
  });

  return {
    nodes: nodes.concat(
      ...machines.map(machine => (
        machine._.components.map((component, idx) => {
          const deg = Math.PI * (0.5 - 2 * idx / machine._.components.length);
          const delta = machine.r - SIZE.component.r;

          return Object.assign(getNode(component.resource || 'component')(component), {
            x: machine.x + delta * Math.sin(deg),
            y: machine.y + delta * Math.cos(deg),
          });
        })
      )),
    ),
    links:linksResult
    /!**!/
  };
}*/

// 调整图标显示位置
function adjustPosition(nodes) {
  return nodes.map(node => Object.assign(node, {
    y: node.y + SIZE[node.resource].offset,
  }));
}

export const LEVEL_COLOR = {
  critical: {
    background: 'rgba(196,54,52,0.9)',
    border: 'rgba(236,61,59,0.9)',
    effect: 'rgba(255,16,16,0.4)',
  },
  general: {
    background: 'rgba(207,98,45,0.9)',
    border: 'rgba(255,99,22,0.9)',
    effect: 'rgba(255,99,22,0.4)',
  },
  warning: {
    background: 'rgba(210,127,20,0.9)',
    border: 'rgba(255,154,24,0.9)',
    effect: 'rgba(255,154,24,0.4)',
  },
  normal: {
    background: '#434343',
    border: 'rgba(255,255,255,0.2)',
  },
  center: {
    background: '#2c3c3d',
    border: 'rgba(114,246,255,0.2)',
  },
};

function addNodeStyle({ nodes }, alertStatus) {

  util.hideMask();

  let len = nodes.length;

  return nodes.map((node) => {
    const { resource } = node;
    const { isCenter } = node._;

    const alert = alertStatus.resources.find(res => (
        res.id === node.id && res.resource === resource
      )) || {};

    const level = ['critical', 'general', 'warning'].find(l => alert[l]) || 'normal';

    return Object.assign(node, {
      level,
      showEffect: level !== 'normal',
      symbol: `image:///static/img/${legend[isCenter ? 'center' : resource][level]}`,
      label: {
        //云图超过20个不显示title，悬浮显示
        show:(node.resource == 'cloud' && len > 20) ? false : true,
        position: 'bottom',
        distance: 0,
        align: 'center',
        fontSize: 14,
        backgroundColor: (isCenter && level === 'normal')
          ? LEVEL_COLOR.center.background
          : LEVEL_COLOR[level].background,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: (isCenter && level === 'normal')
          ? LEVEL_COLOR.center.border
          : LEVEL_COLOR[level].border,
        formatter({ data: [,, data] }) {
          return ({
            machine: (function(){
              if (data._.id == 'clouds') {
                return `{server|${vm.$t('visual.net.title1')}}`;
              }
              if (data._.isCenter) {
                let ipTxt = vm.$t('visual.net.title2');

                if (data._.mode == 'single') {
                  ipTxt = '单机';
                }

                return  `{server|${ipTxt}}\n{ip|${data._.ip}}`;
              } else {
                let ipTxt = vm.$t('visual.net.title3');
                return `{server|${ipTxt}}\n{ip|${data._.name}}`;
              }
            })(),
            component: `{small|${data.name}}`,
            group: `{server|${data.name}}`,
            server: `{small|${data.name}}`,
            cloud: `{small|${data.name}}`
          })[resource];
        },
        rich: {
          server: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
            padding: [10, 16],
          },
          ip: {
            color: '#fff',
            lineHeight: 18,
            verticalAlign: 'bottom',
            padding: [10, 16],
          },
          small: {
            color: 'rgba(255,255,255,0.6)',
            padding: [7, 8]
          }
        }
      },
    });
  });
}

function addLinkStyle({ nodes, links }) {
  return links.map((link) => {
    const target= nodes.find(node => node.id === (link.source.id || link.source));
    const source = nodes.find(node => node.id === (link.target.id || link.target));
    const hasComponent = (
      source.resource === 'component' ||
      target.resource === 'component' ||
      source.resource === 'cloud' ||
      target.resource === 'cloud'
    );
    const isDisconnected = (
      source._.state === 'offline' ||
      target._.state === 'offline'
    );

    return Object.assign(link, {
      showEffect: !hasComponent && !isDisconnected,
      coords: [
        [source.x, source.y],
        [target.x, target.y],
      ],
      lineStyle: {
        ...(isDisconnected ? { color: 'rgba(211,19,15,1)' } : {color: 'rgba(187,187,187,.5)'}),
        type: isDisconnected ? 'dashed' : 'solid',
        width: hasComponent ? 2 : 3
      },
    });
  });
}

export function getTopology({ machines, groups }, alertStatus, point) {
  const graph = getGraph({ machines: uniquifyId(machines), groups })
    .reduce((prev, curr) => ({
      nodes: [...prev.nodes, ...curr.nodes],
      links: [...prev.links, ...curr.links],
    }), { nodes: [], links: [] });

  return force(graph, point)
    .then(addGraphOfComponent)
    .then(({ nodes, links }) => ({
      nodes: adjustPosition(nodes),
      links,
    }))
    .then(({ nodes, links }) => ({
      nodes: addNodeStyle({ nodes }, alertStatus),
      links: addLinkStyle({ nodes, links }),
    }));
}
