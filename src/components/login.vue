<template>
  <!--login外框-->
  <div class="_login">
    <!--login内框-->
    <div class="login_inner">
      <el-form class="form" ref="form" :model="formLogin">
        <el-form-item>
          <h2 class="title">后端管理</h2>
        </el-form-item>
        <el-form-item>
          <el-input type="text" v-model="formLogin.loginName" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" v-model="formLogin.password" placeholder="密码" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style lang="scss">
._login {
  // border:1px solid red;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .login_inner {
    // border:1px solid green;
    width: 460px;
    height: 300px;
    margin-top: -150px;
    display: flex;
    justify-content: center;
    box-shadow: 0 0 25px #cac6c6;
    .form {
      // border:1px solid blue;
      width: 300px;
      margin-top: 30px;
      text-align: center;
      .title {
        color: #505458;
      }
    }
    .error {
      color: red;
    }
  }
}
</style>
<script>

export default {
  name: "login",
  data() {
    return {
      formLogin: {
        loginName: "wzl",
        password: "wzl"
      }
    };
  },
   mounted() {
        document.onkeydown = (event) => {
            var router=this.$route.path;
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 13&&this.$route.path=='/login') { // enter 键 
                this.login();
            }
        };
    },
  methods: {
    login() {
      var param = {
        userName: this.formLogin.loginName,
        passWord: this.formLogin.password
      };
			
      this.$http
        .post("/adminInfo/login", param)
        .then(response => {
			
		if(response.data.code == '200'){
            //保存登陆信息
            var result = response.data.data;
			//添加路由
			this.$store.dispatch('add_Routes',result.routes);
			//生成菜单
			this.$store.dispatch('add_Menus',result.menus);
			
			sessionStorage.setItem("userName", result.adminInfo.userName); //用户名
			sessionStorage.setItem("token", "111111"); //保存秘钥
			sessionStorage.setItem("position", "超级管理员"); //用户职位
												
            //登陆成功跳转主页
            this.$router.replace({ path: "/index" });
						
				//弹出消息框
				this.$message({
					message: '登录成功',
					type: 'success'
				});
					
          } else {						
				//弹出消息框
				this.$message({
					message: '账号或密码错误',
					type: 'error'
				});
          }
        })
        .catch(error => {
					//弹出消息框
					this.$message({
						message: "服务器错误",
						type: 'error'
					});
          console.log("失败报文:", error);
        });
    }
  }
};
</script>