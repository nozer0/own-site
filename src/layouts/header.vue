<template>
  <header>
    <el-button class="nav_btn" icon="fa-bars"></el-button>
    <slot/>
  </header>
</template>
<style>
header {
  text-align: left;
  height: 60px;
  padding: 0 8px;
  color: #fff;
}
.nav_btn {
  background: transparent;
  color: #20a0ff;
  border-color: #20a0ff; 
  margin: 8px;
}
.nav_btn:hover {
  cursor: pointer;
  color: #fff;
  border-color: #fff; 
}
</style>