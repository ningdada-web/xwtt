<!-- eslint-disable no-undef -->
<!-- eslint-disable no-undef -->
<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="userPro.photo"
            @click="$refs.img.click()"
          />
          <!-- 图片选择 -->
          <input
            type="file"
            accept="image/*"
            @change="handleImage"
            v-show="false"
            ref="img"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="userPro.name"
        @click="showNameDialogFn"
      />
      <!-- 修改用户名称的对话框 -->
      <van-dialog
        v-model="isShowNameDialog"
        title="修改名称"
        show-cancel-button
        :before-close="onNameDialogBeforeClose"
      >
        <!-- 输入框 -->
        <van-field
          v-model.trim="userName"
          input-align="center"
          maxlength="7"
          placeholder="请输入名称"
          v-fofo
        />
      </van-dialog>
      <van-cell
        title="生日"
        is-link
        :value="userPro.birthday"
        @click="changeBir"
      />
      <van-datetime-picker
        v-show="birIsShow"
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirmFn"
        @cancel="cancel"
      />
      <van-cell
        title="性别"
        is-link
        :value="userPro.gender === 1 ? '女' : '男'"
        @click="sexFn"
      />
      <van-radio-group
        v-model="radio"
        direction="horizontal"
        icon-size="15px"
        v-show="radioShow"
      >
        <van-radio name="1" @click="chooseFn">女</van-radio>
        <van-radio name="0" @click="chooseFn">男</van-radio>
      </van-radio-group>
    </van-cell-group>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { userProfileApi, updatePhotoAPI, updateProfileAPI } from '../../api/api';
import { Notify } from 'vant';
import { msToDate } from '../../components/timeChange';

export default {
  name: 'UserEdit',
  // eslint-disable-next-line space-before-function-paren
  data () {
    return {
      userPro: {}, // 用户简介列表
      isShowNameDialog: false, // 是否显示姓名弹出框
      userName: '', // 编辑用户名
      birIsShow: false, // 时间选择器默认不显示
      minDate: new Date(2020, 0, 1), // 最小时间
      maxDate: new Date(2025, 10, 1), // 最大时间
      currentDate: new Date(2021, 9, 17), // 默认值
      radio: '', // 默认男
      radioShow: false, // 性别选择器默认关闭
      flag: []
    };
  },
  // eslint-disable-next-line space-before-function-paren
  async created () {
    const res = await userProfileApi();// 用户简介
    this.userPro = res.data.data;
    this.radio = res.data.data.gender;
    console.log(this.radio);
    console.log(res);
  },
  methods: {
    // eslint-disable-next-line space-before-function-paren
    async handleImage (ev) { // 修改头像
      //   console.log(ev.target.files[0])
      if (ev.target.files.length === 0) return; // 防止用户未选择图片
      const fd = new FormData();
      fd.append('photo', ev.target.files[0]); // photo在表单里参数名携带
      const res = await updatePhotoAPI(fd);
      console.log(res);
      this.userPro.photo = res.data.data.photo; // 更新最新头像
    },
    // 点击名字-出现弹出框
    // eslint-disable-next-line space-before-function-paren
    showNameDialogFn () {
      this.isShowNameDialog = true;
      this.userName = this.userPro.name; // 设置默认显示内容
    },

    // 姓名修改弹出层-关闭前方法
    // eslint-disable-next-line space-before-function-paren
    async onNameDialogBeforeClose (action, done) {
      // action的值: confirm或cancel(点击按钮区分)
      if (action === 'confirm') {
        // 确定
        // unicode编码 \u4092
        // url编码 %E2%C3%D1
        if (/^[A-Za-z0-9\u4e00-\u9fa5]{1,7}$/.test(this.userName)) {
          // 通过校验
          // 调用接口
          // 更新页面显示的名字
          const res = await updateProfileAPI({
            userName: this.userName
          });
          this.userPro.name = this.userName;
          console.log(res);
          // 关闭弹窗
          done();
        } else {
          // 提示用户
          Notify({ type: 'warning', message: '用户名中英文和数字1-7位' });
          // 阻止弹窗关闭
          done(false);
        }
      } else if (action === 'cancel') {
        // 取消
        done();
      }
    },
    // 时间选择器-显示
    // eslint-disable-next-line space-before-function-paren
    changeBir () {
      this.birIsShow = true;
    },
    // eslint-disable-next-line space-before-function-paren
    async confirmFn () { // 时间选择器确认事件
      // this.userPro.birthday = this.currentDate;
      const date = msToDate(this.currentDate).withoutTime;
      const res = await updateProfileAPI({
        birthday: date
      });
      console.log(res);
      this.userPro.birthday = date;
      this.birIsShow = false;
    },

    // eslint-disable-next-line space-before-function-paren
    cancel () { // 时间选择器取消事件
      this.birIsShow = false;
    },
    // eslint-disable-next-line space-before-function-paren
    sexFn () { // 性别打开开关选择
      if (this.flag.length === 0) {
        this.radioShow = true;
        this.flag.push('1');
      } else {
        // await updateProfileAPI({
        //   render: this.radio
        // });
        // this.userPro.gender = this.radio;
        // this.radioShow = false;
        this.flag = [];
        this.radioShow = false;
      }
    },

    // eslint-disable-next-line space-before-function-paren
    async chooseFn () { // 性别单选框选择事件
      await updateProfileAPI({
        render: this.radio
      });
      this.userPro.gender = this.radio;
      this.radioShow = false;
      console.log(this.radio);
    }
  }
};

</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
/deep/.van-nav-bar .van-icon {
  color: #fff;
}
.van-radio-group--horizontal {
  font-size: 15px;
  justify-content: flex-end;
}
</style>
