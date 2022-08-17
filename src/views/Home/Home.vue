<template>
  <div class="home">
    <!-- 导航图片，搜索按钮 -->
    <van-nav-bar fixed>
      <template #left>
        <img class="logo" src="../../assets/R-C.jpg" alt="" />
      </template>
      <template #right>
        <van-icon name="search" size="18" color="#fff" @click="search" />
      </template>
    </van-nav-bar>
    <!-- 频道标签 -->
    <!-- vant-tab循环了很多导航标签，与之一一对应的不是一上来就全部创建，而是第一次点击后，切换对应频道才会创建list -->
    <div class="tabs">
      <van-tabs sticky offset-top="1.226667rem" animated v-model="channelID">
        <van-tab
          v-for="item in userChannels"
          :title="item.name"
          :key="item.id"
          :name="item.id"
        >
          <article-list :channelID="channelID"></article-list>
        </van-tab>
      </van-tabs>
      <!-- 编辑频道图标 -->
      <van-icon
        is-link
        @click="showPopup"
        name="plus"
        size="0.37333334rem"
        class="moreChannels"
      />
    </div>
    <van-popup
      v-model="show"
      :style="{ height: '100%', width: '100%' }"
      get-container="body"
    >
      <channelsEdit
        @close="closeFn"
        :userChannels="userChannels"
        :unCheckChannels="unCheckChannels"
        @moreObj="moreFn"
        ref="edit"
        v-model="channelID"
      ></channelsEdit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannelsApi, getChannelsApi, refreshChannelsApi } from '../../api/api';
import ArticleList from './ArticleList.vue';
import channelsEdit from './channelsEdit.vue';
export default {
  name: 'Home',
  data: function () {
    return {
      userChannels: [], // 频道数据
      allChannels: [], // 所有频道数据
      channelID: 0, // 默认频道id为0
      show: false// 频道弹出默认关闭
    };
  },
  components: {
    ArticleList,
    channelsEdit
  },
  // eslint-disable-next-line space-before-function-paren
  async created () {
    const res = await getUserChannelsApi();// 用户频道数据

    this.userChannels = res.data.data.channels;
    console.log(this.userChannels, 'user');
    // this.changeChannels();

    const res2 = await getChannelsApi();
    this.allChannels = res2.data.data.channels;
    console.log(this.allChannels, 'all');
  },
  methods: {
    // eslint-disable-next-line space-before-function-paren
    showPopup () {
      this.show = true;
    },
    // eslint-disable-next-line space-before-function-paren
    async moreFn (channelObj) {
      console.log(channelObj, 'chanobj'); // 增加频道
      const newArr = this.userChannels.push(channelObj);// 计算属性是同步的，不需要对allChannels进行移除
      // const newArr = this.userChannels.filter(obj => obj.id !== 0); // 推荐栏不允许更改
      console.log(newArr, 'newarr');
      const newArrObj = Array.from(newArr);
      const theNew = newArrObj.map((obj, index) => {
        const newObj = { ...obj }; // 浅拷贝
        delete newObj.name;
        newObj.seq = index;
        return newObj;
      });
      // newArr.forEach((obj, index) => {
      //   delete obj.name;// 剔除name，无关接口元素
      //   obj.seq = index;// 给seq赋值
      // });// forEach深拷贝，将name给删除了，使用浅拷贝进行复制后删除，不改变userChannels
      const res = await refreshChannelsApi({
        channels: theNew
      });
      console.log(res, 'res');
    },
    // eslint-disable-next-line space-before-function-paren
    // async removeFn (channelsObj) {// 删除频道
    //   const index = this.userChannels.findIndex(obj => obj.id === channelsObj.id);
    //   this.userChannels.splice(index, 1);
    //   const res = await removeUserChannelsApi({
    //     channelID: channelsObj.id
    //   });
    //   console.log(res);
    // }
    // eslint-disable-next-line space-before-function-paren
    closeFn () { // 关闭蒙板
      this.show = false;
      this.$refs.edit.isShow = false;
    },
    // eslint-disable-next-line space-before-function-paren
    search () {
      this.$router.push('/search');
    }
  },
  computed: {
    // eslint-disable-next-line space-before-function-paren
    unCheckChannels () { // 未选的频道
      const newArr = this.allChannels.filter(allObj => {
        const index = this.userChannels.findIndex(userObj => {
          return allObj.id === userObj.id;
        });
        if (index > -1) { // 如果找到了，退出filter
          return false;
        } else {
          return true;
        }
      });
      return newArr;
    }
  }
};

</script>
<style scoped lang='less'>
html {
  height: 2000px;
}
.logo {
  width: 30px;
  height: 30px;
}
.tabs {
  padding-top: 46px;
}
// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
</style>
