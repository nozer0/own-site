<template>
	<nav class="headnav">
		<Menu theme="dark" :router="true" width="150px">
			<MenuItem name="/"><Icon type="ios-home"></Icon><span class="menu_title">首页</span></MenuItem>
			<Submenu name="/companies">
				<template slot="title"><Icon type="ios-people"></Icon><span class="menu_title">公司</span></template>
				<MenuItem name="/companies"><Icon type="earth"></Icon><span class="menu_title">公司列表</span></MenuItem>
				<MenuItem name="/contacts"><Icon type="android-contacts"></Icon><span class="menu_title">联系人列表</span></MenuItem>
			</Submenu>
			<Submenu name="/projects">
				<template slot="title"><Icon type="ios-box"></Icon><span class="menu_title">项目</span></template>
				<MenuItem name="/projects"><Icon type="folder"></Icon><span class="menu_title">项目列表</span></MenuItem>
				<MenuItem name="/projects/1/visits"><Icon type="chatboxes"></Icon><span class="menu_title">客勤列表</span></MenuItem>
				<MenuItem name="/projects/1/orders"><Icon type="ios-list"></Icon><span class="menu_title">订单列表</span></MenuItem>
				<MenuItem name="/projects/1/contracts"><Icon type="clipboard"></Icon><span class="menu_title">合同列表</span></MenuItem>
			</Submenu>
			<Submenu name="/products">
				<template slot="title"><Icon type="ios-book"></Icon><span class="menu_title">产品</span></template>
				<MenuItem name="/products"><Icon type="ios-pricetags"></Icon><span class="menu_title">产品列表</span></MenuItem>
				<MenuItem name="/products/comparisons"><Icon type="ios-grid-view"></Icon><span class="menu_title">产品比较列表</span></MenuItem>
			</Submenu>
			<Submenu name="/purchases">
				<template slot="title"><Icon type="ios-cart"></Icon><span class="menu_title">采购</span></template>
				<MenuItem name="/suppliers"><i class="el-icon-fa-truck"></i><span class="menu_title">供货商列表</span></MenuItem>
				<MenuItem name="/purchases/1/orders"><Icon type="ios-list"></Icon><span class="menu_title">订单列表</span></MenuItem>
				<MenuItem name="/purchases/1/contracts"><Icon type="clipboard"></Icon><span class="menu_title">合同列表</span></MenuItem>
			</Submenu>
			<Submenu name="/stocks">
				<template slot="title"><Icon type="ios-filing"></Icon><span class="menu_title">库存</span></template>
				<MenuItem name="/stocks"><i class="el-icon-fa-archive"></i><span class="menu_title">库存列表</span></MenuItem>
				<MenuItem name="/stocks/imports"><i class="el-icon-fa-download"></i><span class="menu_title">入库列表</span></MenuItem>
				<MenuItem name="/stocks/exports"><i class="el-icon-fa-upload"></i><span class="menu_title">出库列表</span></MenuItem>
			</Submenu>
			<Submenu name="/reports">
				<template slot="title"><Icon type="arrow-graph-up-right"></Icon><span class="menu_title">报表</span></template>
				<MenuItem name="/stocks"></MenuItem>
				<MenuItem name="/stocks/imports"></MenuItem>
				<MenuItem name="/stocks/imports/1"></MenuItem>
				<MenuItem name="/stocks/exports"></MenuItem>
				<MenuItem name="/stocks/exports/1"></MenuItem>
			</Submenu>
			<Submenu name="/users">
				<template slot="title"><Icon type="person"></Icon><span class="menu_title">用户</span></template>
				<MenuItem name="/groups"><i class="el-icon-fa-sitemap"></i><span class="menu_title">部门列表</span></MenuItem>
				<MenuItem name="/users"><Icon type="person-stalker"></Icon><span class="menu_title">用户列表</span></MenuItem>
				<MenuItem name="/roles"><i class="el-icon-fa-vcard"></i><span class="menu_title">角色列表</span></MenuItem>
			</Submenu>
		</Menu>
	</nav>
</template>
