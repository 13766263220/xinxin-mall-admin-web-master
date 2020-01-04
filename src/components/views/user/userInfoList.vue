<template>
	<div>
		<!-- 筛选搜索 start -->
		<div style="border:1px #ebeef5 solid;margin-bottom: 20px;border-radius: 10px">
			<br />
			<i class="el-icon-search" style="margin-left: 20px;margin-right: 5px;"></i><span>筛选搜索</span>
			
			<el-button @click="onSearchResult()" size="small" style="float: right;margin-right: 20px;margin-top: -5px;" type="primary">查询结果</el-button>
			<el-button @click="resetSearch()" size="small" style="float: right;margin-right: 20px;margin-top: -5px;">重置</el-button>
			<br /><br />
			
			<div style="margin-left: 100px;">
				<el-form
					:inline="true"
					:model="userFormQuery"
					ref="userFormQuery"
					class="demo-form-inline"
					@submit.native.prevent
				>
					<el-form-item label="用户名称:" prop="name">
						<span style="margin-left: 10px;"></span>
						<el-input v-model="userFormQuery.name" placeholder="请输入用户名称" size="small" style="width: 200px;"></el-input>
					</el-form-item>
					<span style="margin-left: 30px;"></span>
					<el-form-item label="手机号码:" prop="phone">
						<span style="margin-left: 10px;"></span>
						<el-input v-model="userFormQuery.phone" placeholder="请输入手机号码" size="small" style="width: 200px;"></el-input>
					</el-form-item>
					<br />
					<el-form-item label="用户地址:" prop="address">
						<span style="margin-left: 10px;"></span>
						<el-input v-model="userFormQuery.address" placeholder="请输入用户地址" size="small" style="width: 200px;"></el-input>
					</el-form-item>
					<span style="margin-left: 30px;"></span>
					<el-form-item  label="用户状态:" >
						<span style="margin-left: 10px;"></span>
						<el-select  v-model="userFormQuery.status" placeholder="请选择" size="small" style="width: 200px;">
							<el-option :key="1" label="可用" value="1"></el-option>
							<el-option :key="0" label="不可用" value="0"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<!-- 筛选搜索 end -->
		
		<el-table
		:data="userPageInfo.list"
		border
		align="center"
		style="width: 100%;border-radius: 10px"
		v-loading="userTable.loading"
		ref="userTable"
		>
			<el-table-column
			  prop="id"
			  label="编号"
			  width="80">
			</el-table-column>
			<el-table-column
			  prop="name"
			  label="用户名称"
			  width="140">
			</el-table-column>
			<el-table-column
			  prop="sex"
			  label="性别"
			  width="120">
			  <template slot-scope="scope">
					<span v-if="scope.row.sex == 0">女</span>
					<span v-else-if="scope.row.sex == 1">男</span>
			  </template>
			</el-table-column>
			<el-table-column
			  prop="phone"
			  label="用户电话"
			  width="160">
			</el-table-column>
			<el-table-column
			  prop="address"
			  label="用户地址"
			  width="200"
			  :show-overflow-tooltip="true"
			  >
			</el-table-column>
			<el-table-column
			  prop="registrationTime"
			  label="注册时间"
			  width="200">
			</el-table-column>
			<el-table-column
			 prop="status"
			  label="用户状态(可用/不可用)"
			  width="200">
			  <template slot-scope="scope">
				  <el-switch
				  v-model="scope.row.status"
				  active-color="#409eff"
				  inactive-color="#dcdfe6"
				  :active-value="1"
				  :inactive-value="0"
				  @change="statusChange(scope.row)"
				  >
				  </el-switch>
			  </template>
			</el-table-column>
			
		</el-table>
		<!--分页 start-->
		<div>
			<el-pagination
			style="float: right;"
			  background
			  layout="total, sizes, prev, pager, next, jumper"
			  :total="userPageInfo.total"
			  :current-page="userPageInfo.pageNum"
			  @current-change="handlePageNumChange"
			  :page-size="userPageInfo.pageSize"
			  @size-change="handlePageSizeChange"
			  :page-sizes="[5,10,15]"
			  >
			</el-pagination>
		</div>
		<!--分页 end-->
	</div>
</template>

<script>
	export default{
		mounted(){
			this.queryUserAll();
		},
		methods:{
			queryUserAll(){
				var data={
					pageNum:this.userPageInfo.pageNum,
					pageSize:this.userPageInfo.pageSize
				}
				
				this.userTable.loading = true;
				//查询post请求
				var url ='/api/userInfo/' 
							+ data.pageNum + '-' + data.pageSize + "?" 
							+ this.$qs.stringify(this.userFormQuery);
				this.$http
				.get(url)
				.then(response => {
					console.log(response.data)
					this.userPageInfo = response.data.data;
				})
				.catch(error => {
				  	//弹出消息框
				  	this.$message({
						message: '服务器异常',
						type: 'error'
				  	});
				})
				.finally(() => {
					this.userTable.loading = false;
				});
			},
			statusChange(userInfo){
				//查询post请求
				this.$http
				.put('/api/userInfo',userInfo)
				.then(response => {
					console.log(response.data)
					if(response.data.code == 200){
						//弹出消息框
						this.$message({
							message: '编辑成功',
							type: 'success'
						});
					}else{
						//弹出消息框
						this.$message({
							message: '编辑失败',
							type: 'error'
						});
					}
				})
				.catch(error => {
				  	//弹出消息框
				  	this.$message({
						message: '服务器异常',
						type: 'error'
				  	});
				})
			},
			handlePageNumChange(pageNum){//处理当前页发生变化
				this.userPageInfo.pageNum = pageNum;
				this.queryUserAll();
			},
			handlePageSizeChange(pageSize){//处理每一页数据数量发生变化
				this.userPageInfo.pageSize = pageSize;
				this.queryUserAll();
			},
			/* 筛选结果 start */
			onSearchResult(){//点击查询结果
				this.queryUserAll()
			},
			resetSearch(){// 筛选重置
				this.userFormQuery.name=null
				this.userFormQuery.phone=null
				this.userFormQuery.address=null
				this.userFormQuery.status=null
				this.queryUserAll()
			}
			/* 筛选结果 end */
		},
		data(){
			return {
				userPageInfo:{//用户分页信息
					pageNum:1,
					pageSize:10,
					total:1,
					list:[]
				},
				userTable:{
					loading:false //用户表格是否在加载
				},
				userFormQuery:{//用户查询信息
					name:null,
					phone:null,
					address:null,
					status:null
				}
			};
		}
	}
</script>

<style>
	.el-table td,.el-table th{
		text-align: center !important;/* table里子居中 */
	}
	
	/* 表格文本超出部分预览 start*/
	.el-tooltip__popper{
		max-width:20%;
	}
	.el-tooltip__popper,.el-tooltip__popper.is-dark{
		background:#202a35 !important;
	    color: rgb(191, 203, 217) !important;
	}
	/* 表格文本超出部分预览 end*/
</style>
