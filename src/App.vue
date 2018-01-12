<template>
  <layout>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </layout>
</template>

<script>
import defaultLayout from '@/layouts/default'

export default {
  name: 'app',
  components: { 'layout': defaultLayout }
}
</script>

<style>
/*html {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
*/
html {
  -ms-overflow-style: -ms-autohiding-scrollbar;
}

body {
  margin: 0;
  background: #324157;
  scrollbar-face-color: #99ccff;
  scrollbar-shadow-color: #ccccff;
  scrollbar-highlight-color: #ccccff;
  scrollbar-3dlight-color: #99ccff;
  scrollbar-darkshadow-color: #ccccff;
  scrollbar-track-color: #ccccff;
  scrollbar-arrow-color: #000033;
}

#app {
  color: #eef2f6;
}

form:after {
  display: block;
  content: '';
  clear: both;
}

.el-input.is-disabled .el-input-group__append {
  border-color: #1f2d3d;
}

#app .el-checkbox__input.is-disabled .el-checkbox__inner {
  background-color: #485c6a;
}

.el-form { margin-bottom: -22px; }
.el-form-item.is-error .el-input-group__append, .el-form-item.is-error .el-input-group__prepend, .el-form-item.is-error {
  border-color: #E9563F;
}

.toolbar {
  margin: 10px 0;
}

.buttons {
  float: right;
}

.form-buttons {
  float: right;
}

.form-buttons:after {
  display: block;
  content: '';
  clear: both;
}

.pager {
  text-align: center;
  margin-top: 10px;
}

.el-table .cell { padding: 0 10px; line-height: inherit; }
.el-table__expanded-cell { padding: 20px; }
.el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #324057;
}

.spin-icon-load {
  animation: spin-animation 1s linear infinite;
}

@keyframes spin-animation {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}

.drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  text-align: center;
  background: #000;
  opacity: .6;
}
.drop-active h3 {
  margin: -.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}

.file-uploads {
  vertical-align: middle;
  top: -1px;
}
.file-uploads .ivu-tag {
  height: auto;
  background: transparent;
}
.file-uploads .ivu-tag:hover {
  color: #7fb1b3;
  border-color: #7fb1b3;
}
.file-uploads .ivu-icon {
  margin-right: 6px;
}

.file-uploads .ivu-tag[disabled] {
  color: #5f6d7d;
  border-color: #5f6d7d;
  cursor: not-allowed;
}

::-webkit-scrollbar {
  width: 8px;
  height: 1px;
}

:window-inactive {
  overflow-y: hidden;
  visibility: hidden;
}

::-webkit-scrollbar-thumb {
  border-radius: 8px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: #1f2d3d;
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 8px;
  background: #5f6d7d;
}

.ivu-modal-header .zoom {
  float: right;
  color: #999;
  font-size: 18px;
}
.ivu-modal-header .zoom:hover {
  cursor: pointer;
  color: #ccc;
}
.normal .ivu-modal {
  width: 80%;
}
.fullscreen .ivu-modal {
  width: 100% !important;
  height: 100%;
  top: 0;
  margin: 0;
}
.fullscreen .ivu-modal-content {
  height: 100%;
}
</style>

<style lang="less">
[class^="el-icon-fa"], [class*=" el-icon-fa"] {
  display: inline-block;
  font: normal normal normal 1.2em/1 FontAwesome !important;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@import url("./assets/less/font-awesome.less");
@fa-css-prefix: el-icon-fa;
</style>
