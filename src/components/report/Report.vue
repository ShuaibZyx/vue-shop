<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 2.为echarts准备一个具备大小高度的容器 -->
            <div class="my-echarts-box">
                <div id="main" class="my-echarts"></div>
            </div>
        </el-card>
    </div>
</template>

<script>
    //1.导入echarts
    import * as echarts from 'echarts';
    import options from '../../js/options.js'
    export default {
        name: 'Report',
        data() {
            return {
                //需要合并的数据
                options: options,
            }
        },
        methods: {

        },
        created() {

        },
        //此时Dom元素渲染完毕
        async mounted() {
            //3.基于准备好的容器初始化echarts
            var myChart = echarts.init(document.getElementById('main'));
            //4.准备数据和配置项
            //获取服务器数据
            const { data: res } = await this.$http.get('reports/type/1')
            if (res.meta.status !== 200) {
                return this.$message.error('获取折线图数据失败')
            }
            //5.展示数据
            this.options = {
                ...this.options,
                ...res.data
            }
            myChart.setOption(this.options)
        },
    }
</script>

<style scoped lang="less">
    .my-echarts {
        width: 900px;
        height: 450px;
        margin: 10px;
    }

    .my-echarts-box {
        background: linear-gradient(to right, #ffffff, #e895b9, #ffffff);
        display: flex;
        /*水平居中*/
        justify-content: center;
        /*垂直居中*/
        align-items: Center;
    }
</style>