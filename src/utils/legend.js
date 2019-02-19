const svgServer = 'legend/svg/server.svg';
const svgServerCritical = 'legend/svg/server_critical.svg';
const svgServerGeneral = 'legend/svg/server_general.svg';
const svgServerWarning = 'legend/svg/server_warning.svg';
const svgServerSmall = 'legend/svg/server_small.svg';
// const svgServerSmallCritical = '../../legend/svg/server_small_critical.svg';
// const svgServerSmallGeneral = '../../legend/svg/server_small_general.svg';
// const svgServerSmallWarning = '../../legend/svg/server_small_warning.svg';
const svgServerCenter = 'legend/svg/server_center.svg';
const svgServerCenterCritical = 'legend/svg/server_center_critical.svg';
const svgServerCenterGeneral = 'legend/svg/server_center_general.svg';
const svgServerCenterWarning = 'legend/svg/server_center_warning.svg';
const svgComponent = 'legend/svg/component.svg';
const svgComponentCritical = 'legend/svg/component_critical.svg';
const svgComponentGeneral = 'legend/svg/component_general.svg';
const svgComponentWarning = 'legend/svg/component_warning.svg';
const svgGroup = 'legend/svg/group.svg';
// const svgGroupCritical = '../../legend/svg/group_critical.svg';
// const svgGroupGeneral = '../../legend/svg/group_general.svg';
// const svgGroupWarning = '../../legend/svg/group_warning.svg';
const pngServer = 'legend/png/server.png';
const pngServerCritical = 'legend/png/server_critical.png';
const pngServerGeneral = 'legend/png/server_general.png';
const pngServerWarning = 'legend/png/server_warning.png';
const pngServerCenter = 'legend/png/server_center.png';
const pngServerSmall = 'legend/png/server_small.png';
const pngServerSmallCritical = 'legend/png/server_small_critical.png';
const pngServerSmallGeneral = 'legend/png/server_small_general.png';
const pngServerSmallWarning = 'legend/png/server_small_warning.png';
const pngServerCenterCritical = 'legend/png/server_center_critical.png';
const pngServerCenterGeneral = 'legend/png/server_center_general.png';
const pngServerCenterWarning = 'legend/png/server_center_warning.png';
const pngComponent = 'legend/png/component.png';
const pngComponentCritical = 'legend/png/component_critical.png';
const pngComponentGeneral = 'legend/png/component_general.png';
const pngComponentWarning = 'legend/png/component_warning.png';
const pngGroup = 'legend/png/group.png';
const pngGroupCritical = 'legend/png/group_critical.png';
const pngGroupGeneral = 'legend/png/group_general.png';
const pngGroupWarning = 'legend/png/group_warning.png';
const pngAlarmCritical = 'alarm_critical.png';
const pngAlarmGeneral = 'alarm_general.png';
const pngAlarmWarning = 'alarm_warning.png';

const pngCloud = 'legend/png/server_small.png';
const pngCloudCritical = 'legend/png/server_small_critical.png';
const pngCloudGeneral = 'legend/png/server_small_general.png';
const pngCloudWarning = 'legend/png/server_small_warning.png';

const { isIE } = 'index@/utils/util.js';

const svgLegend = {
  server: {
    normal: pngServer,
    critical: pngServerCritical,
    general: pngServerGeneral,
    warning: pngServerWarning,
  },
  cloud: {
    normal: pngCloud,
    critical: pngCloudCritical,
    general: pngCloudGeneral,
    warning: pngCloudWarning
  },
  serverSmall: {
    normal: pngServerSmall,
    // critical: svgServerSmallCritical,
    // general: svgServerSmallGeneral,
    // warning: svgServerSmallWarning,
    critical: pngServerSmallCritical,
    general: pngServerSmallGeneral,
    warning: pngServerSmallWarning,
  },
  center: {
    normal: pngGroup,
    // critical: svgGroupCritical,
    // general: svgGroupGeneral,
    // warning: svgGroupWarning,
    critical: pngGroupCritical,
    general: pngGroupGeneral,
    warning: pngGroupWarning,
  },
  component: {
    normal: pngServerSmall,
    // critical: svgServerSmallCritical,
    // general: svgServerSmallGeneral,
    // warning: svgServerSmallWarning,
    critical: pngServerSmallCritical,
    general: pngServerSmallGeneral,
    warning: pngServerSmallWarning,
  },
  group: {
    normal: pngGroup,
    // critical: svgGroupCritical,
    // general: svgGroupGeneral,
    // warning: svgGroupWarning,
    critical: pngGroupCritical,
    general: pngGroupGeneral,
    warning: pngGroupWarning,
  },
  alarm: {
    normal: '',
    critical: pngAlarmCritical,
    general: pngAlarmGeneral,
    warning: pngAlarmWarning,
  },
};

const pngLegend = {
  server: {
    normal: pngServer,
    critical: pngServerCritical,
    general: pngServerGeneral,
    warning: pngServerWarning,
  },
  serverSmall: {
    normal: pngServerSmall,
    critical: pngServerSmallCritical,
    general: pngServerSmallGeneral,
    warning: pngServerSmallWarning,
  },
  center: {
    normal: pngGroup,
    critical: pngGroupCritical,
    general: pngGroupGeneral,
    warning: pngGroupWarning
  },
  component: {
    normal: pngComponent,
    critical: pngComponentCritical,
    general: pngComponentGeneral,
    warning: pngComponentWarning,
  },
  group: {
    normal: pngGroup,
    critical: pngGroupCritical,
    general: pngGroupGeneral,
    warning: pngGroupWarning
  },
  alarm: {
    normal: '',
    critical: pngAlarmCritical,
    general: pngAlarmGeneral,
    warning: pngAlarmWarning,
  },
};

export const legend = Object.assign(
  {
    alarmColor: {
      normal: '#7ff',
      critical: '#fe5332',
      general: '#ff952c',
      warning: '#ffcc00',
    },
  },
  isIE ? pngLegend : svgLegend,
);
Object.assign(legend, { machine: legend.server });
