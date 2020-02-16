<template>
	<div>
		<!-- 筛选搜索 start -->
		<div style="border:1px #ebeef5 solid;margin-bottom: 20px;border-radius: 10px">
			<br />
			<i class="el-icon-search" style="margin-left: 20px;margin-right: 5px;"></i><span>筛选搜索</span>
			
			<el-button @click="onSearchResult()" size="small" style="float: right;margin-right: 20px;margin-top: -5px;" type="primary">查询结果</el-button>
			<el-button @click="resetSearch()" size="small" style="float: right;margin-right: 20px;margin-top: -5px;">重置</el-button>
			<br /><br />
			
			<div style="margin-left: 90px;">
			<el-form
				:inline="true"
				:model="productFormQuery"
				ref="productFormQuery"
				class="demo-form-inline"
				@submit.native.prevent
			>
				<el-form-item label="商品名称:" prop="name">
					<span style="margin-left: 10px;"></span>
					<el-input v-model="productFormQuery.name" placeholder="请输入商品名称" size="small" style="width: 200px;"></el-input>
				</el-form-item>
				<span style="margin-left: 30px;"></span>
				
				<el-form-item label="商品类型:" >
					<span style="margin-left: 10px;"></span>
					<el-cascader
						size="small"
						v-model="productFormQuery.categoryInfo.value"
						:options="productFormQuery.categoryInfo.options"
						>
					</el-cascader>
				</el-form-item>
				<br />
				<el-form-item  label="商品品牌:" >
					<span style="margin-left: 10px;"></span>
					<el-select v-model="productFormQuery.brandInfo.value" placeholder="请选择" size="small" style="width: 200px;">
						<el-option
						  v-for="item in productFormQuery.brandInfo.options"
						  :key="item.id"
						  :label="item.name"
						  :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<span style="margin-left: 30px;"></span>
				<el-form-item  label="上架状态:" >
					<span style="margin-left: 10px;"></span>
					<el-select v-model="productFormQuery.publishStatus.value" placeholder="请选择" size="small" style="width: 200px;">
						<el-option :key="1" label="上架" value="1"></el-option>
						<el-option :key="0" label="下架" value="0"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			</div>
		</div>
		<!-- 筛选搜索 end -->
		
		<!-- 数据列表 start -->
		<div style="border:1px #ebeef5 solid;margin-bottom: 20px;border-radius: 10px">
			<br />
			<i class="el-icon-tickets" style="margin-left: 20px;margin-right: 5px;"></i><span>数据列表</span>
			<el-button @click="insertProduct()" size="small" style="float: right;margin-right: 20px;margin-top: -5px;">添加</el-button>
			<br /><br />
		</div>
		<!-- 数据列表 end -->
		
		<!-- 商品 表格 start -->
		<div>
			<!-- 表格 start -->
			<el-table
			@selection-change="changeFun"
			:data="productPageInfo.list"
			border
			align="center"
			style="width: 100%;border-radius: 10px"
			v-loading="productTableLoading"
			ref="productTable"
			>
				<el-table-column
				  fixed
				  type="selection"
				  width="50">
				</el-table-column>
				<el-table-column
				  prop="id"
				  label="商品编号"
				  width="80">
				</el-table-column>
				<el-table-column
				  prop="pic"
				  label="pic"
				  width="120">
				  <template slot-scope="scope">
					<div class="block">
						<el-image 
						:src="scope.row.pic"
						style="width: 80px;height: 80px;"
						>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline" style="font-size: 80px;"></i>
							</div>
						</el-image>
					</div>
				  </template>
				</el-table-column>
				<el-table-column
				  prop="name"
				  label="商品名称"
				  width="120">
				  <template slot-scope="scope">
					  <span>{{scope.row.name}}</span>
					  <br />
					  <div style="margin-top: 7px;">品牌：{{scope.row.productBrand.name}}</div>
				  </template>
				</el-table-column>
				<el-table-column
				  prop="productCategory"
				  label="类型"
				  width="120">
				  <template slot-scope="scope">
					  <span>{{scope.row.productCategory.parentCategoryName}}/{{scope.row.productCategory.name}}</span>
				  </template>
				</el-table-column>
				<el-table-column
				  prop="price"
				  label="价格"
				  width="120">
				  <template slot-scope="scope">
					<span>￥{{scope.row.price}}</span>
				  </template>
				</el-table-column>
				<el-table-column
				  label="标签"
				  width="140">
				  <template slot-scope="scope">
					 <br />
					<div>
					上架：<el-switch
					v-model="scope.row.publishStatus"
					active-color="#409eff"
					inactive-color="#dcdfe6"
					:active-value="1"
					:inactive-value="0"
					@change="statusChange(scope.row)"
					></el-switch>
					</div>
					<div style="margin-top: 15px;">
					新品：<el-switch
					v-model="scope.row.newStatus"
					active-color="#409eff"
					inactive-color="#dcdfe6"
					:active-value="1"
					:inactive-value="0"
					@change="statusChange(scope.row)"
					></el-switch>
					</div>
					<div style="margin-top: 15px;">
					推荐：<el-switch
					v-model="scope.row.recommandStatus"
					active-color="#409eff"
					inactive-color="#dcdfe6"
					:active-value="1"
					:inactive-value="0"
					@change="statusChange(scope.row)"
					>
					</el-switch>
					</div>
					<br />
				  </template>
				</el-table-column>
				<el-table-column
				  label="SKU库存"
				  width="100">
				  <template slot-scope="scope">
					<el-button @click="showStockDialog(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
				  </template>
				</el-table-column>
				<el-table-column
				  prop="sale"
				  label="销量"
				  width="100">
				  <template slot-scope="scope">
					<span v-if="scope.row.sale == null">0</span>
					<span v-else>{{scope.row.sale}}</span>
				  </template>
				</el-table-column>
				<!-- <el-table-column
				  prop="stock"
				  label="总库存"
				  width="100">
				  <template slot-scope="scope">
					<span v-if="scope.row.stock == null">0</span>
					<span v-else>{{scope.row.stock}}</span>
				  </template>
				</el-table-column> -->
				<el-table-column
				  label="操作"
				  width="160">
				  <template slot-scope="scope">
					<el-button @click="editProduct(scope.row)" size="mini" >编辑</el-button>
					<el-button @click="" type="danger" size="mini" >删除</el-button>
					
				  </template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 商品 表格 end -->
		<!--分页 start-->
		<div>
			<el-pagination
			style="float: right;"
			  background
			  layout="total, sizes, prev, pager, next, jumper"
			  :total="productPageInfo.total"
			  :current-page="productPageInfo.pageNum"
			  @current-change="handlePageNumChange"
			  :page-size="productPageInfo.pageSize"
			  @size-change="handlePageSizeChange"
			  :page-sizes="[5,10]"
			  >
			</el-pagination>
		</div>
		<!--分页 end-->
		
		<!-- 商品SKU库存 对话框 start -->
		<el-dialog
			title="SKU库存"
			:visible.sync="stockDialogParam.show"
			width="700px"
			@close="stockDialogClose"
		>	
			<div style="border:1px #ebeef5 solid;margin-bottom: 15px;margin-top: -15px ;border-radius: 10px">
				<br />
				<i class="el-icon-tickets" style="margin-left: 20px;margin-right: 5px;"></i>数据列表
				<el-button @click="onShowAddStock()" size="small" style="float: right;margin-right: 20px;margin-top: -5px;" >添加</el-button>
				<br /><br />
			</div>
			<!-- SKU库存编辑 start-->
			<el-dialog
				title="编辑SKU库存"
				:visible.sync="stockEditDialogParam.show"
				width="350px"
				@close="stockEditDialogClose"
				append-to-body
			>
				<el-form
					:inline="true"
					:model="stockAddForm"
					:rules="stockAddRules"
					ref="stockEditForm"
					class="demo-form-inline"
					@submit.native.prevent
				>	
					
					<el-form-item label="价格:" prop="price">
						<el-input v-model="stockAddForm.price" placeholder="商品价格" size="small" style="width: 300px;"></el-input>
					</el-form-item>
					<el-form-item label="预警库存:" prop="lowStock">
						<el-input v-model="stockAddForm.lowStock" placeholder="请输入商品库存" size="small" style="width: 300px;"></el-input>
					</el-form-item>
					
				</el-form>
				<span slot="footer" class="dialog-footer" style="">
					<el-button @click="stockEditDialogParam.show = false" size="mini">取 消</el-button>
					<el-button type="primary" @click="editStock()" size="mini">编辑</el-button>
				</span>
				
			</el-dialog>
			<!-- SKU库存编辑 end-->
			
			<!-- SKU库存添加 start-->
			<el-dialog
				title="添加SKU库存"
				:visible.sync="stockAddDialogParam.show"
				width="600px"
				@close="stockAddDialogClose"
				append-to-body
			>
				<el-form
					:inline="true"
					:model="stockAddForm"
					:rules="stockAddRules"
					ref="stockAddForm"
					class="demo-form-inline"
					@submit.native.prevent
				>	
					
					<el-form-item label="价格:" prop="price">
						<el-input v-model="stockAddForm.price" placeholder="商品价格" size="small" style="width: 300px;"></el-input>
					</el-form-item>
					<el-form-item label="商品库存:" prop="stock">
						<el-input v-model="stockAddForm.stock" placeholder="请输入商品库存" size="small" style="width: 300px;"></el-input>
					</el-form-item>
					<el-form-item label="预警库存:" prop="lowStock">
						<el-input v-model="stockAddForm.lowStock" placeholder="请输入商品库存" size="small" style="width: 300px;"></el-input>
					</el-form-item>
					<br />
					<h4 style="margin-left: 10px;">属性选择：
					<span v-show="stockAddDialogParam.productAttr.length == 0" style="color: #97a8be;">请前往商品分类添加属性</span>
					</h4>
					<br />
					<span :key="index" v-for="(attr,index) in stockAddDialogParam.productAttr" style="margin-left: 40px;">
						{{attr.name}}:<span style="margin-left:10px;"></span>
						<el-radio-group v-model="stockAddDialogParam.radio[index]" @change="changeAttrOptions(index)">
							<el-radio :key="key" v-for="(option,key) in attr.attrOptions" :label="option.name">{{option.name}}</el-radio>
						</el-radio-group>
						<br /><br />
					</span>
					<span style="margin-left: 10px;"></span>
					<el-form-item label="商品图片:">
						
						<el-upload 
							class="upload-demo" 
							ref="uploadIcon"
							action=""
							:limit="1"
							list-type="picture-card"
							:auto-upload="false"
							:on-preview="iconHandlePictureCardPreview"
							:on-remove="iconHandleRemove"
							:http-request='submitUpload'
							:file-list="stockAddForm.pic.iconImagelist"
							:class="{disabled:iconUploadDisabled}"
							:on-change="iconUploadChange"
							:on-success='iconOnSuccess'
							
							accept="image/jpeg,image/jpg,image/png"
							>
							<i class="el-icon-plus"></i>
						</el-upload>
							<el-button style="margin-left: 10px;" type="success" icon="el-icon-check" round size="small" @click="iconSubmitAssess()">上传到服务器</el-button>
							<!-- 大图查看 -->
							<el-dialog :visible.sync="stockAddForm.pic.dialogVisible" append-to-body>
								<img width="100%" :src="stockAddForm.pic.dialogImageUrl" alt="">
							</el-dialog>
					</el-form-item>
				</el-form>
				
				<span slot="footer" class="dialog-footer" style="">
					<el-button @click="stockAddDialogParam.show = false" size="mini">取 消</el-button>
					<el-button type="primary" @click="insertStock()" size="mini">添加</el-button>
				</span>
			</el-dialog>
			<!-- SKU库存添加 end-->
			
			<el-table
			:data="stockTable.stockInfo"
			border
			align="center"
			style="width: 100%;border-radius: 10px"
			v-loading="stockTable.loading"
			ref="stockTable"
			>
			<el-table-column
			  prop="id"
			  label="商品编号"
			  width="80">
			</el-table-column>
			
			<el-table-column v-for="(col ,index) in this.stockTable.stockCols"
				:prop="col.prop"
				:label="col.label"
				:key="index"
				width="100">
			</el-table-column>
			
			<el-table-column
			  prop="price"
			  label="价格"
			  width="80">
			  <template slot-scope="scope">
				  <!-- <el-input v-model="scope.row.price" size="small"></el-input> -->
				  <span>{{scope.row.price}}</span>
			  </template>
			</el-table-column>
			<el-table-column
			  prop="stock"
			  label="库存"
			  width="80">
			  <template slot-scope="scope">
			  	<!-- <el-input v-model="scope.row.stock" size="small"></el-input> -->
				<span>{{scope.row.stock}}</span>
			  </template>
			</el-table-column>
			<el-table-column
			  prop="lowStock"
			  label="库存预警"
			  width="80">
			  <template slot-scope="scope">
			  	<!-- <el-input v-model="scope.row.lowStock" size="small"></el-input> -->
				<span>{{scope.row.lowStock}}</span>
			  </template>
			</el-table-column>
			<el-table-column
			  label="操作"
			  width="160">
			  <template slot-scope="scope">
				<el-button size="mini" @click="onShowEidtStock(scope.row)">编辑</el-button>
				<el-button size="mini" @click="deleteStock(scope.row.id)">删除</el-button>
				
			  </template>
			</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer" style="">
				<el-button @click="stockDialogParam.show = false" size="mini">关闭</el-button>
				<el-button @click="stockDialogParam.show = false" type="primary" size="mini">确认</el-button>
			</span>
		</el-dialog>
		<!-- 商品SKU库存 对话框 end -->
		
		<!-- 添加模态框 start -->
		<el-dialog
			:title="productEditDialogParam.title"
			:visible.sync="productEditDialogParam.show"
			width="1000px"
			@close="handleDialogClose"
		>
			<el-form
				:inline="true"
				:model="productForm"
				ref="productForm"
				class="demo-form-inline"
				@submit.native.prevent
			>
				<el-form-item label="商品名称:" prop="name">
					<span style="margin-left: 10px;"></span>
					<el-input v-model="productForm.name" placeholder="请输入商品名称" size="small" style="width: 200px;"></el-input>
				</el-form-item>
				<span style="margin-left: 30px;"></span>
				
				<el-form-item label="商品价格:" prop="price">
					<span style="margin-left: 10px;"></span>
					<el-input v-model="productForm.price" placeholder="请输入商品价格" size="small" style="width: 200px;"></el-input>
				</el-form-item>
				<span style="margin-left: 30px;"></span>
				
				<el-form-item label="商品类型:" >
					<span style="margin-left: 10px;"></span>
					<el-cascader
						size="small"
						v-model="productForm.categoryInfo.value"
						:options="productForm.categoryInfo.options"
						>
					</el-cascader>
				</el-form-item>
				<br />
				<el-form-item  label="商品品牌:" >
					<span style="margin-left: 10px;"></span>
					<el-select v-model="productForm.brandInfo.value" placeholder="请选择" size="small" style="width: 200px;">
						<el-option
						  v-for="item in productForm.brandInfo.options"
						  :key="item.id"
						  :label="item.name"
						  :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<span style="margin-left: 30px;"></span>
				<el-form-item  label="上架状态:" >
					<span style="margin-left: 10px;"></span>
					<el-select v-model="productForm.publishStatus.value" placeholder="请选择" size="small" style="width: 200px;">
						<el-option :key="1" label="上架" value="1"></el-option>
						<el-option :key="0" label="下架" value="0"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogParam.show = false">取 消</el-button>
				<el-button  type="primary" @click="">添 加</el-button>
				<!-- <el-button  type="primary" @click="">编 辑</el-button> -->
			</span>
		</el-dialog>
		<!-- 添加模态框 end -->
	</div>
