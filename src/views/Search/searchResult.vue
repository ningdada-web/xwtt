<!-- eslint-disable camelcase -->
<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
    </div>
    <!-- 文章列表 -->
    <div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <Article-item
          v-for="item in resultList"
          :key="item.art_id"
          :artObj="item"
          :isShow="false"
          @click.native="detailFn(item.art_id)"
        ></Article-item>
      </van-list>
    </div>
  </div>
</template>

<script >
import { getSearchResApi } from '../../api/api';
import ArticleItem from '../../components/Articleitem.vue';
export default {
  name: 'SearchResult',
  // eslint-disable-next-line space-before-function-paren
  data () {
    return {
      page: 1,
      resultList: [],
      loading: false,
      finished: false

    };
  },
  components: {
    ArticleItem
  },
  // eslint-disable-next-line space-before-function-paren
  async created () {
    const res = await getSearchResApi({
      page: this.page,
      pageNum: 2000,
      keyword: this.$route.params.kw
    });
    this.resultList = res.data.data.results;
  },
  methods: {
    // eslint-disable-next-line space-before-function-paren
    async onLoad () {
      if (this.resultList.length > 0) {
        this.page++;
        const res = await getSearchResApi({
          page: this.page,
          pageNum: 2000,
          keyword: this.$route.params.kw
        });

        if (res.data.data.results.length === 0) { // 如果返回的数据为零，结束加载
          this.finished = true;
        }
        this.resultList = [...this.resultList, ...res.data.data.results];
        this.loading = false;
      }
    },
    // eslint-disable-next-line space-before-function-paren, camelcase
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

</script >

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
/deep/.van-nav-bar .van-icon {
  color: #fff;
}
</style>
