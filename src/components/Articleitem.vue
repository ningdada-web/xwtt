<template>
  <div>
    <van-cell>
      <!-- 标题 -->
      <template #title>
        <div class="title-box">
          <span>{{ artObj.title }}</span>
          <img
            v-if="artObj.cover.type == 1"
            class="thumb"
            v-lazy="artObj.cover.images[0]"
          />
        </div>
        <div class="thumb-box" v-if="artObj.cover.type > 1">
          <img
            v-for="(val, index) in artObj.cover.images"
            :key="index"
            class="thumb"
            v-lazy="val"
          />
        </div>
      </template>
      <!-- 区域内容 -->
      <template #label>
        <div class="label-box">
          <div>
            <!-- 作者 -->
            <span>{{ artObj.aut_name }}&nbsp;</span>
            <!-- 评论 -->
            <span>{{ artObj.comm_count }}评论&nbsp;</span>
            <!-- 发布时间 -->
            <span>{{ artObj.pubdate }}</span>
          </div>
          <div>
            <van-icon
              name="cross"
              @click.stop="show = true"
              v-if="isShow"
            ></van-icon>
          </div>
        </div>
      </template>
      <template></template>
    </van-cell>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="onSelect"
      get-container="body"
      :cancel-text="text"
      @cancel="cancelBn"
      @close="closeBn"
    />
  </div>
</template>

<script>
import { firstActions, secondActions } from '../api/action';
// import { articleDislikeApi } from '../../utils/api';

export default {
  name: 'ArticleItem',
  // eslint-disable-next-line space-before-function-paren
  data () {
    return {
      show: false, // 反馈面板显示/隐藏
      actions: firstActions,
      text: '取消'

    };
  },
  props: {
    artObj: Object,
    isShow: {
      type: Boolean,
      default: true
    }// 叉叉反馈按钮是否显示
  },
  methods: {
    // action是name对象，index是name的索引
    // eslint-disable-next-line space-before-function-paren
    onSelect (action, index) { // 反馈面板-选择反馈
      console.log(action);
      console.log(index);
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      if (action.name === '做的什么东西') {
        this.actions = secondActions;
        this.text = '返回';
      } else if (action.name === '垃圾') {
        this.$emit('dislikeArt', this.artObj.art_id);
        // console.log(typeof this.artObj.art_id);
        this.show = false;
      } else {
        this.$emit('report', this.artObj.art_id, action.value);
        this.show = false;
      }
    },
    // eslint-disable-next-line space-before-function-paren
    cancelBn () { // 反馈面板-底部取消/返回按钮逻辑
      if (this.text === '返回') {
        this.show = true;
        this.actions = firstActions;
        this.text = '取消';
      }
    },
    // eslint-disable-next-line space-before-function-paren
    closeBn () { // 反馈面板-关闭面板
      this.actions = firstActions;
      this.text = '取消';
    }

  }
};

</script>

<style scoped lang='less'>
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}
/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
