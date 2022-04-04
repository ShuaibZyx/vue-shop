<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 提示区域 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
            </el-alert>
            <!-- 步骤条区 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容(完成)"></el-step>
            </el-steps>

            <!-- tab区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave"
                    @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称:" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格:" prop="goods_price" type="number">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量:" prop="goods_weight" type="number">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量:" prop="goods_number" type="number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <!-- 分类列表级联选择器 -->
                        <el-form-item label="商品分类:" prop="goods_cat">
                            <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProps"
                                @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染表单的item项 -->
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- action表示图片上传地址 -->
                        <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"
                            list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <!-- 添加商品的按钮 -->
                        <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- 图片预览所用Dialog对话框 -->
        <el-dialog title="预览图片" :visible.sync="previewDialogVisible" width="40%">
            <img :src="previewPath" alt="预览图片" class="previewImg">
            <span slot="footer" class="dialog-footer">
                <el-button @click="previewDialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Add",
        data() {
            return {
                //step步骤激活状态
                activeIndex: '0',
                //上传图片所用的url地址
                uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
                //预览图片时图片的绝对地址
                previewPath: '',
                //图片上传组件的header请求头
                headerObj: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                //添加商品的表单对象
                addForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    //商品所属的分类数组
                    goods_cat: [],
                    //保存图片的数组
                    pics: [],
                    //商品内容详情描述
                    goods_introduce: '',
                    attrs: []
                },
                //级联选择器配置项
                cateProps: {
                    expandTrigger: 'hover',
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
                },
                //商品分类列表
                cateList: [],
                //静态属性列表数组
                onlyTableData: [],
                //动态参数列表数组
                manyTableData: [],
                //添加商品时的input框中的校验规则
                addFormRules: {
                    goods_name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    goods_price: [
                        { required: true, message: '请输入商品价格', trigger: 'blur' }
                    ],
                    goods_weight: [
                        { required: true, message: '请输入商品重量', trigger: 'blur' }
                    ],
                    goods_number: [
                        { required: true, message: '请输入商品数量', trigger: 'blur' }
                    ],
                    goods_cat: [
                        { required: true, message: '请选择商品分类', trigger: 'blur' }
                    ]
                },
                //控制图片预览dialog对话框状态
                previewDialogVisible: false
            };
        },
        computed: {
            cateId() {
                if (this.addForm.goods_cat.length === 3) {
                    return this.addForm.goods_cat[2]
                }
                return null
            }
        },
        methods: {
            //获取所有商品分类数据
            async getCateList() {
                const { data: res } = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类数据失败')
                }
                this.cateList = res.data
            },

            //级联选择器选中项发生变化触发此方法
            handleChange() {
                if (this.addForm.goods_cat.length !== 3) {
                    this.addForm.goods_cat = []
                    this.$message.warning('请选择三级分类哦')
                }
                this.$refs.elCascader.dropDownVisible = false
            },

            //离开tab时触发的方法
            beforeTabLeave(activeName, oldActiveName) {
                if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                    this.$message.warning('请选择商品分类')
                    return false
                }
                if (this.addForm.goods_name === '') {
                    this.$message.warning('请输入商品名称')
                    return false
                }
                return true
            },

            //点击tab时触发的方法
            async tabClicked() {
                if (this.activeIndex === '1') {
                    //访问动态参数面板
                    const { data: res } = await this.$http.get(`categories/${ this.cateId }/attributes`, {
                        params: { sel: 'many' }
                    })
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取动态参数列表失败')
                    }
                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
                    });
                    this.manyTableData = res.data
                } else if (this.activeIndex === '2') {
                    const { data: res } = await this.$http.get(`categories/${ this.cateId }/attributes`, {
                        params: { sel: 'only' }
                    })
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取静态属性列表失败')
                    }
                    this.onlyTableData = res.data
                }

            },

            //处理图片预览事件
            handlePreview(file) {
                this.previewPath = file.response.data.url
                this.previewDialogVisible = true
            },

            //处理移除图片的操作
            handleRemove(file) {
                //1.获取将要删除的图片路径
                const filePath = file.response.data.tmp_path
                //2.从pics数组中找到该图片的索引
                const i = this.addForm.pics.findIndex(x => {
                    x.pic === filePath
                })
                //3.调用splice方法把图片对象从数组中移除
                this.addForm.pics.splice(i, 1)
                this.$message.info('图片已移除')
            },

            //图片上传成功触发方法
            handleSuccess(response) {
                //1.拼接得到一个图片信息对象
                const picInfo = {
                    pic: response.data.tmp_path
                }
                //2.将图片信息对象push到pics数组中
                this.addForm.pics.push(picInfo)
                this.$message.success('图片上传成功')
            },

            //添加商品方法
            addGoods() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) {
                        return this.$message.error('请填写必要的表单项')
                    }
                    //执行添加的业务逻辑
                    const tempForm = JSON.parse(JSON.stringify(this.addForm))
                    tempForm.goods_cat = tempForm.goods_cat.join(',')
                    //处理动态参数和静态属性
                    this.manyTableData.forEach(item =>{
                        const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals.join(',')}
                        this.addForm.attrs.push(newInfo)
                    })
                    this.onlyTableData.forEach(item =>{
                        const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals}
                        this.addForm.attrs.push(newInfo)
                    })
                    tempForm.attrs = this.addForm.attrs
                    //发起网络请求添加商品,商品名称必须唯一
                    const {data: res} = await this.$http.post('goods', tempForm)
                    if(res.meta.status !== 201){
                        return this.$message.error('添加商品失败')
                    }
                    this.$message.success('添加商品成功')
                    this.$router.push('/goods')
                })
            }

        },
        created() {
            this.getCateList()
        },
    };
</script>

<style scoped lang="less">
    .el-checkbox {
        margin: 0 10px 0 0 !important;
    }

    .previewImg {
        width: 100%;
    }

    .btnAdd {
        margin-top: 15px;
    }
</style>