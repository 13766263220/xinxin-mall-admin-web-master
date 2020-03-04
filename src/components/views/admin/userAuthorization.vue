<template>
    <div class="table">
        
        <div class="container">
            <!-- 页面内容区begin -->
            <div id="app">
                <div style=" width:53%;float:left;">
                    <div>
                        角色名称：
                        <el-input v-model="s_rolename" label="角色名称" placeholder="角色名称" style="width:160px; heght:30px;" size="mini"></el-input>
						
						<el-button type="success" icon="el-icon-search" @click="getResult(1)" size="mini">搜索</el-button>
						<el-button type="success" icon="el-icon-document-add" @click="showAddRoleInfo()" size="mini">添加</el-button>
						<el-dialog
							:title="roleDialogParam.title"
							:visible.sync="roleDialogParam.show"
							width="400px"
							@close="roleDialogClose"
						>	
							<el-form 
							label-width="80px" 
							:model="roleFormParam"
							:rules="roleFormParamRules"
							ref="roleFormParam"
							>
							  <el-form-item label="角色名称" prop="name">
							    <el-input v-model="roleFormParam.name"></el-input>
							  </el-form-item>
							  <el-form-item label="角色描述" prop="description">
							    <el-input v-model="roleFormParam.description"></el-input>
							  </el-form-item>
							</el-form>
							<span slot="footer" class="dialog-footer">
								<el-button @click="roleDialogParam.show = false" size="mini">取 消</el-button>
								<el-button v-show="roleDialogParam.title == '添加'" type="primary" @click="addRoleInfo()" size="mini">添加</el-button>
								<el-button v-show="roleDialogParam.title == '修改'" type="primary" @click="editRoleInfo()" size="mini">修改</el-button>
							</span>
						</el-dialog>
						<br /><br />
                    </div>

                    <!--表格数据及操作-->
                    <el-table 
						:data="tableData" 
						class="mgt20" 
						border 
						style="width: 100%" 
						stripe ref="multipleTable" 
						tooltip-effect="dark" 
						@row-click="clickRow"
						v-loading='listLoading'
						>
                        <!--勾选框-->
                        <el-table-column type="selection" width="55">
                            <template slot-scope="scope">
                                <el-radio v-model="curentroleid" :label="scope.row.id">{{null}}</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="id" label="编号" width="75" sortable>
                        </el-table-column>
                        <el-table-column prop="name" label="角色名称" width="120">
                        </el-table-column>
                        <el-table-column prop="description" label="角色描述" width="183px">
                        </el-table-column>
						<el-table-column
						  label="操作"
						  width="150">
						 <template slot-scope="scope">
							<el-button size="mini" @click.stop="showEditRoleInfo(scope.row)">修改</el-button>
							<el-button size="mini" @click.stop="delRoleInfo(scope.row.id)">删除</el-button>
						</template>
						</el-table-column>
                    </el-table>
                    <br>
                    <br>
                    <!--分页条total, sizes, prev, pager, next, jumper-->
                    <el-pagination 
						@size-change="handleSizeChange" 
						@current-change="getResult" 
						:current-page="currentPage" 
						:page-size="pageSize" 
						layout="total,sizes,prev, pager, next" 
						:total="roletotal" 
						:page-sizes="[5,10]">
                    </el-pagination>
                </div>
                <div style=" width:40%;float:right;">
                    <el-button type="success" icon="el-icon-document-checked" @click="saveRoleacl" size="mini">保存</el-button>
                    <br /><br />
					<el-tree 
					:data="treeData" 
					show-checkbox 
					default-expand-all 
					node-key="id" 
					ref="tree" 
					highlight-current 
					:check-strictly='false'
					:props="defaultProps"
					>
                    </el-tree>
                </div>
            </div>
        </div>
        <!-- 页面内容区end-->
    </div>
    <!-- 页面表格end -->
