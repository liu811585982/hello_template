describe('helloworld test', () => {
  const wrapper = shallow(HelloWorld, {
    localVue,
    i18n,
    propsData: {
      name: 'john'
    }
  })

  it('hello world', async () => {
    expect(wrapper.text()).to.include('john，欢迎使用dolphin App')
  })
})