</template>

<script>
	export default{
		mounted (){//初始化
			this.queryProductAll();//查询所有商品信息
			this.queryCategoryAll();//查询所有商品分类信息
			this.queryBrandAll();//查询所有品牌
		},
		methods:{
			onSearch(url,data){//公用查询
				this.productTableLoading = true;			
				//查询post请求		  
				this.$http
				.post(url,this.$qs.stringify(data))
				.then(response => {
					console.log(response.data)
					this.productPageInfo = response.data.data;
				})
				.catch(error => {
				  	//弹出消息框
				  	this.$message({
						message: '服务器异常',
						type: 'error'
				  	});
				})
				.finally(() => {
					this.productTableLoading = false;
				});
			},
			queryProductAll(){//查询所有商品信息
				var data={
					pageNum:this.productPageInfo.pageNum,
					pageSize:this.productPageInfo.pageSize
				}
				this.onSearch('/product/list',data);
			},
			queryCategoryAll(){//查询所有商品分类
				//查询get请求
				this.$http
				.get('/category/getAll')
				.then(response => {
					console.log(response.data)
					//给下拉框赋值
					this.productFormQuery.categoryInfo.options = response.data.data;
					this.productForm.categoryInfo.options = response.data.data;
				})
				.catch(error => {
				  	//弹出消息框
				  	this.$message({
						message: '服务器异常',
						type: 'error'
				  	});
				})
			},
			queryBrandAll(){//查询所有品牌
				//查询get请求
				this.$http
				.get('/brand/getAll')
				.then(response => {
					console.log(response.data)
					
					//给下拉框赋值
					this.productFormQuery.brandInfo.options = response.data.data;
					this.productForm.brandInfo.options = response.data.data;
				})
				.catch(error => {
				  	//弹出消息框
				  	this.$message({
						message: '服务器异常',
						type: 'error'
				  	});
				})
			},
			changeFun(vals){//选勾选table选项发生的
				
			},
			handlePageNumChange(pageNum){//处理当前页发生变化
				this.productPageInfo.pageNum = pageNum;
				this.queryProductAll();
			},
			handlePageSizeChange(pageSize){//处理每一页数据数量发生变化
				this.productPageInfo.pageSize = pageSize;
				this.queryProductAll();
			},
			
			/* 筛选结果 start */
			
			onSearchResult(){//点击查询结果
				//获得数据
				var data = {
					pageNum:1,
					pageSize:this.productPageInfo.pageSize,
					product:{
						name:this.productFormQuery.name,//获得品牌名称
						categoryId:this.productFormQuery.categoryInfo.value[1],//获得类型id
						brandId:this.productFormQuery.brandInfo.value,//获得品牌id
						publishStatus:this.productFormQuery.publishStatus.value//获得品牌上架状态
					}
				}
				//table表格正在加载
				this.productTableLoading = true;
				//查询post请求		  
				this.$http
				.post('/product/getScreenAll',data)
				.then(response => {
					console.log(response.data)
					this.productPageInfo = response.data.data;
				})
				.catch(error => {
				  	//弹出消息框
				  	this.$message({
						message: '服务器异常',
						type: 'error'
				  	});
				})
				.finally(() => {
					//table表格停止加载
					this.productTableLoading = false;
				});
				
				
			},
			resetSearch(){//重置查询
				//this.$refs["productFormQuery"].resetFields();//清空对话框里面的值
				this.productFormQuery.name = null;
				this.productFormQuery.categoryInfo.value = [];
				this.productFormQuery.brandInfo.value = null;
				this.productFormQuery.publishStatus.value = null;
				this.onSearchResult();//再查一遍
			},
			
			/* 赛选结果 end */
			
			statusChange(product){//修改状态
				this.$http
				.post('/product/editProduct',product)
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
			
			
			/* 商品添加编辑 start */
			insertProduct(){//点击添加商品
				//登陆成功跳转主页
				this.$router.replace({ path: "/productAdd" });
				
				
				// this.productEditDialogParam.title = '添加商品';
				//this.productEditDialogParam.show = true;
			},
			editProduct(product){//点击编辑商品
				//登陆成功跳转主页
				//this.$router.replace({ path: "/productAdd" });
				this.$router.push({ name: 'productAdd', params: { edit: product } })
			},
			
			handleDialogClose(){//关闭添加框
				
			},
			/* 商品添加编辑 end */
			
			/* SKU库存 start */
			customField(data,cols){//自定义字段 data:数据  cols:保存自定义字段
				var infos = data;
				var result = data;
				//赋字段
				cols.length = 0; //清空字段
				
				for(var spec in JSON.parse(infos[0].productSpecs)){
					if(spec=='productId'){
						continue
					}
					
					cols.push({ label: spec, prop: spec})
				}
				//赋值
				for(var i in infos){
					var specs = JSON.parse(infos[i].productSpecs);
					for(var spec in specs){
						// if(i == 0){
						// 	continue
						// }
						
						result[i][spec] = specs[spec];//添加字段名和值
					}
				}
				
				return result;
			},
			queryStock(productId){//查询属性
				this.stockTable.loading = true;
				//查询post请求		  
				this.$http
				.post('/stock/getByProductId',this.$qs.stringify({productId:productId}))
				.then(response => {
					console.log(response.data.data)
					if(response.data.data.length != 0){
						//掉自定义组件
						var result = response.data.data;
						delete result.parentId;
						
						console.log(result)
						
						this.stockTable.stockInfo = this.customField(
							result,
							this.stockTable.stockCols
						);
					}else{
						this.stockTable.stockInfo = []
						this.stockTable.stockCols.length = 0; //清空字段
					}
					
				})
				.catch(error => {
				  	//弹出消息框
				  	this.$message({
						message: error,
						type: 'error'
				  	});
				})
				.finally(() => {
					this.stockTable.loading = false;
				});
			},
			showStockDialog(product){//打开SKU库存模态框
				this.stockDialogParam.show = true;
				
				//先把类型id存起,（用于查询属性）
				this.stockAddDialogParam.categoryId = product.categoryId;
				this.stockAddDialogParam.productId = product.id;
				
				this.queryStock(product.id);
				
			},
			stockDialogClose(){//SKU库存模态框关闭
				
			},
			
			
			onShowAddStock(){//打开添加模态框
				this.$http
				.post('/productAttr/list',this.$qs.stringify({categoryId:this.stockAddDialogParam.categoryId}))
				.then(response => {
					console.log(response.data)
					this.stockAddDialogParam.productAttr = response.data.data;
					if(this.stockTable.stockCols.length==0){//表示是第一条数据
						this.stockAddDialogParam.show = true;
						return;
					}
					if(this.stockAddDialogParam.productAttr.length == this.stockTable.stockCols.length){
						
						for(var i in this.stockTable.stockCols){
							if(this.stockTable.stockCols[i].label != this.stockAddDialogParam.productAttr[i].name){
								this.$message({
									message: '请确认商品属性是否正确',
									type: 'error'
								});
								alert()
								return;
							}
						}
						this.stockAddDialogParam.show = true;
					}else{
						this.$message({
							message: '请确认商品属性是否正确',
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
			stockAddDialogClose(){//关闭库存添加模态框
				this.stockAddDialogParam.radio = [];//清空选择项
				this.stockAddDialogParam.productSpecs = {};//清空真正要json的数据
				this.$refs["stockAddForm"].resetFields();//清空对话框里面的值
				
				this.$refs.uploadIcon.clearFiles();//清空logo图片
				//防止清空了图片，当imageList里面还有值的情况
				this.stockAddForm.pic.iconImagelist = [];
				
			},
			changeAttrOptions(attrIndex){//选择发生的事件

				var attrs = this.stockAddDialogParam.productAttr;
				this.stockAddDialogParam.productSpecs[attrs[attrIndex].name] = this.stockAddDialogParam.radio[attrIndex];
				
				
			},
			insertStock(){//确认添加sku发生
				this.$refs["stockAddForm"].validate(valid => {//判断校验是否成功
					if(valid){
						//判断是否选够属性
						if(Object.getOwnPropertyNames(this.stockAddDialogParam.productSpecs).length == this.stockAddDialogParam.productAttr.length+1){
							if(this.stockAddDialogParam.productAttr.length == 0){
								//弹出消息框
								this.$message({
									message: '请前往商品分类添加属性',
									type: 'warning'
								});
								return;
							}
							
							//属性按照中文排序
							var productSpecs = {};
							productSpecs.productId = this.stockAddDialogParam.productId;
							
							Object.keys(this.stockAddDialogParam.productSpecs).sort().map(key => {
							  productSpecs[key]=this.stockAddDialogParam.productSpecs[key]
							})
							console.log(productSpecs)
							
							var data={
								productId:this.stockAddDialogParam.productId,//商品id
								price:this.stockAddForm.price,//价格
								stock:this.stockAddForm.stock,//库存
								lowStock:this.stockAddForm.lowStock,//预警库存
								pic:this.stockAddForm.pic.iconPath,//商品图片
								productSpecs:JSON.stringify(productSpecs) //商品规格
							}
							
							this.$http
							.post('/stock/insertStock',data)
							.then(response => {
								console.log(response.data)
								if(response.data.code == 200){
									if(!response.data.data){
										//弹出消息框
										this.$message({
											message: '已有此数据',
											type: 'error'
										});
										return;
									}
									//弹出消息框
									this.$message({
									message: '添加成功',
									type: 'success'
									});
									
									this.stockAddDialogParam.show = false;//关闭添加框
									this.queryStock(this.stockAddDialogParam.productId);//查询一遍属性
									
									
								}else{
									//弹出消息框
									this.$message({
									message: '添加失败',
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
						}else{
							this.$message({
								message:'请选择属性',
								type:'warning'
							})
						}
					}
				})
				
			},
			/* 上传 start */
			iconSubmitAssess(){//点击上传至服务器
				if(this.stockAddForm.pic.iconImagelist.length>0){
					//图片上传
					this.$refs.uploadIcon.submit()
				}else{
					this.$message({
						message:'请选择上传图片',
						type:'info'
					})
				}
			},
			iconHandlePictureCardPreview(file) {//查看图片发生
			  this.stockAddForm.pic.dialogImageUrl = file.url;
			  this.stockAddForm.pic.dialogVisible = true;
			},
			iconUploadChange(file, fileList){//添加图片发生的事件
				this.stockAddForm.pic.iconImagelist=fileList;
			},
			iconHandleRemove(file, fileList) {//删除图片发生
			    console.log(file, fileList);
				this.stockAddForm.pic.iconImagelist=fileList;
			},
			iconOnSuccess(filePath){//上传成功(文件上传成功的回调)
				this.stockAddForm.pic.iconPath=filePath;
			},
			//调用this.$refs.upload.submit()就会调用此方法
			submitUpload: function(content) {//自定义的上传图片的方法（改变 <el-upload> 默认上传行为）
				//1. 创建formData 利用AXIOS传递
				let formData = new FormData;
				formData.append('myfile', content.file);
					console.log(content.file)
					let config = {
						'Content-Type': 'multipart/form-data'
					}
						this.$http
						.post('/file/upload', formData, config)
						.then(response => {
							console.log(response.data)
							if(response.data.code=="200"){
								//上传成功,给logoPath赋个路径(回调上传成功)
								content.onSuccess(response.data.data)
							}
						})
						.catch(error => {
							console.log(error);
							//弹出消息框
							this.$message({
								message: '服务器异常',
							 	type: 'error'
							});
						});
			},
			
			/* 上传end */
			
			
			deleteStock(id){/* SKU库存删除*/
				//查询post请求
				this.$http
				.post('/stock/deleteStockById',this.$qs.stringify({stockId:id}))
				.then(response => {
					console.log(response.data)
					if(response.data.code=='200'){
						//弹出消息框
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						
						this.queryStock(this.stockAddDialogParam.productId);//查询一遍属性
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
			
			onShowEidtStock(stock){/* 打开 SKU库存编辑  */
				
				this.stockEditDialogParam.show = true;
				this.stockEditDialogParam.id = stock.id;
				this.stockAddForm.price = stock.price;
				this.stockAddForm.lowStock = stock.lowStock;
			},
			stockEditDialogClose(){//关闭编辑框
				this.$refs["stockEditForm"].resetFields();//清空对话框里面的值
				// this.stockAddForm.price = 0;
				// this.stockAddForm.lowStock = 0;
			},
			editStock(){//确认编辑
				this.$refs["stockEditForm"].validate(valid => {//判断校验是否成功
					if(valid){
						var data={
							id:this.stockEditDialogParam.id,
							price:this.stockAddForm.price,
							lowStock:this.stockAddForm.lowStock
						}
						
						//查询post请求
						this.$http
						.post('/stock/editStock',data)
						.then(response => {
							console.log(response.data)
							if(response.data.code == '200'){
								this.$message({
									message: '编辑成功',
									type: 'success'
								});
								this.stockEditDialogParam.show = false; //关闭对话框 
								this.queryStock(this.stockAddDialogParam.productId);//查询一遍属性
							}
						})
						.catch(error => {
						  	//弹出消息框
						  	this.$message({
								message: '服务器异常',
								type: 'error'
						  	});
						})
					}
				})
			
				
			}
			
			
			/* SKU库存 end */
		},
		data(){
			return {
				productFormQuery:{//商品表单查询
					name:null,//商品名称
					categoryInfo:{//商品类型
						value:[],
						options:[]
					},
					brandInfo:{//商品品牌
						value:null,
						options:[]
					},
					publishStatus:{//上架状态
						value:null
					}
				},
				//添加
				productForm:{//insert into pms_product(name, price, pic, brand_id, product_category_id, sale, stock, low_stock, unit, publish_status, new_status, recommand_status, description)values ('华为 HUAWEI P20',3788,'http://localhost:8080/file/download?filename=华为pic.jpg',3,12,null,null,null,'部',1,0,1,'华为手机666');
					name:null,//商品名称
					price:0,
					categoryInfo:{//商品类型
						value:[],
						options:[]
					},
					brandInfo:{//商品品牌
						value:null,
						options:[]
					},
					publishStatus:{//上架状态
						value:null
					},
					
				},
				productPageInfo:{//分页信息
					pageNum:1,
					pageSize:5,
					total:1,
					list:[],
				},
				productTableLoading:false, //table表格是否正在加载
				productEditDialogParam:{//编辑模态框
					title:'',
					show:false
				},
				/* SKU库存数据 start */
				stockDialogParam:{//库存模态框
					show:false
				},
				stockTable:{//SKU表格
					loading:false,
					stockInfo:[],//SKU表格信息
					stockCols: [//保存自定义字段的数据
						// { label: "编号", prop: "id"},
						// { label: "价格", prop: "price"}
					]
				},
				stockAddDialogParam:{//添加库存模态框
					show:false,
					categoryId:0,
					productId:0,
					productAttr:[],//查询到的所有属性
					radio:[], //选择的所有属性值
					productSpecs:{} //最终要上传的json字符串值
				},
				stockAddForm:{
					price:0, //价格
					stock:0,  //库存
					lowStock:0,  //预警库存
					pic:{
						dialogImageUrl: '',//大图查看路径
						dialogVisible: false,//大图图查看弹出
						iconPath:'',//icon路径
						iconImagelist:[]//图片
					}
				},
				stockAddRules:{
					price:[
					  { required: true, message: "请输入价格", trigger: "blur" }
					],
					stock: [
						{ required: true, message: '请输入库存', trigger: 'change' }
					],
					lowStock: [
						{ required: true, message: '请输入预警库存', trigger: 'change' }
					]
				},
				stockEditDialogParam:{//编辑商品模态框
					show:false,
					id:null
				}
				
				/* SKU库存数据 end */
				
			};
		},
		computed: {
			iconUploadDisabled:function(){//是否显示bigPic上传的+号
				return this.stockAddForm.pic.iconImagelist.length > 0
			}
		}
	}
</script>

<style>
	.el-table td,.el-table th{
		text-align: center !important;/* table里子居中 */
	}
	.disabled .el-upload--picture-card {
		display: none; /* 上传图片是否显示+ */
	}
</style>
