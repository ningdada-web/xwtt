<template>
  <div>
    <!-- 评论列表 -->
    <div
      class="cmt-list"
      :class="comIsShow ? 'art-cmt-container-2' : 'art-cmt-container-1'"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        :loading="loading"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="(item, index) in commentList" :key="index">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="item.aut_photo" alt="" class="avatar" />
              <span class="uname">{{ item.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <span class="like-count">{{ item.like_count }}</span>
              <van-icon
                name="like"
                size="16"
                color="red"
                v-if="item.is_liking"
                @click="likeFn(true, item)"
              />
              <van-icon
                name="like-o"
                size="16"
                color="gray"
                v-else
                @click="likeFn(false, item)"
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{ item.content }}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ item.pubdate }}</div>
        </div>
      </van-list>
    </div>
    <!-- 发表评论区域 -->
    <div>
      <!-- 底部添加评论区域 - 1 -->
      <div class="add-cmt-box van-hairline--top" v-if="comIsShow">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="changeShow">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totalCount === 0 ? '' : totalCount" max="99">
            <van-icon
              name="comment-o"
              size="0.53333334rem"
              @click="comClickFn"
            />
          </van-badge>
          <van-icon name="star-o" size="0.53333334rem" />
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>

      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea
          placeholder="友善评论、理性发言、阳光心灵"
          v-fofo
          @blur="blurFn"
          v-model.trim="textData"
        ></textarea>
        <van-button
          type="default"
          :disabled="textData.length === 0"
          @click="postFn"
          >发布</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { commentApi, comLikeApi, comDislikeApi, addDetailApi } from '../../api/api';

export default {
  // eslint-disable-next-line space-before-function-paren
  data () {
    return {
      commentList: [], // 评论列表
      comIsShow: true,
      textData: '',
      totalCount: '0',
      loading: false,
      finished: false,
      lastID: ''
    };
  },

  // eslint-disable-next-line space-before-function-paren
  async created () {
    const res2 = await commentApi({ // 获取评论列表
      id: this.$route.query.typeId
    });

    this.commentList = res2.data.data.results;
    this.totalCount = res2.data.data.total_count;
    this.lastID = res2.data.data.last_id;
  },
  methods: {
    // eslint-disable-next-line space-before-function-paren
    async likeFn (bool, item) { // 喜欢与不喜欢
      if (bool) {
        // 点已喜欢
        // 返回喜欢按钮
        // 取喜欢
        item.is_liking = false;
        await comDislikeApi({
          target: item.com_id
        });
      } else {
        // 点喜欢
        // 返回已喜欢按钮
        // 喜欢
        item.is_liking = true;
        await comLikeApi({
          id: item.com_id
        });
      }
    },
    // eslint-disable-next-line space-before-function-paren
    changeShow () { //
      this.comIsShow = false;
    },
    // eslint-disable-next-line space-before-function-paren
    async postFn () { // 发布按钮点击事件
      console.log(this.textData);
      const res = await addDetailApi({
        id: this.$route.query.typeId,
        content: this.textData
      });
      console.log(res);
      this.commentList.push(res.data.data.new_obj);
      const res2 = await commentApi({ // 获取评论列表,再调用一次，刷新数据
        id: this.$route.query.typeId
      });
      this.commentList = res2.data.data.results;
      this.totalCount = res2.data.data.total_count;
      this.comClickFn();
      this.textData = '';
    },
    // eslint-disable-next-line space-before-function-paren
    comClickFn () { // 滑动到评论第一条，置于顶端
      // 获取文章信息区域高度，html已铺满，js可以直接获取标签
      const articleHeight = document.querySelector('.article-container').scrollHeight;
      console.log(articleHeight);
      window.scrollTo({ top: articleHeight, behavior: 'smooth' });
    },
    // eslint-disable-next-line space-before-function-paren
    blurFn () { // 输入框-失去焦点
      setTimeout(() => { // 宏任务与微任务： 使用定时器延时销毁输入框，让发布按钮及时传值，由于v-if与v-else的特性，失去焦点瞬间销毁
        this.comIsShow = true;
      }, 0);
    },
    // eslint-disable-next-line space-before-function-paren
    async onLoad () {
      // 滑动到底部，请求新的数据
      if (this.commentList.length > 0) {
        const res = await commentApi({
          id: this.$route.query.typeId,
          offset: this.lastID
        });
        this.commentList = [...this.commentList, ...res.data.data.results];
        this.totalCount = res.data.data.total_count;
        this.lastID = res.data.data.last_id;
        if (res.data.data.last_id === null) {
          this.finished = true;
        }
        this.loading = false;
      } else {
        this.loading = false;
      }
    }
  }

};

</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-right {
        .like-count {
          font-size: 11px;
        }
      }
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 70px;
}
.art-cmt-container-2 {
  padding-bottom: 50px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
