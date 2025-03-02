<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            
            <el-menu active-text-color="#4C4C6E" background-color="#1E1E2D"  text-color="#fff"
                router>
                <div style="font-size:x-large;color :white;padding: 20px;"><strong>链证</strong></div>
                <!-- <el-sub-menu >
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>主页-管理</span>
                    </template>
                    <el-menu-item index="/admin/club">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>社团管理</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/form">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>表单管理</span>
                    </el-menu-item>
                    <el-menu-item >
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>其他管理</span>
                    </el-menu-item>
                </el-sub-menu> -->
                <el-menu-item >
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>chat-bpmn</span>
                </el-menu-item>
                <el-menu-item index="/admin/form">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>问卷管理</span>
                </el-menu-item>
                <el-menu-item index="/admin/form/create">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>发布问卷</span>
                </el-menu-item>
                <el-menu-item index="/admin/activity">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>我的活动</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div><strong>链证管理系统</strong></div>
                <el-dropdown placement="bottom-end">
                    <span class="el-dropdown__box">
                        <el-avatar :src="avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="profile" :icon="User">账号信息</el-dropdown-item>
                            <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
            <!-- 底部区域 -->
            
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color:#1E1E2D;
        .el-menu {
            border-right: none;
        }
        :deep(.el-sub-menu__title),
        :deep(.el-menu-item) {
          &:hover {
            background-color: #2d2d3d !important; // 悬停背景色
            color: #fff !important;              // 悬停文字颜色
          }

          &.is-active {
            background-color: #4C4C6E !important; // 选中背景色
            color: #fff !important;               // 选中文字颜色
            .el-icon { color: #fff !important; }  // 选中图标颜色
          }
        }
        // 子菜单展开时标题样式
        :deep(.el-sub-menu.is-active) {
          .el-sub-menu__title {
            color: #fff !important;
            .el-icon { color: #fff !important; }
          }
        }
    }

    .el-header {
        background-color: #F5F7FA;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: black;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>