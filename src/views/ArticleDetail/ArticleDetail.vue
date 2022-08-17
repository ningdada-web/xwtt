<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ detailList.title }}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="detailList.aut_name" :label="detailList.pubdate">
        <template #icon>
          <img :src="detailList.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <van-button
              type="info"
              size="mini"
              v-if="detailList.is_followed"
              @click="followFn(true)"
              >已关注</van-button
            >
            <van-button
              icon="plus"
              type="info"
              size="mini"
              plain
              v-if="!detailList.is_followed"
              @click="followFn(false)"
              >关注</van-button
            >
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="detailList.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button
          icon="good-job"
          type="danger"
          size="small"
          v-if="detailList.attitude === 1"
          @click="attitudeFn(true)"
          >已点赞</van-button
        >
        <van-button
          icon="good-job-o"
          type="danger"
          plain
          size="small"
          v-else
          @click="attitudeFn(false)"
          >点赞</van-button
        >
      </div>
    </div>
    <CommonLIst></CommonLIst>
  </div>
</template>

<script>
import { getArtDetailApi, followApi, unFollowApi, dislikeApi, likeApi } from '../../api/api';
import CommonLIst from './CommonLIst.vue';

export default {
  // eslint-disable-next-line space-before-function-paren
  data () {
    return {
      detailList: {}
    };
  },
  components: {
    CommonLIst
  },
  // eslint-disable-next-line space-before-function-paren
  async created () {
    const res = await getArtDetailApi({
      Id: this.$route.query.typeId
    });
    this.detailList = res.data.data;
  },
  methods: {
    // eslint-disable-next-line space-before-function-paren
    async followFn (bool) {
      if (bool) {
        // 点已关注
        // 返回关注按钮
        // 取关
        this.detailList.is_followed = false;
        await unFollowApi({
          target: this.detailList.aut_id
        });
      } else {
        // 点关注
        // 返回已关注按钮
        // 关注
        this.detailList.is_followed = true;
        await followApi({
          id: this.detailList.aut_id
        });
      }
      console.log(this.detailList.is_followed);
    },
    // eslint-disable-next-line space-before-function-paren
    async attitudeFn (bool) {
      if (bool) {
        // 点已点赞
        // 返回点赞按钮
        // 取点赞
        this.detailList.attitude = 0;
        await dislikeApi({
          target: this.detailList.art_id
        });
      } else {
        // 点点赞
        // 返回已点赞按钮
        // 点赞
        this.detailList.attitude = 1;
        await likeApi({
          id: this.detailList.art_id
        });
      }
      console.log(this.detailList.attitude);
    }
  }

};
</script>

<style scoped lang="less">
/deep/.van-nav-bar .van-icon {
  color: #fff;
}
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
</style>
