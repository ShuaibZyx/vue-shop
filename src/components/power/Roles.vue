<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="roleList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdButtom', i1 === 0 ? 'bdTop' : '', 'vcenter']"
                            v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 第一列用来渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}
                                </el-tag>
                                <i class=" el-icon-caret-right"></i>
                            </el-col>
                            <!-- 第二列用来渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环嵌套渲染二级权限 -->
                                <el-row :class="[i2 === 0 ? '' : 'bdTop', 'vcenter']"
                                    v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <!-- 二级权限 -->
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">
                                            {{item2.authName}}</el-tag>
                                        <i class=" el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id"
                                            closable @close="removeRightById(scope.row, item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="290px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">
                            编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="removeRoleById(scope.row.id)">删除</el-button>
                        <el-tooltip effect=" dark" content="分配权限" placement="top" :enterable="false" :open-delay="500"
                            :hide-after="3000">
                            <el-button type="warning" icon="el-icon-setting" size="mini"
                                @click="showSetRightDialog(scope.row)">分配权限
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分配权限对话框Dialog -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="40%" @close="setRightDialogClosed">
            <!-- 树型控件 -->
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRight">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加角色的Dialog对话框 -->
        <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
            <!-- 添加的dialog内容主体区 -->
            <el-form :model="addForm" ref="addFormRef" label-width="80px">
                <el-form-item label="角色名" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 添加的dialog底部按钮区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑角色的Dialog对话框 -->
        <el-dialog title="修改角色信息" :visible.sync="editRoleDialogVisible" width="40%" @close="editRoleDialogClosed">
            <!-- 修改的dialog内容主体区 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>

            <!-- 修改的dialog底部按钮区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'name',
        data() {
            return {
                //所有角色列表数据
                roleList: [],
                //所有权限数据
                rightsList: [],
                //默认选中的节点id值数组
                defKeys: [],
                //修改角色时用来暂时存放信息的数组
                editForm: [],
                //添加角色时编辑框中的内容展示和修改所用对象
                addForm: {
                    roleName: '',
                    roleDesc: ''
                },
                //验证编辑时输入的内容是否符合规则
                editFormRules: {
                    roleName: [
                        {required: true, message: "请输入角色名", trigger: "blur" }
                    ]
                },
                //树型控件的展示属性绑定对象,children代表层级，label代表展示的名字
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                //控制分配权限对话框的显示与隐藏
                setRightDialogVisible: false,
                //控制添加角色对话框的显示与隐藏
                addRoleDialogVisible: false,
                //控制编辑角色对话框的显示与隐藏
                editRoleDialogVisible: false,
                //当前选中行的角色id
                roleId: ''
            }
        },
        methods: {
            //获取所有角色列表
            async getRolesList() {
                const { data: res } = await this.$http.get('roles')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取用户角色列表失败')
                }
                //将获取到的用户角色列表信息赋值给roleList
                this.roleList = res.data
            },

            //监听添加角色对话框dialog的关闭事件
            addRoleDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },

            //点击按钮添加角色预校验方法
            async addRole() {
                //验证通过发起添加用户的网络请求
                const { data: res } = await this.$http.post('roles', this.addForm)
                if (res.meta.status !== 201) {
                    this.$message.error('添加角色失败')
                } else {
                    //显示成功消息
                    this.$message.success('添加角色成功')
                    //将dialog对话框关闭
                    this.addRoleDialogVisible = false
                    //重新渲染用户列表
                    this.getRolesList()
                }

            },

            //展示修改角色的dialog对话框
            async showEditDialog(id) {
                const { data: res } = await this.$http.get('roles/' + id)
                if (res.meta.status !== 200) {
                    return this.$message.error('查询角色信息失败')
                }
                this.editForm = res.data
                this.editRoleDialogVisible = true
            },

            //监听修改角色对话框dialog的关闭事件
            editRoleDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },

            //点击修改按钮修改角色信息预校验方法
            async editRole() {
                const { data: res } = await this.$http.put('roles/' + this.editForm.roleId,
                    {
                        roleName: this.editForm.roleName,
                        roleDesc: this.editForm.roleDesc
                    })
                if (res.meta.status !== 200) {
                    return this.$message.error('更新角色信息失败')
                } else {
                    //关闭对话框
                    this.editRoleDialogVisible = false
                    //刷新数据列表
                    this.getRolesList()
                    //提示修改成功
                    this.$message.success('更新角色信息成功')
                }
            },

            //根据id删除角色信息的方法
            async removeRoleById(id) {
                //弹框询问用户是否删除数据
                const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                //如果用户点击确认，返回值为字符串‘confirm’
                //如果用户点击取消，返回值为字符串‘cancel’
                if (confirmResult !== 'confirm') {
                    return this.$message('已取消删除该角色')
                }
                const { data: res } = await this.$http.delete('roles/' + id)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除角色信息失败')
                }
                this.$message.success('删除角色成功')
                this.getRolesList()
            },

            //根据权限id来删除该权限
            async removeRightById(role, rightId) {
                //弹框提示用户是否要删除
                const confirmResult = await this.$confirm('此操作将永久删除该角色此权限？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }
                const { data: res } = await this.$http.delete(`roles/${ role.id }/rights/${ rightId }`)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除权限失败')
                }
                this.$message.success('已删除该权限')
                role.children = res.data
                //调用以下方法来重新渲染会导致页面关闭展开状态导致用户体验不佳
                /* this.getRolesList() */
            },

            //展示分配权限的Dailog对话框
            async showSetRightDialog(role) {
                this.roleId = role.id
                //获取所有权限的数据
                const { data: res } = await this.$http.get('rights/tree')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取权限失败')
                }
                //将获取到的权限数据保存在rightsList中
                this.rightsList = res.data
                //递归回去三级节点的id
                this.getLeafKeys(role, this.defKeys)
                this.setRightDialogVisible = true
            },

            //通过递归的方式，获取角色下所有三级角色的id，并保存到defKeys数组中
            getLeafKeys(node, arr) {
                //如果当前node节点不包含children属性，它是三级节点
                if (!node.children) {
                    return arr.push(node.id)
                }
                node.children.forEach(item => {
                    this.getLeafKeys(item, arr)
                });
            },

            //当分配权限对话框关闭时清空当前在defKeys数组中保存的id，以免造成该数组中的id越来越多的错误
            setRightDialogClosed() {
                this.defKeys = []
            },

            //点击确定后获取当前选中的id而实现分配权限
            async allotRight() {
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                const idStr = keys.join(',')
                const { data: res } = await this.$http.post(`roles/${ this.roleId }/rights`, { rids: idStr })
                if (res.meta.status !== 200) {
                    return this.$message.error('分配权限失败')
                }
                this.$message.success('分配权限成功')
                this.getRolesList()
                this.setRightDialogVisible = false
            }
        },
        created() {
            this.getRolesList()
        },

    }
</script>

<style scoped lang="less">
    .el-tag {
        margin: 7px;
    }

    .bdTop {
        border-top: 1px solid #eee;
    }

    .bdButtom {
        border-bottom: 1px solid #eee
    }

    /* 设置展示权限列表区域tag在每一行纵向居中对齐 */
    .vcenter {
        display: flex;
        align-items: center;
    }
</style>