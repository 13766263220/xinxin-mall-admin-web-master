<template>
    <div class="table">
        
        <div class="container">
            <!-- 页面内容区begin -->
            <div id="app">
                <div style=" width:40%;float:left;">
                    <div>
                        角色名称：
                        <el-input v-model="s_rolename" label="角色名称" placeholder="角色名称" style="width:160px; heght:30px;" size="mini"></el-input>
						
						<el-button type="success" icon="el-icon-search" @click="getResult(1)" size="mini">搜索</el-button>
						
						<br /><br />
                    </div>

                    <!--表格数据及操作-->
                    <el-table 
						:data="tableData"
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
                <div style=" width:40%;float:left;margin-left: 50px;">
					<div>
					    
						<el-button type="success" icon="el-icon-search" @click="queryAdminAll()" size="mini">查询所有</el-button>
						<el-button v-show="!adminIsAll" type="success" icon="el-icon-document-add" @click="showAddRoleAdmin()" size="mini">往此角色添加用户</el-button>
						<el-dialog
							title="添加用户"
							:visible.sync="addRoleAdminDialogParam.show"
							@close="closeAddRoleAdmin"
							width="400px"
						>	
							<el-table
								:data="addRoleAdminTable"
								style="width: 100%" 
								stripe ref="addRoleAdminTable" 
								tooltip-effect="dark"
								v-loading='addRoleAdminTableLoading'
								>
							    <el-table-column prop="id" label="编号" width="75" sortable>
							    </el-table-column>
							    <el-table-column prop="userName" label="用户名" width="126">
							    </el-table-column>
								
								<el-table-column
								  label="操作"
								  width="158"
								  align="center"
								  v-if="adminIsAll == false">
								 <template slot-scope="scope">
									<el-button size="mini" @click.stop="addRoleAdmin(scope.row)">添加</el-button>
								</template>
								</el-table-column>
							</el-table>
						</el-dialog>
						<br /><br />
					</div>
					
                    <el-table
                    	:data="adminInfoPage.list"
                    	style="width: 100%" 
                    	stripe ref="adminTable" 
                    	tooltip-effect="dark"
                    	v-loading='listLoading'
                    	>
                        <el-table-column prop="id" label="编号" width="75" sortable align="center">
                        </el-table-column>
                        <el-table-column prop="userName" label="用户名" width="180" align="center">
                        </el-table-column>
						
						<el-table-column
						  label="操作"
						  width="177"
						  align="center"
						  v-if="adminIsAll == false">
						 <template slot-scope="scope">
							<el-button size="mini" @click.stop="delRoleAdmin(scope.row)">移除</el-button>
						</template>
						</el-table-column>
                    </el-table>
					<!--分页条total, sizes, prev, pager, next, jumper-->
					<el-pagination 
						@current-change="changeAdminPage" 
						:current-page="adminInfoPage.pageNum" 
						:page-size="adminInfoPage.pageSize" 
						layout="total,prev, pager, next" 
						:total="adminInfoPage.total">
					</el-pagination>
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
            curentroleid: "",//点击的角色id(可用来判断用户是否选择了角色单选框)
            curentrow: null,//保存选中table里的角色
            //列表Loading加载   
            listLoading: false,
            roletotal: 0,
            currentPage: 1,
            pageSize: 10,
            //检索字段
            s_rolename: "",
			adminInfoPage:{
				pageNum:1,
				pageSize:10,
				total:0,
				list:[]
			},
			adminIsAll:true, //是否是所有用户
			addRoleAdminDialogParam:{
				show:false
			},
			addRoleAdminTable:[], //需要添加用户到角色的显示用户信息的表格
			addRoleAdminTableLoading:false,
        }
    },
	mounted() {
        //获取列表
        this.getResult();//获取所有角色
		//this.queryAdminAll();//查询所有管理员
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
		queryAdminAll(){//查询所有管理员
			this.adminIsAll = true
			this.$http.get('/adminInfo/getAll',{
				params:{
					pageNum:this.adminInfoPage.pageNum,
					pageSize:this.adminInfoPage.pageSize
				}
			})
			.then(response => {
				console.log(response.data)
				if(response.data.code == '200'){
					this.adminInfoPage = response.data.data
				}
			})
		},
		changeAdminPage(pageNum){//分页
			this.adminInfoPage.pageNum = pageNum
			if(this.adminIsAll){
				this.queryAdminAll();
			}else{
				this.clickRow();
			}
		},
        clickRow(row){//选择table里的角色
			if(row != null){
				this.curentroleid = row.id;
				this.curentrow = row;
			}
			this.adminIsAll = false
			this.$http.get('/adminInfo/getByRoleId',{
				params:{
					roleId:this.curentroleid,
					pageNum:this.adminInfoPage.pageNum,
					pageSize:this.adminInfoPage.pageSize
				}})
			.then(response => {
				console.log(response.data)
				if(response.data.code == '200'){
					this.adminInfoPage = response.data.data
				}
			})
        },
		//判断是否有该对象
		theSame(arr,item){//工具给下面的函数判断用的
			var result = false
			for (var i = 0; i < arr.length; i++) {
				if(arr[i].id == item.id){
					result = true;
				}
			}
			return result;
		},
		showAddRoleAdmin(){//打开添加角色中的用户模态框
			this.addRoleAdminDialogParam.show = true
			this.addRoleAdminTableLoading = true
			this.$http.get('/adminInfo/getAll')
			.then(response1 => {
				if(response1.data.code == '200'){
					var list1 = response1.data.data.list;
					this.$http.get('/adminInfo/getByRoleId',{
						params:{
							roleId:this.curentroleid
						}})
					.then(response2 => {
						if(response2.data.code == '200'){
							var list2 = response2.data.data.list
							var result = [];
							for (var i = 0; i < list1.length; i++) {
								if(!this.theSame(list2,list1[i])){
									result.push(list1[i])
								}
							}
							this.addRoleAdminTableLoading = false
							this.addRoleAdminTable = result;
						}
					})
				}
			})
		},
		closeAddRoleAdmin(){//关闭添加角色中的用户模态框
			this.addRoleAdminTable = []
			this.addRoleAdminTableLoading = false
		},
		addRoleAdmin(row){//确认添加
			var data = {
				adminId:row.id,
				roleId:this.curentroleid
			}
			this.$http.post('/api/roleAdmin',data)
			.then(response=>{
				if(response.data.code == 200){
					this.$notify({
					  title: '成功',
					  message: response.data.msg,
					  type: 'success'
					});
					this.clickRow() //查询所有管理员
					this.showAddRoleAdmin() //重新查一下弹出层的所有用户
				}
			})
		},
		delRoleAdmin(row){//确认移除
			var data = {
				adminId:row.id,
				roleId:this.curentroleid
			}
			this.$http.post('/api/roleAdminDel',data)
			.then(response=>{
				if(response.data.code == 200){
					this.$notify({
					  title: '成功',
					  message: response.data.msg,
					  type: 'success'
					});
					this.clickRow()//查询所有管理员
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
