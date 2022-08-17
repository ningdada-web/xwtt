<template>
  <div>
    <van-nav-bar
      title="历史记录"
      left-arrow
      @click-left="$router.go(-1)"
      fixed
    />
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
    >
      <article-item
        v-for="item in historyList"
        :key="item.art_id"
        :artObj="item"
        :isShow="false"
        @click.native="detailFn(item.art_id)"
      ></article-item>
    </van-list>
  </div>
</template>

<script>
import ArticleItem from '../../components/Articleitem.vue';
import { historyApi } from '../../api/api';

export default {

  name: 'history',
  components: {
    ArticleItem
  },
  // eslint-disable-next-line space-before-function-paren
  data () {
    return {
      page: 1,
      historyList: [],
      loading: false,
      finished: false
    };
  },
  // eslint-disable-next-line space-before-function-paren
  async created () {
    const res = await historyApi({
      page: this.page,
      pageNum: 2000
    });
    this.historyList = res.data.data.results;
    console.log(this.historyList);
  },
  methods: {

    // eslint-disable-next-line space-before-function-paren
    async onLoad () {
      if (this.historyList.length > 0) {
        this.page++;
        const res = await historyApi({
          page: this.page,
          pageNum: 2000

        });

        if (res.data.data.results.length === 0) { // 如果返回的数据为零，结束加载
          this.finished = true;
        }
        this.historyList = [...this.historyList, ...res.data.data.results];
        this.loading = false;
      }
    },
    // eslint-disable-next-line space-before-function-paren
    detailFn (id) {
      this.$router.push({ // 跳转文章详情页
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

<style scoped lang='less'>
.van-list {
  padding-top: 46px;
}
/deep/.van-nav-bar .van-icon {
  color: #fff;
}
</style>
