<template>
	<div>
		<div style="border:1px #ebeef5 solid;margin-bottom: 20px;border-radius: 10px">
			<br />
			<i class="el-icon-tickets" style="margin-left: 20px;margin-right: 5px;"></i><span>数据列表</span>
			<el-button v-show ="subordinate.categoryRank==0" size="small" style="float: right;margin-right: 20px;margin-top: -5px;" @click="onShowAdd()">添加</el-button>
			<br /><br />
		</div>
		<div>
			<!-- 表格 start -->
			<!-- @selection-change="changeFun" -->
			<el-table
			:data="pageInfo.list"
			border
			align="center"
			style="width: 100%;border-radius: 10px"
			v-loading="categoryTable.loading"
			ref="singleTable"
			>
				<el-table-column
				  prop="id"
				  label="编号"
				  width="60">
				</el-table-column>
				<el-table-column
				  prop="name"
				  label="名称"
				  width="120">
				</el-table-column>
				<el-table-column
				  prop="rank"
				  label="级别"
				  width="80">
				  <template slot-scope="scope">
					<span v-if="scope.row.rank == 0">一级</span>
					<span v-else>二级</span>
				  </template>
				</el-table-column>
				<el-table-column
				  prop="productCount"
				  label="商品数量"
				  width="100">
				  <template slot-scope="scope">
					<span v-if="scope.row.productCount == null">0</span>
					<span v-else >{{scope.row.productCount}}</span>
				  </template>
				</el-table-column>
				<el-table-column
				  prop="productUnit"
				  label="商品单位"
				  width="100">
				</el-table-column>
				<el-table-column
				  label="是否显示"
				  width="100">
				  <template slot-scope="scope">
					<el-switch
					v-model="scope.row.showStatus"
					active-color="#409eff"
					inactive-color="#dcdfe6"
					:active-value="1"
					:inactive-value="0"
					>
					</el-switch>
				  </template>
				</el-table-column>
				<el-table-column
				  prop="icon"
				  label="icon"
				  width="120">
				  <template slot-scope="scope">
					<div class="block">
						<el-image 
						:src="scope.row.icon"
						style="width: 40px;height: 40px;"
						>
							<div slot="error" class="image-slot">
								<i class="el-icon-picture-outline" style="font-size: 40px;"></i>
							</div>
						</el-image>
					</div>
				  </template>
				</el-table-column>
				<el-table-column
				  prop="description"
				  label="描述"
				  width="180">
				  <template slot-scope="scope">
					<span v-if="scope.row.description != null && scope.row.description != '' ">
						<span v-if="scope.row.description.length < 9">{{scope.row.description}}</span>
						<span v-else>{{scope.row.description.substring(0,9)}}...</span>
					</span>
					<span v-else style="color: #97a8be;">暂无描述</span>
				  </template>
				</el-table-column>
				<el-table-column
				  label="操作"
				  width="260">
				  <template slot-scope="scope">
					
					<el-button v-if="subordinate.categoryRank!=1" size="mini" @click="querySubordinate(scope.row.id)">查看下级</el-button>
					<el-button v-else="subordinate.categoryRank!=1" size="mini" @click="onShowAttr(scope.row.id)">属性列表</el-button>
					
					<el-button size="mini" @click="onShowEdit(scope.row)">编辑</el-button>
					<el-button v-show="subordinate.categoryRank==0" type="danger" size="mini" @click="deleteById(scope.row.id)">删除</el-button>
					<el-button v-show="subordinate.categoryRank==1" type="danger" size="mini" @click="deleteSonById(scope.row.id)">删除</el-button>
				  </template>
				</el-table-column>
			</el-table>
		</div>
		<div>
			<br />
			<!-- 返回上级 -->
			<el-button @click="returnSuperior()" v-show="subordinate.categoryRank==1" size="small" type="primary" icon="el-icon-arrow-left">返回上级</el-button>
			<!--分页 start-->
			<el-pagination
			style="float: right;"
			  background
			  layout="total, sizes, prev, pager, next, jumper"
			  :total="pageInfo.total"
			  :current-page="pageInfo.pageNum"
			  @current-change="handleCurrentChange"
			  :page-size="pageInfo.pageSize"
			  @size-change="handleSizeChange"
			  :page-sizes="[5,10,20,30]"
			  >
			</el-pagination>
			
			<!--分页 end-->
		</div>
		<div>
			<!-- 添加 对话框 start-->
			<el-dialog
				:title="editDialogParam.title"
				:visible.sync="editDialogParam.show"
				width="600px"
				@close="handleDialogClose"
			>
				<el-form
					:inline="true"
					:model="formEdit"
					ref="formEdit"
					class="demo-form-inline"
					:rules="formEditRules"
					@submit.native.prevent
				>
					<el-form-item label="类型名称:" prop="name">
						<el-input v-model="formEdit.name" style="width: 400px;"></el-input>
					</el-form-item>
					
					<el-form-item  label="上级分类:" prop="superiorCategoryValue">
						<el-select :disabled="subordinate.categoryRank==0 && editDialogParam.title=='编辑'" v-model="formEdit.superiorCategoryValue" placeholder="请选择">
							<el-option key="0" label="无上级分类" value="0"></el-option>
							<el-option
							  v-for="item in formEdit.superiorCategory.options"
							  :key="item.id"
							  :label="item.name"
							  :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="数量单位:" prop="productUnit" >
						<el-input v-model="formEdit.productUnit" style="width: 400px;"></el-input>
					</el-form-item>
					<el-form-item label="是否显示:" prop="showStatus" class="my-el-form-item">
						<el-radio-group v-model="formEdit.showStatus">
							<el-radio :label="1">是</el-radio>
							<el-radio :label="0">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<br />
					<el-form-item label="分类图标:" class="my-el-form-item">
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
							:file-list="formEdit.iconImagelist"
							:class="{disabled:iconUploadDisabled}"
							:on-change="iconUploadChange"
							:on-success='iconOnSuccess'
							
							accept="image/jpeg,image/jpg,image/png"
							>
							<i class="el-icon-plus"></i>
						</el-upload>
							<el-button style="margin-left: 10px;" type="success" icon="el-icon-check" round size="small" @click="iconSubmitAssess()">上传到服务器</el-button>
							<!-- 大图查看 -->
							<el-dialog :visible.sync="formEdit.dialogVisible" append-to-body>
								<img width="100%" :src="formEdit.dialogImageUrl" alt="">
							</el-dialog>
					</el-form-item>
					<el-form-item label="类型描述:" prop="description" class="my-el-form-item">
						<el-input maxlength="50" show-word-limit :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="formEdit.description" style="width: 450px;"></el-input>
					</el-form-item>
				</el-form>
				
				<span slot="footer" class="dialog-footer">
					<el-button @click="editDialogParam.show = false">取 消</el-button>
					<el-button v-show="editDialogParam.title=='添加'" type="primary" @click="insertCategory()">添 加</el-button>
					<el-button v-show="editDialogParam.title=='编辑'" type="primary" @click="editCategory()">编 辑</el-button>
				</span>
			</el-dialog>
			
			<!-- 添加 对话框 end -->
		</div>
		<div>
			<!-- 商品属性 对话框 start -->
			<el-dialog
				title="商品属性"
				:visible.sync="attrDialogParam.show"
				width="762px"
				@close="attrDialogClose"
			>	
				<div style="border:1px #ebeef5 solid;margin-bottom: 15px;margin-top: -15px ;border-radius: 10px">
					<br />
					<i class="el-icon-tickets" style="margin-left: 20px;margin-right: 5px;"></i>数据列表
					<el-button @click="onShowAttrAdd()" size="small" style="float: right;margin-right: 20px;margin-top: -5px;" >添加</el-button>
					<br /><br />
				</div>
				<el-table
				:data="attrInfo"
				border
				align="center"
				style="width: 100%;border-radius: 10px"
				v-loading="attrTable.loading"
				ref="attrTable"
				>	
					<el-table-column
					  prop="id"
					  label="编号"
					  width="80">
					</el-table-column>
					<el-table-column
					  prop="name"
					  label="属性名称"
					  width="100">
					</el-table-column>
					<el-table-column
					  prop="categoryId"
					  label="分类"
					  width="80">
					  <template slot-scope="scope">
						  <span v-for="category in pageInfo.list" v-if="category.id == scope.row.categoryId">
							  {{category.name}}
						  </span>
					  </template>
					</el-table-column>
					<el-table-column
					  prop="attrOptions"
					  label="可选选项"
					  width="150">
					  <template slot-scope="scope">
						  <span v-for="(option,index) in scope.row.attrOptions">
							{{option.name}}
							<span v-if="index!=scope.row.attrOptions.length-1">,</span>
						  </span>
						  <span v-if="scope.row.attrOptions.length == 0" style="color: #97a8be;">暂无选项</span>
					  </template>
					</el-table-column>
					<el-table-column
					  label="选项操作"
					  width="130">
					  <template slot-scope="scope">
						  <el-button @click="onShowAttrOptionAdd(scope.row.id)" size="mini" style="margin-bottom: 10px;">添加选项</el-button>
						  <el-popover
						    placement="top"
						    width="200"
						    trigger="click">
						    <el-table
						    :data="scope.row.attrOptions"
						    align="center"
						    style="width: 100%;border-radius: 10px"
						    ref="attrTable"
						    >	
						    	<el-table-column
						    	  prop="name"
						    	  label="选项名称"
						    	  width="100">
						    	</el-table-column>
								<el-table-column
								  label="选项操作"
								  width="100">
									<template slot-scope="scope">
									  <el-button @click="deleteAttrOptionById(scope.row.id)" size="mini" type="danger">删除</el-button>
									</template>
								</el-table-column>
						    </el-table>
						    <el-button size="mini" slot="reference">删除选项</el-button>
						  </el-popover>
					  </template>
					</el-table-column>
					<el-table-column
					  label="属性操作"
					  width="180">
					  <template slot-scope="scope">
						  <el-button @click="onShowAttrEdit(scope.row)" size="mini">编辑</el-button>
						  <el-button size="mini" @click="deleteAttrById(scope.row.id)" type="danger">删除</el-button>
					  </template>
					</el-table-column>
					
				</el-table>
				
				<!-- 属性 添加，修改 对话框 start-->
				<el-dialog 
				:title="attrAddDialogParam.title"
				:visible.sync="attrAddDialogParam.show"
				width="400px"
				@close="attrAddDialogClose"
				append-to-body>
					<el-form
						:inline="true"
						:model="attrFormEdit"
						ref="attrFormEdit"
						class="demo-form-inline"
						:rules="attrFormEditRules"
						@submit.native.prevent
						style="margin-bottom: -35px;margin-top: -8px;"
					>
						<el-form-item v-show="attrAddDialogParam.title!='添加选项'" label="属性名称:" prop="name">
							<el-input 
							v-model="attrFormEdit.name"
							></el-input>
						</el-form-item>
						<el-form-item v-show="attrAddDialogParam.title=='添加选项'" label="选项名称:" prop="optionName">
							<el-input 
							v-model="attrFormEdit.optionName"
							></el-input>
						</el-form-item>
					</el-form>
					
					<span slot="footer" class="dialog-footer" style="">
						<el-button @click="attrAddDialogParam.show = false" size="mini">取 消</el-button>
						<el-button v-show="attrAddDialogParam.title=='添加属性'" type="primary" @click="insertAttr()" size="mini">添 加</el-button>
						<el-button v-show="attrAddDialogParam.title=='编辑属性'" type="primary" @click="editAttr()" size="mini">编 辑</el-button>
						<el-button v-show="attrAddDialogParam.title=='添加选项'" type="primary" @click="insertAttrOption()" size="mini">添 加</el-button>
					</span>
				</el-dialog>
				<!-- 属性 添加，修改 对话框 end -->
				
				
			
			</el-dialog>
			<!-- 商品属性 对话框 end -->
		</div>
	</div>
	
