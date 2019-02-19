const daySecond = 86400
const numToDouble = value => value < 10 ? '0' + value : value

export const pixelToSecond = (value, totalPixel) => value * daySecond / totalPixel
export const secondToPixel = (value, totalPixel) => value * totalPixel / daySecond
export const timeFormat = value => {
  const hour = numToDouble(parseInt(value / 3600, 10))
  const min = numToDouble(parseInt(value % 3600 / 60, 10))
  return hour + ':' + min
}

export const timeToSecond = value => {
  const times = value.split(':')
  return parseInt(times[0], 10) * 3600 + parseInt(times[1], 10) * 60
}
