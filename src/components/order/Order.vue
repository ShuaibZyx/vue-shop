<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 订单列表table区域 -->
            <el-table :data="orderList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单ID" prop="order_id" width="60px"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time | timeFormater}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
                        <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total" background>
            </el-pagination>
        </el-card>

        <!-- 编辑地址的对话框 -->
        <el-dialog title="修改地址" :visible.sync="addressDialogVisible" width="40%" @close="addressDialogClosed">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="provinces">
                    <!-- 级联选择器 -->
                    <el-cascader :options="cityData" v-model="addressForm.provinces" :props="orderProps"
                        @change="handleChange"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="detailedAdreess">
                    <el-input v-model="addressForm.address1"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addressDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 展示物流进度的对话框 -->
        <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="40%">
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in logisticsInfo" :key="index" :timestamp="activity.time" color="#d2568c" icon="el-icon-s-promotion">
                    {{activity.context}}
                </el-timeline-item>
            </el-timeline>
            <span slot="footer" class="dialog-footer">
                <el-button @click="progressDialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import cityData from '../../js/citydata.js'
    import logistics from '../../js/logistics.js'
    export default {
        name: 'Order',
        data() {
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 5
                },
                progressInfo: [],
                orderProps: {
                    expandTrigger: 'hover',
                },
                total: 0,
                orderList: [],
                addressForm: {
                    provinces: [],
                    detailedAdreess: ''
                },
                addressFormRules: {
                    provinces: [
                        { required: true, message: '请选择省市区/县', trigger: 'blur' }
                    ],
                    detailedAdreess: [
                        { required: true, message: '请填写详细地址', trigger: 'blur' }
                    ]
                },
                //修改地址的Dialog对话框状态
                addressDialogVisible: false,
                //显示物流信息的Dialog对话框状态
                progressDialogVisible: false,
                cityData: cityData,
                logisticsInfo: logistics.data
            }
        },
        methods: {
            //获取当前的订单列表
            async getOrderList() {
                const { data: res } = await this.$http.get('orders', {
                    params: this.queryInfo
                })
                if (res.meta.status !== 200) {
                    this.$message.error('获取订单列表失败')
                }
                this.total = res.data.total
                this.orderList = res.data.goods
            },


            handleSizeChange(newSize) {
                const temporaryTotal = this.queryInfo.pagesize * this.queryInfo.pagenum
                this.queryInfo.pagesize = newSize
                this.queryInfo.pagenum = (temporaryTotal / this.queryInfo.pagesize) + 1
                this.getOrderList()
            },

            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getOrderList()
            },

            //展示修改地址的对话框
            showBox() {
                this.addressDialogVisible = true
            },


            //级联选择器关闭时触发的方法
            addressDialogClosed() {
                this.$refs.addressFormRef.resetFields()
            },


            handleChange() {
                this.$refs.elCascader.dropDownVisible = false
            },


            showProgressBox() {
                this.progressDialogVisible = true
            }
        },
        created() {
            this.getOrderList()
        },

    }
</script>

<style scoped lang="less">
    .el-cascader {
        width: 100%;
    }
</style>