</template>

<script>
	export default{
		mounted (){//初始化
			this.queryAll();
		},
		methods:{
			onSearch(url,data){//公用查询
				this.categoryTable.loading = true;			
				//查询post请求		  
				this.$http
				.post(url,this.$qs.stringify(data))
				.then(response => {
					console.log(response.data)
					this.pageInfo = response.data.data;
				})
				.catch(error => {
				  	//弹出消息框
				  	this.$message({
						message: '服务器异常',
						type: 'error'
				  	});
				})
				.finally(() => {
					this.categoryTable.loading = false;
				});
			},
			queryAll(){//查询父级所有信息
				var data={
					pageNum:this.pageInfo.pageNum,
					pageSize:this.pageInfo.pageSize
				}
				this.onSearch("/category/list",data)
			},
			querySubordinateAll(){//查询所有下级
				var data={
					pageNum:this.pageInfo.pageNum, //问题
					pageSize:this.pageInfo.pageSize,
					categoryId:this.subordinate.categoryId
				}
				this.onSearch("/category/listById",data)
			},
			handleCurrentChange(val){//改变当前页值
				this.pageInfo.pageNum = val
				this.ifRankQuery()
			},
			handleSizeChange(val){//改变每一页数量
				this.pageInfo.pageSize = val
				this.ifRankQuery()
			},
			ifRankQuery(){//判断父子级再进行查询
				if(this.subordinate.categoryRank == 0){
					this.queryAll()//查询所有父级
				}else{
					this.querySubordinateAll();//查询所有子级
				}
			},
			deleteById(categoryId){//删除父级数据
				var data={
					categoryId:categoryId
				}
				this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http
					.post("/category/deleteById",this.$qs.stringify(data))
					.then(response => {
						if(response.data.code == '200'){
							if(response.data.data == false){
								this.$message({
									type: 'warning',
									message: '请先删除该分类的二级分类'
								});
								return;
							}
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
							
							//查询下所有信息
							this.ifRankQuery();
						}else{
							this.$message({
								type: 'error',
								message: '删除失败'
							});
						}})
						.catch(error => {
							//弹出消息框
							this.$message({
								message: '服务器异常',
							  	type: 'error'
							});
						})
						.finally(() => {
						    this.loading = false;
						});
			}).catch(() => {
			    //取消删除
			});
			
			},
			deleteSonById(categoryId){//删除子分类数据
				var data={
						categoryId:categoryId
					}
					this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.$http
						.post("/category/deleteSonById",this.$qs.stringify(data))
						.then(response => {
							if(response.data.code == '200'){
								if(response.data.data == false){
									this.$message({
										type: 'warning',
										message: '请先删除该分类的属性'
									});
									return;
								}
								this.$message({
									type: 'success',
									message: '删除成功!'
								});
								
								//查询下所有信息
								this.ifRankQuery();
							}else{
								this.$message({
									type: 'error',
									message: '删除失败'
								});
							}})
							.catch(error => {
								//弹出消息框
								this.$message({
									message: '服务器异常',
								  	type: 'error'
								});
							})
							.finally(() => {
							    this.loading = false;
							});
				}).catch(() => {
				    //取消删除
				});
			},
			
			querySubordinate(categoryId){//点击查询下级
				this.subordinate.categoryRank=1;
				this.subordinate.categoryId=categoryId;
				
				//查询所有下级，从第一页查起
				var data={
					pageNum:1,
					pageSize:this.pageInfo.pageSize,
					categoryId:this.subordinate.categoryId
				}
				this.onSearch("/category/listById",data)
				
				//保存当前分页信息
				this.superior.pageNum = this.pageInfo.pageNum
				this.superior.pageSize = this.pageInfo.pageSize
				
				//给上级分类赋值给上级分类赋值(先保存好上级分类的信息)
				this.formEdit.superiorCategory.options = this.pageInfo.list;
				
				
			},
			returnSuperior(){//返回上级
				//改变上下级状态
				this.subordinate.categoryRank=0;
				
				//查询上级，从第一页查起
				var data={
					pageNum:this.superior.pageNum,
					pageSize:this.superior.pageSize
				}
				this.onSearch("/category/list",data)
			},
			onShowAdd(){//点击添加
				this.editDialogParam.title='添加'
				this.editDialogParam.show=true
				
				//给下拉框赋值
				this.formEdit.superiorCategory.options = this.pageInfo.list;
				
			},
			onShowEdit(category){//弹出编辑框
				this.editDialogParam.title='编辑'
				this.editDialogParam.show=true
				//赋值name
				this.formEdit.name=category.name;//赋值文本框
				//给上级分类赋值
				if(this.subordinate.categoryRank==0){//一级才赋值
					this.formEdit.superiorCategory.options = this.pageInfo.list;
					this.formEdit.superiorCategoryValue='0'
				}else{
					this.formEdit.superiorCategoryValue=category.parentId;
				}
				//赋值数量单位
				this.formEdit.productUnit = category.productUnit;
				//赋值是否显示
				this.formEdit.showStatus = category.showStatus;
				//赋值分类图标
				if (category.icon !== null && category.icon !== undefined && category.icon !== ''){
					//alert(brand.logo)
					this.formEdit.iconImagelist=[{url:category.icon}];//赋值上传图片框
					this.formEdit.iconPath=category.icon;//赋值图片存进数据库的path
				}
				//赋值分类描述
				this.formEdit.description = category.description;
				//赋值分类id
				this.formEdit.id = category.id;
				
			},
			handleDialogClose(){//关闭对话框
				this.$refs["formEdit"].resetFields();//清空对话框里面的值
				this.$refs.uploadIcon.clearFiles();//清空图片
				//防止清空了图片，当imageList里面还有值的情况
				this.formEdit.iconImagelist=[];
				
			},
			insertCategory(){//确认添加
				this.$refs["formEdit"].validate(valid => {
				  if (valid) {//校验通过
					//获得数据
					var data={
						rank:this.formEdit.superiorCategoryValue == 0 ? 0 : 1,
						parentId:this.formEdit.superiorCategoryValue != 0 ? this.formEdit.superiorCategoryValue : null,
						name:this.formEdit.name,
						productUnit:this.formEdit.productUnit,
						showStatus:this.formEdit.showStatus,
						icon:this.formEdit.iconPath,
						description:this.formEdit.description
					}
				    //添加品牌数据,请求服务器
				    this.$http
				    .post('/category/insertCategory',data)
				    .then(response => {
				    	console.log(response.data)
							if(response.data.code == '200'){
								//弹出消息框
								this.$message({
									message: '添加成功',
									type: 'success'
								});
								//关闭对话框	
								this.editDialogParam.show = false;
								//重新查询以下表
								this.ifRankQuery();
							}
				    })
				    .catch(error => {
				    	//弹出消息框
				    	this.$message({
				    		message: '服务器异常',
				    		type: 'error'
				    	});
				    });
				  }
				});
			},
			editCategory(){//确认编辑
				this.$refs["formEdit"].validate(valid => {
				  if (valid) {//校验通过
					//获得数据
					var data={
						id:this.formEdit.id,
						rank:this.formEdit.superiorCategoryValue == 0 ? 0 : 1,
						parentId:this.formEdit.superiorCategoryValue != 0 ? this.formEdit.superiorCategoryValue : null,
						name:this.formEdit.name,
						productUnit:this.formEdit.productUnit,
						showStatus:this.formEdit.showStatus,
						icon:this.formEdit.iconPath,
						description:this.formEdit.description
					}
				    //添加品牌数据,请求服务器
				    this.$http
				    .post('/category/editCategory',data)
				    .then(response => {
				    	console.log(response.data)
							if(response.data.code == '200'){
								//弹出消息框
								this.$message({
									message: '编辑成功',
									type: 'success'
								});
								//关闭对话框	
								this.editDialogParam.show = false;
								//重新查询以下表
								this.ifRankQuery();
							}
				    })
				    .catch(error => {
				    	//弹出消息框
				    	this.$message({
				    		message: '服务器异常',
				    		type: 'error'
				    	});
				    });
				  }
				});
			},
			
			
			/* 上传start */
			iconSubmitAssess(){//点击上传至服务器
				if(this.formEdit.iconImagelist.length>0){
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
			  this.formEdit.dialogImageUrl = file.url;
			  this.formEdit.dialogVisible = true;
			},
			iconUploadChange(file, fileList){//添加图片发生的事件
				this.formEdit.iconImagelist=fileList;
			},
			iconHandleRemove(file, fileList) {//删除图片发生
			    console.log(file, fileList);
				this.formEdit.iconImagelist=fileList;
			},
			iconOnSuccess(filePath){//上传成功(文件上传成功的回调)
				this.formEdit.iconPath=filePath;
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
			
			/* 商品属性模块 start */
			queryAttrAll(){//公用查询所有属性
				var data={categoryId:this.attrFormEdit.categoryId}
				//查询post请求		  
				this.$http
				.post('/productAttr/list',this.$qs.stringify(data))
				.then(response => {
					console.log(response.data)
					this.attrInfo = response.data.data;
				})
				.catch(error => {
				  	//弹出消息框
				  	this.$message({
						message: '服务器异常',
						type: 'error'
				  	});
				})
				.finally(() => {
					this.attrTable.loading = false;
				});
			},
			onShowAttr(categoryId){//点击属性列表
				this.attrDialogParam.show = true;//打开商品属性模态框
				this.attrTable.loading = true;
				this.attrFormEdit.categoryId=categoryId;//给 属性对象 添加 categoryId
				var data={
					categoryId:categoryId
				}
				//查询post请求		  
				this.$http
				.post('/productAttr/list',this.$qs.stringify(data))
				.then(response => {
					console.log(response.data)
					this.attrInfo = response.data.data;
				})
				.catch(error => {
				  	//弹出消息框
				  	this.$message({
						message: '服务器异常',
						type: 'error'
				  	});
				})
				.finally(() => {
					this.attrTable.loading = false;
				});
				
			},
			attrDialogClose(){//关闭商品属性模态框
				//alert("关闭商品属性")
				
			},
			onShowAttrAdd(){//弹出 属性 添加 对话框
				this.attrAddDialogParam.show=true;
				this.attrAddDialogParam.title='添加属性';
				
				//给弹出的添加对话框清空
				this.attrFormEdit.name = '';
				this.attrFormEdit.id = '';
				
				this.attrFormEdit.optionName = 'name';//手动给他随意添加点数据，让校验失效
			},
			onShowAttrEdit(attrInfo){//弹出 属性 编辑 对话框
				this.attrAddDialogParam.show=true;
				this.attrAddDialogParam.title='编辑属性';
				
				//给弹出的编辑对话框赋值
				this.attrFormEdit.name = attrInfo.name;
				this.attrFormEdit.id = attrInfo.id;
				
				this.attrFormEdit.optionName = 'name';//手动给他随意添加点数据，让校验失效
			},
			attrAddDialogClose(){//关闭属性 添加，修改 对话框
				//alert("关闭 属性 添加，修改 ")
				this.$refs["attrFormEdit"].resetFields();//清空对话框里面的值
			},
			insertAttr(){//确认属性添加
				this.$refs["attrFormEdit"].validate(valid => {//判断校验是否成功
					if(valid){
						var data={
							categoryId:this.attrFormEdit.categoryId,
							name:this.attrFormEdit.name
						}
						this.$http.post('/productAttr/insertAttr',data)
						.then(response => {
							console.log(response.data)
							if(response.data.code == '200'){
								this.$message({
									message:'添加成功',
									type:'success'
								})
								this.attrAddDialogParam.show = false;//关闭对话框
								this.queryAttrAll();//重新查询一下属性
							}else{
								this.$message({
									message:'添加失败',
									type:'error'
								})
							}
						})
						.catch(error => {
						  	//弹出消息框
						  	this.$message({
								message: '服务器异常',
								type: 'error'
						  	});
						})
						.finally(() => {})
					}
				});
				

			},
			editAttr(){//确认属性编辑
				this.$refs["attrFormEdit"].validate(valid => {//判断校验是否成功
					if(valid){
						var data={
							id:this.attrFormEdit.id,
							name:this.attrFormEdit.name
						}
						this.$http.post('/productAttr/editAttr',data)
						.then(response => {
							console.log(response.data)
							if(response.data.code == '200'){
								this.$message({
									message:'编辑成功',
									type:'success'
								})
								this.attrAddDialogParam.show = false;//关闭对话框
								this.queryAttrAll();//重新查询一下属性
							}else{
								this.$message({
									message:'编辑失败',
									type:'error'
								})
							}
						})
						.catch(error => {
						  	//弹出消息框
						  	this.$message({
								message: '服务器异常',
								type: 'error'
						  	});
						})
						.finally(() => {})
					}
				});
				
				
			},
			deleteAttrById(attrId){//删除属性
				this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					var data={
						attrId:attrId
					}
					this.$http.post('/productAttr/deleteAttr',this.$qs.stringify(data))
					.then(response => {
						console.log(response.data)
						if(response.data.code == '200'){
							if(response.data.data == false){
								this.$message({
									message:'请先删除该属性的所有选项',
									type:'warning'
								})
								return;
							}
							this.$message({
								message:'删除成功',
								type:'success'
							})
							this.queryAttrAll();//重新查询一下属性
						}else{
							this.$message({
								message:'删除失败',
								type:'error'
							})
						}
					})
					.catch(error => {
					  	//弹出消息框
					  	this.$message({
							message: '服务器异常',
							type: 'error'
					  	});
					})
					.finally(() => {})
				}).catch(() => {
				    //取消删除
				});
				
			},
				/* 属性选项start */
			deleteAttrOptionById(optionId){//删除属性选项
				this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					var data={
						optionId:optionId
					}
					this.$http.post('/attrOption/deleteAttrOption',this.$qs.stringify(data))
					.then(response => {
						console.log(response.data)
						if(response.data.code == '200'){
							this.$message({
								message:'删除成功',
								type:'success'
							})
							this.queryAttrAll();//重新查询一下属性
						}else{
							this.$message({
								message:'删除失败',
								type:'error'
							})
						}
					})
					.catch(error => {
					  	//弹出消息框
					  	this.$message({
							message: '服务器异常',
							type: 'error'
					  	});
					})
					.finally(() => {})
				}).catch(() => {
				    //取消删除
				});
			},
			onShowAttrOptionAdd(attrId){//弹出属性选项添加对话框
				this.attrAddDialogParam.show=true;
				this.attrAddDialogParam.title='添加选项';
				
				//给弹出的添加对话框清空
				this.attrFormEdit.id = attrId;
				this.attrFormEdit.name = 'name';//手动给他随意添加点数据，让校验失效
				this.attrFormEdit.optionName = '';
				
			},
			insertAttrOption(){//确认添加选项
				this.$refs["attrFormEdit"].validate(valid => {//判断校验是否成功
					if(valid){
						var data={
							attrId:this.attrFormEdit.id,
							name:this.attrFormEdit.optionName
						}
						this.$http.post('/attrOption/insertAttrOption',data)
						.then(response => {
							console.log(response.data)
							if(response.data.code == '200'){
								this.$message({
									message:'添加成功',
									type:'success'
								})
								this.attrAddDialogParam.show = false;//关闭对话框
								this.queryAttrAll();//重新查询一下属性
							}else{
								this.$message({
									message:'添加失败',
									type:'error'
								})
							}
						})
						.catch(error => {
						  	//弹出消息框
						  	this.$message({
								message: '服务器异常',
								type: 'error'
						  	});
						})
						.finally(() => {})
					}
				});
			}
				/* 属性选项end */
			
			/* 商品属性模块 end */
			
		},
		data(){
			return {
				pageInfo:{//分页信息
					pageNum:1,
					pageSize:5,
					total:1,
					list:[]
				},
				categoryTable:{//表格的一些数据
					loading:false
				},
				subordinate:{//下级信息
					categoryRank:0,//是否是下级，0:父级，1：下级
					categoryId:0, //下级id
				},
				superior:{//上级信息
					pageNum:1,
					pageSize:5
				},
				editDialogParam: {//编辑对话框参数
				  title: "添加", //弹窗标题,值为:添加，编辑
				  show: false, //弹框显示
				},
				formEdit:{//对话框上传的值
					id:'',
					name:'',//品牌名称
					productUnit:'',//数量单位
					showStatus:1,//是否显示
					description:'',//分类描述
					dialogImageUrl: '',//大图查看路径
					dialogVisible: false,//大图图查看弹出
					iconPath:'',//icon路径
					iconImagelist:[], //icon图片list
					superiorCategory:{//对话框上的上级分类
						options:[]
					},
					superiorCategoryValue:'',
				},
				formEditRules:{//校验规则
					//校验规则
					name: [
					  { required: true, message: "请输入类型名称", trigger: "blur" }
					],
					productUnit:[
					  { required: true, message: "请输入数量单位", trigger: "blur" }
					],
					superiorCategoryValue: [
						{ required: true, message: '请选择上级分类', trigger: 'change' }
					]
				},
				
				/* 商品属性 start */
				attrDialogParam:{//商品属性显示的对话框
					show:false
				},
				attrAddDialogParam:{//属性添加对话框 (商品属性显示的对话框 中的 对话框)
					show:false,
					title:''
				},
				attrInfo:[],//属性信息
				attrTable:{//属性 表格
					loading:false //控制表格加载动画显示
				},
				attrFormEdit:{//属性添加编辑的参数
					id:'',
					name:'',
					categoryId:'',
					optionName:''
				},
				attrFormEditRules:{//属性校验规则
					//校验规则
					name: [
					  { required: true, message: "请输入属性名称", trigger: "blur" }
					],
					optionName: [
					  { required: true, message: "请输入选项名称", trigger: "blur" }
					]
				}
				
				/* 商品属性 end */
				
				
			}
		},
		computed: {
			iconUploadDisabled:function(){//是否显示bigPic上传的+号
				return this.formEdit.iconImagelist.length > 0
			}
		}
	}
</script>
	
<style>
	.el-table td,.el-table th{
		text-align: center !important;/* table里子居中 */
	}
	.my-el-form-item{
		margin-left: 10px;
	}
	.disabled .el-upload--picture-card {
		display: none; /* 上传图片是否显示+ */
	}
</style>
