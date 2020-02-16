<template>
	<div>
		<!-- 筛选搜索 start -->
		<div style="border:1px #ebeef5 solid;margin-bottom: 20px;border-radius: 10px">
			<br />
			<i class="el-icon-search" style="margin-left: 20px;margin-right: 5px;"></i><span>筛选搜索</span>
			
			<el-button @click="" size="small" style="float: right;margin-right: 20px;margin-top: -5px;" type="primary">查询结果</el-button>
			<el-button @click="" size="small" style="float: right;margin-right: 20px;margin-top: -5px;">重置</el-button>
			<br /><br />
			
			<div style="margin-left: 90px;">
				
			</div>
		</div>
		<!-- 筛选搜索 end -->
		
		<!-- 订单 表格 start -->
		<div>
			<!-- 表格 start -->
			<el-table
			:data="orderPageInfo.list"
			border
			align="center"
			style="width: 100%;border-radius: 10px"
			v-loading="orderTable.loading"
			ref="orderTable"
			>
				<el-table-column
				  prop="id"
				  label="编号"
				  width="80">
				</el-table-column>
				<el-table-column
				  prop="orderSn"
				  label="订单编号"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="createTime"
				  label="提交时间"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="userName"
				  label="用户账号"
				  width="120">
				</el-table-column>
				<el-table-column
				  prop="totalAmount"
				  label="订单金额"
				  width="120">
				  <template slot-scope="scope">
					<span>￥{{scope.row.totalAmount}}</span>
				  </template>
				</el-table-column>
				<el-table-column
				  prop="payType"
				  label="支付方式"
				  width="120">
				  <template slot-scope="scope">
						<span v-if="scope.row.payType == 0">未支付</span>
						<span v-else-if="scope.row.payType == 1">支付宝</span>
						<span v-else-if="scope.row.payType == 2">微信</span>
				  </template>
				</el-table-column>
				<el-table-column
				  prop="status"
				  label="订单状态"
				  width="120">
				  <template slot-scope="scope">
						<span v-if="scope.row.status == 0">待付款</span>
						<span v-else-if="scope.row.status == 1">待发货</span>
						<span v-else-if="scope.row.status == 2">已发货</span>
						<span v-else-if="scope.row.status == 3">已完成</span>
						<span v-else-if="scope.row.status == 4">已关闭</span>
				  </template>
				</el-table-column>
				<el-table-column
				  label="操作"
				  width="200">
				  <template slot-scope="scope">
					<el-button size="mini" @click="">查看订单</el-button>
					<el-button v-if="scope.row.status == 1" size="mini" @click="editOrderFrom(2,scope.row)">订单发货</el-button>
					<el-button v-else-if="scope.row.status == 3" type="danger" size="mini" @click="editOrderFrom(4,scope.row)">关闭订单</el-button>
				  </template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 订单 表格 end -->
		<!--分页 start-->
		<div>
			<el-pagination
			style="float: right;"
			  background
			  layout="total, sizes, prev, pager, next, jumper"
			  :total="orderPageInfo.total"
			  :current-page="orderPageInfo.pageNum"
			  @current-change="handlePageNumChange"
			  :page-size="orderPageInfo.pageSize"
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
			this.queryOrderAll();//查询所有订单信息
		},
		methods:{
			queryOrderAll(){
				var data={
					pageNum:this.orderPageInfo.pageNum,
					pageSize:this.orderPageInfo.pageSize
				}
				
				this.orderTable.loading = true;
				//查询post请求		  
				this.$http
				.post('/order/list',this.$qs.stringify(data))
				.then(response => {
					console.log(response.data)
					this.orderPageInfo = response.data.data;
				})
				.catch(error => {
				  	//弹出消息框
				  	this.$message({
						message: '服务器异常',
						type: 'error'
				  	});
				})
				.finally(() => {
					this.orderTable.loading = false;
				});
			},
			handlePageNumChange(pageNum){//处理当前页发生变化
				this.orderPageInfo.pageNum = pageNum;
				this.queryOrderAll();
			},
			handlePageSizeChange(pageSize){//处理每一页数据数量发生变化
				this.orderPageInfo.pageSize = pageSize;
				this.queryOrderAll();
			},
			editOrderFrom(status,orderForm){//修改订单状态
				var confirm = null;
				if(status == 2){
					confirm = this.$confirm('确认要进行发货?', '提示', {
						confirmButtonText: '确认',
						cancelButtonText: '取消',
						type: 'warning'
					})
				}else if(status == 4){
					confirm = this.$confirm('确认要关闭订单?', '提示', {
						confirmButtonText: '确认',
						cancelButtonText: '取消',
						type: 'warning'
					})
				}
			
				confirm.then(() => {
				  orderForm.status = status;
				  this.$http.put('/order/editOrderInfo',orderForm)
				  .then(request => {
				  	console.log(request.data)
				  	if(request.data.code == '200'){
				  		this.$message({
				  			message: '操作成功',
				  			type: 'success'
				  		});
				  		//刷新一遍
				  		this.queryOrderAll()
				  	}
				  })
				}).catch(() => {
				  //（不做任何操作） 
				});
			
				
			}
		},
		data(){
			return {
				orderPageInfo:{//订单分页信息
					pageNum:1,
					pageSize:10,
					total:1,
					list:[],
				},
				orderTable:{ 
					loading:false //订单表格是否在加载中
				}
			}
		}
	}
</script>

<style>
	.el-table td,.el-table th{
		text-align: center !important;/* table里子居中 */
	}
</style>
