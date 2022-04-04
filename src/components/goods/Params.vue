<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 卡片头部提示区域 -->
            <el-alert title="注意: 只允许为第三级分类设置参数" type="warning" effect="dark" show-icon :closable="false"></el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类:</span>
                    <!-- 级联选择框 -->
                    <el-cascader v-model="selectedCateKeys" :options="cateList" :props="cateProps"
                        @change="handleChange"></el-cascader>
                </el-col>
            </el-row>

            <!-- tab页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">
                        添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag closable v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(i, scope.row)">{{item}}</el-tag>
                                <!-- 输入新tag文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加新tag按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>

                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">
                        添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag closable v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(i, scope.row)">{{item}}</el-tag>
                                <!-- 输入新tag文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加新tag按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>

                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数对话框 -->
        <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
            <!-- 添加参数的输入框 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 修改参数对话框 -->
        <el-dialog :title="'添加' + titleText" :visible.sync="editDialogVisible" width="40%" @close="editDialogClosed">
            <!-- 添加参数的输入框 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'Params',
        data() {
            return {
                //商品分类列表
                cateList: [],
                //级联选择框的配置对象
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                //添加参数输入框中输入的内容
                addForm: {
                    attr_name: ''
                },
                //编辑参数输入框中输入的内容
                editForm: {

                },
                //添加参数输入框验证规则
                addFormRules: {
                    attr_name: [
                        { required: true, message: '请输入参数名称', trigger: 'blur' }
                    ]
                },
                //编辑参数输入框验证规则
                editFormRules: {
                    attr_name: [
                        { required: true, message: '请输入参数名称', trigger: 'blur' }
                    ]
                },
                //级联选择框双向绑定数组
                selectedCateKeys: [],
                //动态参数列表数据
                manyTableData: [],
                //静态参数列表数据
                onlyTableData: [],
                //被激活的页签名称
                activeName: 'many',
                //控制添加参数Dailog对话框的状态
                addDialogVisible: false,
                //控制修改参数Dailog对话框的状态
                editDialogVisible: false,
            }
        },
        computed: {
            //判断tab面板按钮是否显示
            isBtnDisabled() {
                if (this.selectedCateKeys.length !== 3) {
                    return true
                } else {
                    return false
                }
            },
            //当前选中的三级分类id
            cateId() {
                if (this.selectedCateKeys.length === 3) {
                    return this.selectedCateKeys[2]
                } else {
                    return null
                }
            },
            //动态确定添加参数的Dialog标题文本
            titleText() {
                if (this.activeName === 'many') {
                    return '动态参数'
                } else {
                    return '静态属性'
                }
            }
        },
        methods: {
            //获取所有的商品分类列表
            async getCateList() {
                const { data: res } = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类失败')
                }
                this.cateList = res.data
            },

            //级联选择框选中项变化触发函数
            handleChange() {
                //如果选中的不是三级分类
                if (this.selectedCateKeys.length !== 3) {
                    this.selectedCateKeys = []
                    this.manyTableData = []
                    this.onlyTableData = []
                    this.$message.warning('请选择三级分类哦')
                } else {
                    this.getParamsData()
                }
                this.$refs.elCascader.dropDownVisible = false
            },


            //获取参数列表方法
            async getParamsData() {
                //根据所选id和当前所处的面板获取对应的参数列表
                const { data: res } = await this.$http.get(`categories/${ this.cateId }/attributes`, {
                    params: {
                        sel: this.activeName
                    }
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取参数列表失败')
                }
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                    //添加一个布尔值用来控制每一行的input框
                    item.inputVisible = false
                    item.inputValue = ''
                });
                if (this.activeName === 'many') {
                    this.manyTableData = res.data
                } else {
                    this.onlyTableData = res.data
                }
            },

            //tab页签点击事件处理函数
            handleTabClick() {
                if(this.selectedCateKeys.length === 3){
                    this.getParamsData()
                }
            },

            //添加参数Dialog对话框关闭时触发函数
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },

            //点击按钮添加参数
            addParams() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return
                    const { data: res } = await this.$http.post(`categories/${ this.cateId }/attributes`, {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName
                    })
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加参数失败')
                    }
                    this.$message.success('添加参数成功')
                    this.getParamsData()
                    this.addDialogVisible = false
                })
            },

            //点击按钮展示修改对话框
            async showEditDialog(attr_id) {
                //查询当前id参数的信息
                const { data: res } = await this.$http.get(`categories/${ this.cateId }/attributes/${ attr_id }`, {
                    params: { attr_sel: this.activeName }
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取参数信息失败')
                }
                this.editForm = res.data
                this.editDialogVisible = true
            },

            //修改Dialog关闭时重置内容
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },

            //点击按钮修改参数
            editParams() {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return
                    const { data: res } = await this.$http.put(`categories/${ this.cateId }/attributes/${ this.editForm.attr_id }`, {
                        attr_name: this.editForm.attr_name,
                        attr_sel: this.activeName
                    })
                    if (res.meta.status !== 200) {
                        return this.$message.error('修改参数失败')
                    }
                    this.$message.success('修改参数成功')
                    this.getParamsData()
                    this.editDialogVisible = false
                })
            },

            //点击删除按钮根据id删除对应的参数项
            async removeParams(attr_id) {
                const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                //用户取消了删除操作
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }
                //用户确认了删除操作
                const { data: res } = await this.$http.delete(`categories/${ this.cateId }/attributes/${ attr_id }`)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除参数失败')
                }
                this.$message.success('删除参数成功')
                this.getParamsData()
            },

            //创建新tag时文本框失去焦点或enter键敲下时出发的函数
            handleInputConfirm(row) {
                if (row.inputValue.trim().length === 0) {
                    row.inputValue = ''
                    row.inputVisible = false
                } else {
                    row.attr_vals.push(row.inputValue.trim())
                    row.inputValue = ''
                    //发起网络请求
                    this.saveAttrVals(row)
                }
            },

            //将attr_vals的操作保存到数据库
            async saveAttrVals(row){
                const {data: res} = await this.$http.put(`categories/${ this.cateId }/attributes/${ row.attr_id }`, {
                        attr_name: row.attr_name,
                        attr_sel: row.attr_sel,
                        attr_vals: row.attr_vals.join(',')
                    })
                    if(res.meta.status !== 200){
                        return this.$message.error('修改参数属性值失败')
                    }
                    this.$message.success('修改参数属性值成功')
                    row.inputVisible = false
            },

            //点击New Tag按钮变为input输入框
            showInput(row) {
                row.inputVisible = true
                //$nextTick,先渲染页面，再获取焦点
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            //删除参数属性的方法
            handleClose(i, row){
                row.attr_vals.splice(i, 1)
                //发起网络请求
                this.saveAttrVals(row)
            }
        },
        created() {
            this.getCateList()
        },
    }
</script>

<style scoped lang="less">
    .cat_opt {
        margin: 15px 0;
    }

    .el-cascader {
        margin-left: 10px;
    }

    .el-tag {
        margin: 7px;
    }

    .input-new-tag {
        width: 120px;
    }
</style>