<template>
	<div>
	<div style="border:1px #ebeef5 solid;margin-bottom: 20px;border-radius: 10px">
		<!-- 查询 start -->
		<el-form
		  :inline="true"
		  class="demo-form-inline"
		  label-width="68px"
			@submit.native.prevent
		>
			<br />
			
			<el-form-item class="form_input" label="名称:" >
			  <el-input 
				v-model="queryForm.name" placeholder="品牌名称" clearable
				@keyup.enter.native="queryByName()"
				prefix-icon="el-icon-search"
				size="small"
			  ></el-input>
			</el-form-item>
			<el-form-item>
			  <el-button 
			  title="查询" icon="el-icon-search" circle 
			  @click="queryByName()"
			  ></el-button>
			</el-form-item>
			<el-dropdown trigger="click" @command="batchOperation">
			  <el-button type="primary" size="small" style="margin-top: 5px;">
				批量操作<i class="el-icon-arrow-down el-icon--right"></i>
			  </el-button>
			  <el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="批量删除">批量删除</el-dropdown-item>
				<el-dropdown-item command="修改显示状态">修改显示状态</el-dropdown-item>
			  </el-dropdown-menu>
			</el-dropdown>
			
			
			<el-form-item class="form_input" style="margin-left: 20px;">
				<el-button title="添加" size="small" @click="onShowAdd()">添加数据</el-button>
			</el-form-item>
			
		</el-form>
		<!-- 查询 end -->
	</div>
	
	<div>
		<!-- 表格 start -->
		<el-table
		@selection-change="changeFun"
		:data="pageInfo.list"
		border
		align="center"
		style="width: 100%;border-radius: 10px"
		v-loading="loading"
		ref="singleTable"
		>
		<el-table-column
		  fixed
		  type="selection"
		  width="50">
		</el-table-column>
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
		  label="是否显示"
		  width="120">
		  <template slot-scope="scope">
            <el-switch
				v-model="scope.row.showStatus"
				active-color="#409eff"
				inactive-color="#dcdfe6"
				:active-value="1"
				:inactive-value="0"
				@change="showStatusChange(scope.$index)"
				>
            </el-switch>
          </template>
		</el-table-column>
		<el-table-column
		  label="产品数量"
		  width="120">
		  <template slot-scope="scope">
		  	<span v-if="scope.row.productCount == null">0</span>
		  	<span v-else >{{scope.row.productCount}}</span>
		  </template>
		</el-table-column>
		<el-table-column
		  label="产品评论数量"
		  width="120">
		  <template slot-scope="scope">
			  <span v-if="scope.row.productCommentCount == null">0</span>
			  <span v-else >{{scope.row.productCommentCount}}</span>
		  </template>
		</el-table-column>
		<el-table-column
		  label="品牌logo"
		  width="150">
		  <template slot-scope="scope">
			  <div class="block">
				<el-image 
				:src="scope.row.logo"
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
		  label="专区大图"
		  width="150">
			<template slot-scope="scope">
			  <div class="block">
				<el-image 
				:src="scope.row.bigPic"
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
		  prop="brandStory"
		  label="品牌故事"
		  width="180">
		  <template slot-scope="scope">
			  <span v-if="scope.row.brandStory != null && scope.row.brandStory != '' ">
			  	<span v-if="scope.row.brandStory.length < 9">{{scope.row.brandStory}}</span>
			  	<span v-else>{{scope.row.brandStory.substring(0,9)}}...</span>
			  </span>
			  <span v-else style="color: #97a8be;">暂无描述</span>
		  </template>
		</el-table-column>
		<el-table-column
		  
		  label="操作"
		  width="130">
		  <template slot-scope="scope">
			<el-button title="编辑" type="primary" icon="el-icon-edit" circle @click="onShowEdit(scope.row)"></el-button>
			<el-button title="删除" type="danger" icon="el-icon-delete" circle @click="deleteById(scope.row.id)"></el-button>
		  </template>
		</el-table-column>
		</el-table>
		<!-- 表格 end -->
	</div>
	<div>
		<br />
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
		  :page-sizes="[5,10]"
		  
		  >
		</el-pagination>
		
		<!--分页 end-->
		
	</div>
	<div>
		<!-- 添加，编辑，对话框 start -->
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
				:disabled="editDialogParam.formEditDisabled"
				@submit.native.prevent
			>
				<el-form-item label="品牌名称:" prop="name">
					<el-input v-model="formEdit.name" style="width: 400px;"></el-input>
				</el-form-item>
				<br />
				<el-form-item label="品牌logo:" style="margin-left: 9px;">
					<el-upload 
						class="upload-demo" 
						ref="uploadLogo"
						action=""
						:limit="1"
						list-type="picture-card"
						:auto-upload="false"
						:on-preview="logoHandlePictureCardPreview"
						:on-remove="logoHandleRemove"
						:http-request='submitUpload'
						:file-list="formEdit.logoImagelist"
						:class="{disabled:logoUploadDisabled}"
						:on-change="logoUploadChange"
						:on-success='logoOnSuccess'

						accept="image/jpeg,image/jpg,image/png"
						>
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-button style="margin-left: 10px;" type="success" icon="el-icon-check" round size="small" @click="logoSubmitAssess()">上传到服务器</el-button>
					<!-- 大图查看 -->
					<!-- <el-dialog :visible.sync="formEdit.dialogVisible" append-to-body>
						<img width="100%" :src="formEdit.dialogImageUrl" alt="">
					</el-dialog> -->
				</el-form-item>
				
				<br />
				<el-form-item label="是否显示:" style="margin-left: 9px;">
					<el-radio-group v-model="formEdit.showStatus">
						<el-radio :label="1">是</el-radio>
						<el-radio :label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<br />
				<el-form-item label="专区大图:" style="margin-left: 9px;">
					<el-upload 
						class="upload-demo" 
						ref="uploadBigPic"
						action=""
						:limit="1"
						list-type="picture-card"
						:auto-upload="false"
						:on-preview="bigPicHandlePictureCardPreview"
						:on-remove="bigPicHandleRemove"
						:http-request='submitUpload'
						:file-list="formEdit.bigPicImagelist"
						:class="{disabled:bigPicUploadDisabled}"
						:on-change="bigPicUploadChange"
						:on-success='bigPicOnSuccess'
						
						accept="image/jpeg,image/jpg,image/png"
						>
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-button style="margin-left: 10px;" type="success" icon="el-icon-check" round size="small" @click="bigPicSubmitAssess()">上传到服务器</el-button>
					<!-- 大图查看 -->
					<el-dialog :visible.sync="formEdit.dialogVisible" append-to-body>
						<img width="100%" :src="formEdit.dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>
				
				<el-form-item label=" 品牌故事:" prop="brandStory" style="margin-left: 9px;">
					<el-input maxlength="50" show-word-limit :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="formEdit.brandStory" style="width: 450px;"></el-input>
				</el-form-item>
				
				
			</el-form>
			
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogParam.show = false">取 消</el-button>
				<el-button v-show="editDialogParam.title=='添加数据'" type="primary" @click="insertBrand()">添 加</el-button>
				<el-button v-show="editDialogParam.title=='编辑数据'" type="primary" @click="editBrand()">编 辑</el-button>
			</span>
		</el-dialog>
		<!-- 添加，编辑，对话框 end -->
	</div>
  </div>
  
