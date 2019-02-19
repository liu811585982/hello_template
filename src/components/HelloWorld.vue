<template>
  <div class="page-card hello full">
    <img class="logo-large" src="../assets/logo-large.png">

    <h1>{{$t('hello.dolphin', {name})}}</h1>

    <h2 class="theme-test">{{$t('hello.developBefore')}}</h2>

    <p>
      <a href="https://wiki.hikvision.com.cn/pages/viewpage.action?pageId=46821263" target="blank">{{$t('hello.dolphinDevelopGuide')}}</a>
    </p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    name: {
      type: String,
      default: 'hello'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
    margin: 10px 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .hello{
    text-align: center;
    padding-top: 50px;
  }

  .logo-large{
    width: 200px
  }
</style>