</template>
<script>
export default {
    data() {
        return {
            tableData: [],//角色表格数据
            roleTypeData: [],
            treeData: [],//角色权限数据
            input: "",
            curentroleid: "",//点击的角色id(可用来判断用户是否选择了角色单选框)
            curentrow: null,//保存选中table里的角色
            //列表Loading加载   
            listLoading: false,
            roletotal: 0,
            currentPage: 1,
            pageSize: 10,
            //检索字段
            s_rolename: "",
            //     s_roleType:"",
            defaultProps: {
                children: 'child',
                label: 'name'
            },
			roleDialogParam:{
				title:'',
				show:false
			},
			roleFormParam:{//需要提交的表单数据
				name:'',
				description:''
			},
			roleFormParamRules:{
				name:[{ required: true, message: "请输入角色名称", trigger: "blur" }],
				description:[{ required: true, message: "请输入角色描述", trigger: "blur" }]
			}

        }
    },
	mounted() {
        //获取列表
        this.getResult();//获取所有角色
        this.getresourceData();//获取所有权限
    },
    methods: {
        getResult(pageNum) {//获得所有角色信息
			if(pageNum != null){
				this.currentPage = pageNum
			}
			this.listLoading = true
			this.$http.get('/api/role/'+this.currentPage+'-'+this.pageSize,{
				params:{
					name:this.s_rolename
				}
			})
			.then(response =>{
				console.log(response.data)
				this.tableData = response.data.data.list
				this.roletotal = response.data.data.total
				this.listLoading = false
			})
        },
        handleSizeChange(val) {//改变每一页数量
            this.pageSize = val;
            this.getResult(1);
        },
        getresourceData() {//获得所有的权限信息
			this.$http.get('/api/node')
			.then(response => {
				console.log(response.data)
				if(response.data.code == 200){
					this.treeData = response.data.data
				}
			})
        },
        clickRow(row){//选择table里的角色
			this.roleuserSelect = [];
			this.curentroleid = row.id;
			this.curentrow = row;
			
			this.$http.get('/api/node/byRoleId',{params:{roleId:this.curentroleid}})
			.then(response => {
				console.log(response.data)
				var list = [];
				response.data.data.forEach(item => {
					if(item.pid != 0){
						list.push(item.id);
					}
				});
				//alert(list)
				this.$refs.tree.setCheckedKeys(list);

			})
        },

        saveRoleacl() {//点击保存时
            if (this.curentroleid == "") {
				this.$notify({
				  title: '警告',
				  message: '请选择要添加的角色，单击选择行',
				  type: 'warning'
				});
				return ;
            }
			//获取节点
			var checkedKeys = this.$refs.tree.getCheckedKeys()//获得选中的
			var halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();//获得自动选中的父节点
			//整合节点
			var sellist = [];
			checkedKeys.forEach(item=>{sellist.push(item)})
			halfCheckedKeys.forEach(item=>{sellist.push(item)})
			// alert(sellist)
			// return
			//整理成服务器需要的对象
			var roleNodes = [];
			sellist.forEach(item => {
				roleNodes.push({roleId:this.curentroleid,nodeId:item})
			})
			
			//上传给服务器
			this.$http.post('/api/roleNode',roleNodes)
			.then(response => {
				console.log(response.data)
				if(response.data.code == '200'){
					this.$notify({
					  title: '成功',
					  message: response.data.msg,
					  type: 'success'
					});
					return ;
				}
			})
			
        },
		showAddRoleInfo(){//打开添加角色
			this.roleDialogParam.show = true
			this.roleDialogParam.title = '添加'
		},
		addRoleInfo(){//确认添加角色
			this.$http.post('/api/role',this.roleFormParam)
			.then(response=>{
				console.log(response.data)
				if(response.data.code == '200'){
					this.$notify({
					  title: '成功',
					  message: response.data.msg,
					  type: 'success'
					});
					this.getResult();
					this.roleDialogParam.show = false
				}
			})
			
		},
		showEditRoleInfo(roleInfo){//打开修改角色
			this.roleDialogParam.show = true
			this.roleDialogParam.title = '修改'
			this.roleFormParam = roleInfo
		},
		editRoleInfo(){//确认修改角色
			this.$http.put('/api/role',this.roleFormParam)
			.then(response=>{
				console.log(response.data)
				if(response.data.code == '200'){
					this.$notify({
					  title: '成功',
					  message: response.data.msg,
					  type: 'success'
					});
					this.getResult();
					this.roleDialogParam.show = false
				}
				
			})
		},
		roleDialogClose(){//关闭添加角色
			this.$refs['roleFormParam'].resetFields();//清空对话框里面的值
		},
		delRoleInfo(id){//删除角色
			this.$http.delete('/api/role/'+id)
			.then(response=>{
				console.log(response.data)
				if(response.data.code == '200'){
					this.$notify({
					  title: '成功',
					  message: response.data.msg,
					  type: 'success'
					});
					this.getResult();
				}else if(response.data.code == '500'){
					this.$notify({
					  title: '错误',
					  message: response.data.msg,
					  type: 'error'
					});
				}
				
			})
		}

    },
    
};
</script>
<style scoped="scoped">
/* #app {
        font-family: Helvetica, sans-serif;
        text-align: center;
    } */

#roleuser {
    font-family: Helvetica, sans-serif;
    text-align: center;
}

el-input {
    width: 200px;
    height: 50px;
}
</style>
