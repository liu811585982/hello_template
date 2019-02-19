<template>
  <tool-tip class="item" effect="dark" :content="content" :placement="placement || 'top'" :enterable="false">
    <slot></slot>
  </tool-tip>
</template>

<script>
  import { Tooltip } from 'hui';
  export default {
    props:['content','placement'],
    components: {
      'tool-tip': Tooltip
    }
  }
</script>
