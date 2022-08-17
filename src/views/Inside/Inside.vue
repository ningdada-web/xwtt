<template>
  <div>
    <div class="home_container">
      <router-view></router-view>
    </div>
    <van-tabbar v-model="active" route>
      <van-tabbar-item replace icon="home-o" to="/inside/home"
        >主页</van-tabbar-item
      >
      <van-tabbar-item replace icon="setting-o" to="/inside/user"
        >个人</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Inside',
  // eslint-disable-next-line space-before-function-paren
  data () {
    return {
      active: 0
    };
  },
  methods: {}
};
</script>

<style scoped>
.home_container {
  padding-bottom: 50px;
}
.van-tabbar {
  border-top: 1px solid #f8f8f8;
}
</style>
