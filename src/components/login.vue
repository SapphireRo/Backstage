<template>
    <div class="login_container">
      <div class="login_box">
          <!-- 头像 -->
          <div class="avatar_box">
              <img src="../assets/monkey.jpg" alt="">
          </div>
          <!-- 登录 -->
          <el-form ref="loginFormref" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
              <!-- 用户名 -->
              <el-form-item prop="username">
                  <el-input v-model="loginForm.username" prefix-icon="User" ></el-input>
              </el-form-item>
              <!-- 密码 -->
              <el-form-item prop="password">
                  <el-input v-model="loginForm.password" 
                  show-password prefix-icon="Lock"
                  type="password" />
              </el-form-item>
              
              <!-- 提交按钮 -->
              <div class="btns" >
                  <el-button type="primary" @click="login">登录</el-button>
                  <el-button type="info" @click="resetLoginForm" >重置</el-button>    
              </div>
             
              <!-- 消息提示 -->
              <!-- <el-button :plain="true" @click="login">success</el-button> -->
          </el-form>
      </div>
    </div>
  </template>
  
  <script>
import { reactive, ref, toRefs } from 'vue'
import { getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import axios from "axios";
import { useRouter } from 'vue-router';
  export default {
    setup(){
        const router=useRouter()
        const data=reactive({
            //登录绑定数据
            loginForm:{
                username:'admin',
                password:'123456'
            },
            //表单验证
            loginFormRules:{
                //验证用户名是否合法
                username:[
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    { min: 3, max: 10, message: '长度在3-10之间', trigger: 'blur' },
                ],
                 //验证密码是否合法
                password:[
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    { min: 3, max: 10, trigger: 'blur' },
                ]
            }
        })
        const loginFormref=ref();  
        //重置   
        const resetLoginForm=()=>{
            loginFormref.value.resetFields()
        }    
        // 登录
        const login=()=>{
            loginFormref.value.validate(async valid=>{
            if(!valid) return;
            const {data:result}=await axios.post("login",data.loginForm)
            console.log(result);
            if(result.meta.status !==200){
                ElMessage.error('用户名或密码错误')
            }else{
                ElMessage({
                    message: '登陆成功！',
                    type: 'success',
                })
                sessionStorage.setItem("token",result.data.token)
                router.push('/home')
            }
            
            
            })
        }
        return{
            ...toRefs(data),
            resetLoginForm,
            login,
            useRouter,
            loginFormref
        }
    },
    
        
    
  }
  </script>
  
  <style lang="less" scoped>
  .login_container{
      height: 100%;
      background-color: #2b4b6b;
      .login_box{
          width: 450px;
          height: 250px;
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 10px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          .avatar_box{
              height: 130px;
              width: 130px;
              border: 1px solid #eee;
              border-radius: 50%;
              position: absolute;
              left: 50%;
              transform: translate(-50%,-50%);
              img{
                  height: 100%;
                  width: 100%;
                  border-radius: 50%;
              }
          }
          .login_form{
              position: absolute;
              top: 90px;
              width: 100%;
              padding: 0 20px;
          }
      }
  }
  .btns{
      display: flex;
      justify-content:center;
      margin-top: 20px;
  }
  /deep/ .el-input__prefix-inner{
      color: #2b4b6b;
      z-index: 1;
  }
  </style>