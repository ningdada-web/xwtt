<template>
  <div>
    <van-nav-bar title="新闻头条" right-text="注册" @click-right="onClickRight">
    </van-nav-bar>
    <van-form @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        label="手机号"
        required
        placeholder="手机号"
        :rules="[
          {
            required: true,
            pattern: /^1[3-9]\d{9}/,
            message: '请填写11位手机号',
          },
        ]"
      />
      <van-field
        v-model="user.code"
        type="password"
        name="code"
        label="密码"
        required
        placeholder="密码"
        :rules="[
          { required: true, pattern: /\d{6}/, message: '请填写6位密码' },
        ]"
      />
      <div style="margin: 16px">
        <van-button
          round
          block
          :disabled="isLoading"
          :loading="isLoading"
          type="info"
          loading-text="加载中..."
          native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { loginApi } from '../../api/api';
import { Notify } from 'vant';
import { setToken } from '../../utils/token';

export default {
  name: 'login',
  // eslint-disable-next-line space-before-function-paren
  data () {
    return {
      user: {
        mobile: '',
        code: ''// 密码默认246810
      },
      isLoading: false
    };
  },
  components: {

  },
  methods: {
    // eslint-disable-next-line space-before-function-paren
    async onSubmit (values) {
      console.log('submit', values);// 登录提交
      this.isLoading = true;
      try {
        const res = await loginApi(this.user);
        Notify({ type: 'success', message: '登录成功' });
        console.log(res, 'res');
        setToken(res.data.data.token);
        this.$router.replace({ path: 'inside/home' });
      } catch (err) {
        Notify({ type: 'danger', message: '账号或密码错误，请重新输入' });
      }
      this.isLoading = false;
    },
    // eslint-disable-next-line space-before-function-paren
    onClickRight () { } // 注册提交
  }
};

</script>

<style scoped lang="less">
/* 类名是van-nav-bar组件内根标签 */
// .van-nav-bar {
//   background-color: #007bff;
// }
// // scope尝试把此选择器后属性选择器匹配当前页面标签，选不中组件内部标签
// // deep把属性选择器加到前面
// /deep/.van-nav-bar__ {
//   color: white;
// }
// .nav-bar-icon-color
/deep/.van-nav-bar__text {
  color: #fff;
}
</style>
