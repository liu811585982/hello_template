export default {
  name: 'renderComponent',
  render (h) {
    return h(this.tagName, {
      'style': this.styles,
      'class': this.classes,
      on: {
        click (event) {
          console.log(123)
        }
      }
    }, this.$slots.default)
  },
  props: {
    tagName: {
      required: true,
      type: String
    },
    classes: String | Array | Object,
    styles: Object
  }
}
