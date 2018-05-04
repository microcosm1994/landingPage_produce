<template>
  <div class="home">
    <div class="bg"></div>
    <div class="header">header</div>
    <div class="sidebar">sidebar</div>
    <div class="home-container">
      <div class="home-container-box">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: ''
    }
  }
}
</script>

<style>
  .home{
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .bg{
    width: 100%;
    height: 100%;
    background: url(../assets/bg.jpg) no-repeat;
    background-size: 100% 100%;
    position: fixed;
    top: 0;
    left: 0;
  }
  .header{
    width: 100%;
    height:80px;
    position: fixed;
    top:0px;
    left:0;
    z-index: 2;
    background: rgba(0,0,0,0.8);
  }
  .sidebar{
    width: 200px;
    height:100%;
    position: fixed;
    top:80px;
    left:0;
    z-index: 2;
    background: rgba(0,0,0,0.8);
  }
  .home-container{
    width: 100%;
    height:100%;
    padding-left: 200px;
    padding-top: 80px;
    background: #f5f5f5;
    overflow: hidden;
  }
  .home-container .home-container-box{
    width: 100%;
    height:100%;
    position: relative;
  }
</style>
