<template>
  <div>
    <div class='nav'>
      <router-link to='/home'>首页</router-link>
      <router-link to='/about'>关于</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import Home from '@/components/Home.vue'

export default {
  name: "app",
  data() {
    return {

    }
  }
}
</script>

<style>
.nav {
  text-align: center;
}
.nav a {
  margin: 0 12px;
}
</style>