</template>

<script>
	
  export default {
    methods: {
	  handleCurrentChange(val){//改变当前页值
		  this.pageInfo.pageNum = val
		  this.onSearch('/brand/list',{
				pageNum:this.pageInfo.pageNum,
				pageSize:this.pageInfo.pageSize
			})
	  },
	  handleSizeChange(val){//改变每一页数量
		  this.pageInfo.pageSize = val
		  this.onSearch('/brand/list',{
		  	pageNum:this.pageInfo.pageNum,
		  	pageSize:this.pageInfo.pageSize
		  })
	  },
	  showStatusChange(row){//改变是否显示
		  //把当前行选勾
		  this.$refs.singleTable.toggleRowSelection(this.pageInfo.list[row]);
	  },
	  queryByName(){//按照name查询
			if(this.queryForm.name==""){
				return
			}
		  var data = {
				pageNum:1,
				pageSize:this.pageInfo.pageSize,
				name:this.queryForm.name,
				}
			
			this.onSearch("/brand/querybyname",data)
	  },
	  onSearch(url,data){//公用查询
			this.loading = true;			
		  //查询post请求		  
		  this.$http
		    .post(url,this.$qs.stringify(data))
		    .then(response => {
		  	  this.pageInfo = response.data.data;
		    })
		    .catch(error => {
		  	  //弹出消息框
		  	  this.$message({
		  	  	message: '服务器异常',
		  	  	type: 'error'
		  	  });
		    }).finally(() => {
          this.loading = false;
        });
	  },
		queryAll(){//查询所有
			this.onSearch("/brand/list",{
				pageNum:this.pageInfo.pageNum,
				pageSize:this.pageInfo.pageSize
			})
		},
		deleteById(brandId){//删除
		
		this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					var data={
						brandId:brandId
					}
					this.$http
					  .post("/brand/deletebyid",this.$qs.stringify(data))
					  .then(response => {
						   if(response.data.code == '200'){
								this.$message({
									type: 'success',
									message: '删除成功!'
								});
								//查询下所有信息
								this.queryAll()
								
							 }else{
								this.$message({
								  type: 'error',
								  message: '删除失败'
								});
							 }
					  })
					  .catch(error => {
						  //弹出消息框
						  this.$message({
						  	message: '服务器异常',
						  	type: 'error'
						  });
					  }).finally(() => {
					    this.loading = false;
					  });
        }).catch(() => {
            //取消删除
        });
		
		},
		onShowEdit(brand){//弹出编辑框
			this.editDialogParam.title='编辑数据'
			this.editDialogParam.show = true;
			
			this.formEdit.name=brand.name;//赋值文本框
			if (brand.logo !== null && brand.logo !== undefined && brand.logo !== ''){
				//alert(brand.logo)
				this.formEdit.logoImagelist=[{url:brand.logo}];//赋值logo上传图片框
				this.formEdit.logoPath=brand.logo;//赋值logo存进数据库的path
			}
			if (brand.bigPic !== null && brand.bigPic !== undefined && brand.bigPic !== ''){
				//alert(brand.bigPic)
				this.formEdit.bigPicImagelist=[{url:brand.bigPic}];
				this.formEdit.bigPicPath=brand.bigPic;
			}
			this.formEdit.showStatus=brand.showStatus;//是否显示
			this.formEdit.brandStory=brand.brandStory;
			this.formEdit.id=brand.id;
			
			
		},
		onShowAdd(){//弹出添加框
			this.editDialogParam.title='添加数据'
			this.editDialogParam.show = true;
			this.formEdit.name='';//name
			this.formEdit.showStatus=1;//是否显示（默认显示）
			this.formEdit.brandStory='';//品牌故事
		},
		insertBrand(){//确认添加品牌数据
			this.$refs["formEdit"].validate(valid => {
			  if (valid) {//校验通过
					//获得数据
					var data={
						name:this.formEdit.name,
						showStatus:this.formEdit.showStatus,
						logo:this.formEdit.logoPath,
						bigPic:this.formEdit.bigPicPath,
						brandStory:this.formEdit.brandStory
					}
			    //添加品牌数据,请求服务器
			    this.$http
			    .post('/brand/insert',data)
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
							this.queryAll()
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
		editBrand(){//确认编辑
			this.$refs["formEdit"].validate(valid => {
			  if (valid) {//校验通过
					//获得数据
					var data={
						id:this.formEdit.id,
						name:this.formEdit.name,
						showStatus:this.formEdit.showStatus,
						logo:this.formEdit.logoPath,
						bigPic:this.formEdit.bigPicPath,
						brandStory:this.formEdit.brandStory
					}
			    //添加品牌数据,请求服务器
			    this.$http
			    .post('/brand/edit',data)
			    .then(response => {
			    	console.log(response.data)
						if(response.data.code == '200'){
							//弹出消息框
							this.$message({
								message: '修改成功',
								type: 'success'
							});
							//关闭对话框	
							this.editDialogParam.show = false;
							//重新查询以下表
							this.queryAll()
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
		handleDialogClose(){//关闭对话框
			this.$refs["formEdit"].resetFields();//清空对话框里面的值
			this.$refs.uploadLogo.clearFiles();//清空logo图片
			this.$refs.uploadBigPic.clearFiles();//清空BigPice图片
			
			//防止清空了图片，当imageList里面还有值的情况
			this.formEdit.logoImagelist=[];
			this.formEdit.bigPicImagelist=[];
		},
		
		logoUploadChange(file, fileList){//添加logo图片发生的事件
			this.formEdit.logoImagelist=fileList;
		},
		logoHandleRemove(file, fileList) {//删除logo图片发生
		    console.log(file, fileList);
				this.formEdit.logoImagelist=fileList;
		 },
		logoHandlePictureCardPreview(file) {//查看logo图片发生
		  this.formEdit.dialogImageUrl = file.url;
		  this.formEdit.dialogVisible = true;
		},
		
		bigPicUploadChange(file, fileList){//添加pigPic图片发生的事件
			this.formEdit.bigPicImagelist=fileList;
		},
		bigPicHandleRemove(file, fileList) {//删除bigPic图片发生
		    console.log(file, fileList);
				this.formEdit.bigPicImagelist=fileList;
		 },
		bigPicHandlePictureCardPreview(file) {//查看bigPic图片发生
		  this.formEdit.dialogImageUrl = file.url;
		  this.formEdit.dialogVisible = true;
		},
		
		logoOnSuccess(filePath){//上传成功(文件上传成功的回调)
			this.formEdit.logoPath=filePath;
		},
		bigPicOnSuccess(filePath){//上传成功(文件上传成功的回调)
			this.formEdit.bigPicPath=filePath;
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
		
		logoSubmitAssess: function() {//点击logo图片上传
			if(this.formEdit.logoImagelist.length>0){
				//logo图片上传
				this.$refs.uploadLogo.submit()
			}else{
				this.$message({
					message:'请选择上传图片',
					type:'info'
				})
			}
    },
		bigPicSubmitAssess:function(){//点击bigpic图片上传
			if(this.formEdit.bigPicImagelist.length>0){
				//bigpic图片上传
				this.$refs.uploadBigPic.submit()
			}else{
				this.$message({
					message:'请选择上传图片',
					type:'info'
				})
			}
		},
		batchOperation(command){//批量操作
			var ids = this.multipleSelection.map(item => item.id)//获得所有id值
			if(ids.length==0){
				//弹出消息框
				this.$message({
					message: '请选择一条数据',
					type: 'warning'
				});
				return;
			}
			//批量删除操作
			if(command=='批量删除'){
				this.$confirm('此操作将批量永久删除数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//批量删除
					this.$http
					.post('/brand/batchDeleteById',ids)
					.then(response => {
						console.log(response.data)
						if(response.data.code == '200'){
							//弹出消息框
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							//重新查询以下表
							this.queryAll()
						}
					})
					.catch(error => {
						//弹出消息框
						this.$message({
							message: '服务器异常',
							type: 'error'
						});
					});	
				}).catch(() => {
					//取消删除
				});
			}
			else{
				this.$confirm('此操作将批量修改显示状态, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http
					.post('/brand/batchUpdateStatus',this.multipleSelection)
					.then(response => {
						console.log(response.data)
						if(response.data.code == '200'){
							//弹出消息框
							this.$message({
								message: '修改成功',
								type: 'success'
							});
							//重新查询以下表
							this.queryAll()
						}
					})
					.catch(error => {
						//弹出消息框
						this.$message({
							message: '服务器异常',
							type: 'error'
						});
					});	
				}).catch(() => {
					//取消删除
				});
			}
		},
		changeFun(vals){//选勾选项发生的
			this.multipleSelection = vals;
		}
		
	  
    },
		
	computed: {
		logoUploadDisabled:function() {//是否显示logo上传的+号
			return this.formEdit.logoImagelist.length > 0
		},
		bigPicUploadDisabled:function(){//是否显示bigPic上传的+号
			return this.formEdit.bigPicImagelist.length > 0
		}
		
	},
	watch:{//监控器
        'queryForm.name':function(val) {//监控查询的name是否为null
					if(val==""){
						this.queryAll()
					}
        }
    },

    data() {
      return {
		pageInfo:{//分页信息
			pageNum:1,
			pageSize:5,
			total:1,
			list:[],
		},
		queryForm:{
			name:''//按照name查询的值
		},
		loading:false,  //加载提示(旋转图标)
		batchValue: '',//批量删除上面的文字
		
		editDialogParam: {//编辑对话框参数
		  title: "新增数据", //弹窗标题,值为:新增数据，编辑数据
		  show: false, //弹框显示
		},
		formEdit:{//对话框上传的值
			id:'',
			name:'',//品牌名称
			showStatus:1,//是否显示
			brandStory:'',//品牌故事
			dialogImageUrl: '',//大图查看路径
			dialogVisible: false,//大图图查看弹出
			logoPath:'',//logo路径
			bigPicPath:'',//bigPic路径
			
			
			logoImagelist:[],//[{url: 'http://localhost:8080/file/download?filename=小米logo.png'}] logo图片list
			bigPicImagelist:[] //bigPic图片list
		},
		formEditRules:{//校验规则
			//校验规则
			name: [
			  { required: true, message: "请输入品牌名称", trigger: "blur" }
			]
		},
		multipleSelection:[] //批量选中值
		
    }},
	mounted (){//初始化
		this.queryAll()
	}
	
  }
</script>

<style>
	.el-table td,.el-table th{
		text-align: center !important;
	}
	.disabled .el-upload--picture-card {
    display: none;
	}
	.upload-demo{
		width: 148px;
		height: 148px;
	}
</style>
