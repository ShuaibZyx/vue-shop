<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList"
                        @keyup.enter.native="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 商品表格区域 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column header-align="center" type="index"></el-table-column>
                <el-table-column header-align="center" label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column header-align="center" label="商品价格(元)" prop="goods_price" width="100px">
                </el-table-column>
                <el-table-column header-align="center" label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column header-align="center" label="创建时间" width="200px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | timeFormater}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                            @click="goEditPage(scope.row.goods_id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[6, 12, 18, 24]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total" background>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: 'List',
        data() {
            return {
                //查询所需要的参数
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 6
                },
                //商品列表
                goodsList: [],
                //总商品列表
                total: 0
            }
        },
        methods: {
            //根据分页规则获取商品列表
            async getGoodsList() {
                const { data: res } = await this.$http.get('goods', {
                    params: this.queryInfo
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品列表失败')
                }
                this.goodsList = res.data.goods
                this.total = res.data.total
            },

            handleSizeChange(newSize) {
                const temporaryTotal = this.queryInfo.pagesize * this.queryInfo.pagenum
                this.queryInfo.pagesize = newSize
                this.queryInfo.pagenum = (temporaryTotal / this.queryInfo.pagesize) + 1
                this.getGoodsList()
            },

            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getGoodsList()
            },

            //点击删除按钮删除该id对应的商品
            async removeById(id) {
                const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }
                const { data: res } = await this.$http.delete(`goods/${ id }`)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除商品失败')
                }
                this.$message.success('删除成功')
                this.getGoodsList()
            },

            //跳转到添加商品页面的的方法
            goAddPage() {
                this.$router.push('/goods/addgoods')
            },

            //跳转到编辑商品页面的的方法
            goEditPage(id) {
                this.$router.push({
                    name: 'editgoods',
                    params: {
                        goodId: id
                    }
                })
            }
        },
        created() {
            this.getGoodsList()
        },

    }
</script>

<style scoped lang="less">

</style>