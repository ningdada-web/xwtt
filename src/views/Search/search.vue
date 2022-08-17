<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        v-model.trim="kw"
        v-fofo
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        @input="inputFn"
        @search="searchFn"
      />
    </div>
    <!-- 联想内容 -->
    <div class="sugg-list">
      <div
        class="sugg-item"
        v-for="(item, index) in suggestList"
        :key="index"
        v-html="lightItem(item, kw)"
        @click="suggestFn(item)"
      ></div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-show="suggestList.length === 0">
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearFn" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(obj, index) in history"
          :key="index"
          @click="historyFn(obj)"
          >{{ obj }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getSuggestApi } from '../../api/api';

export default {
  name: 'Search',
  // eslint-disable-next-line space-before-function-paren
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null, // 防抖的定时器
      suggestList: [], // 联想搜索内容
      history: JSON.parse(localStorage.getItem('his')) || []// 历史数组
    };
  },
  methods: {
    // eslint-disable-next-line space-before-function-paren
    inputFn () { // 输入框-实时改变输入触发事件
      clearTimeout(this.timer); // 清除上一次的定时
      if (this.kw.length === 0) { // 清空输入内容，清空联想内容数组
        this.suggestList = [];
      } else {
        this.timer = setTimeout(async () => { // 防抖：延时执行逻辑，事件再次发生时，清除上一个定时器
          if (this.kw.length === 0) { // 如果输入为空，重新进入防抖
            return;
          }
          const res = await getSuggestApi({
            keyword: this.kw
          });
          console.log(res);
          this.suggestList = res.data.data.options;
          console.log(this.suggestList, 'suggest');
        }, 300);
      }
    },
    // eslint-disable-next-line space-before-function-paren
    lightItem (originStr, objStr) {
      // originStr:原字符串
      // objStr：目标字符串
      // 返回值为完整字符串
      // replaceAll全部替换，replace替代第一个
      // 如果使用变量，作为正则的匹配条件，不能使用语法糖简写
      if (this.suggestList.length > 1) {
        const reg = new RegExp(objStr, 'ig'); // i代表忽略大小写，g代表匹配全局
        return originStr.replace(reg, (match) => { // match时匹配时，原子符串，用原来的，我加个高亮
          return `<span style="color:red;">${match}</span>`;
        });
      }
    },
    // eslint-disable-next-line space-before-function-paren
    searchFn () { // 搜索菜单回车事件
      if (this.kw.length !== 0) {
        this.history.push(this.kw);
        setTimeout(() => {
          this.$router.push({
            path: `/searchResult/${this.kw}`
          });
        });
      }
    },
    // eslint-disable-next-line space-before-function-paren
    suggestFn (item) { // 联想点击事件
      this.history.push(item);
      setTimeout(() => {
        this.$router.push({
          path: `/searchResult/${item}`
        });
      });
    },
    // eslint-disable-next-line space-before-function-paren
    historyFn (obj) { // 历史记录点击
      this.$router.push({ // 搜索历史点击事件
        path: `/searchResult/${obj}`
      });
    },
    // eslint-disable-next-line space-before-function-paren
    clearFn () {
      this.history = [];
    }
  },
  watch: {
    history: { // 历史记录数组的改变
      deep: true,
      // eslint-disable-next-line space-before-function-paren
      handler () { // 立刻覆盖式的保存本地
        const theSet = new Set(this.history); // ES6:Set无序不重复的value集合（无下角标），Object类型
        const arr = Array.from(theSet);
        localStorage.setItem('his', JSON.stringify(arr));
      }
    }
  }
};

</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}
/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
