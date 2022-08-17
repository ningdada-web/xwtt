<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <ArticleItem
          v-for="item in ArticleList"
          :key="item.art_id"
          :artObj="item"
          @dislikeArt="dislikeFn"
          @report="reportFn"
          @click.native="detailFn(item.art_id)"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '../../components/Articleitem.vue';
import { getArticleListApi, articleDislikeApi, articleReportApi } from '../../api/api';
import { Notify } from 'vant';
export default {
  name: 'ArticleList',
  // eslint-disable-next-line space-before-function-paren
  data () {
    return {
      ArticleList: [], // 列表数据
      loading: false,
      finished: false,
      theTime: new Date().getTime(), // 默认当前页时间戳
      isLoading: false
    };
  },
  props: {
    channelID: Number
  },
  components: {
    ArticleItem
  },
  // eslint-disable-next-line space-before-function-paren
  // async created () {
  //   const res = await getArticleListApi({ // 接口数据
  //     channel_id: this.channelID,
  //     timestamp: this.theTime
  //   });
  //   this.ArticleList = res.data.data.results;
  //   this.theTime = res.data.data.pre_timestamp;
  //   console.log(res);
  // },
  methods: {

    // 底部加载事件
    // eslint-disable-next-line space-before-function-paren
    async onLoad () { // 上拉加载
      const res2 = await getArticleListApi({
        channel_id: this.channelID,
        timestamp: this.theTime

      });
      if (
        res2.data.data.pre_timestamp === null
      ) {
        this.finished = true;
        return;
      }
      this.ArticleList = [...this.ArticleList, ...res2.data.data.results];
      this.theTime = res2.data.data.pre_timestamp;
      console.log(res2);
      this.loading = false;
    },
    // eslint-disable-next-line space-before-function-paren
    async onRefresh () { // 下拉刷新
      this.ArticleList = [];
      this.theTime = new Date().getTime();
      const res3 = await getArticleListApi({ // 获取文章数据
        channel_id: this.channelID,
        timestamp: this.theTime

      });
      this.ArticleList = [...this.ArticleList, ...res3.data.data.results];
      this.theTime = res3.data.data.pre_timestamp;
      this.isLoading = false;
    },
    // eslint-disable-next-line space-before-function-paren
    async dislikeFn (id) { // 不喜欢的接口
      console.log(id, typeof id);
      await articleDislikeApi({
        artId: id
      });
      Notify({ type: 'success', message: '反馈成功' });
    },
    // eslint-disable-next-line space-before-function-paren
    async reportFn (id, type) { // 举报的接口
      // type = type.toString();
      console.log(typeof id, typeof type);
      await articleReportApi({
        artId: id,
        type: type
      });
      Notify({ type: 'success', message: '二级反馈成功' });
    },
    // eslint-disable-next-line space-before-function-paren, camelcase
    detailFn (id) {
      this.$router.push({
        // eslint-disable-next-line camelcase
        path: '/articleDetail',
        query: {
          typeId: id
        }
      });
    }
  }
};

</script>

<style scoped>
</style>
