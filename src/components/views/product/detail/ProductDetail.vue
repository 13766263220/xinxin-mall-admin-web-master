<template>
	<div>
		<!-- 商品信息 start -->
		<div style="margin-left: 120px;margin-top: 50px;">
		<el-form
			:inline="true"
			:model="productAddForm"
			:rules="productAddRules"
			ref="productAddForm"
			class="demo-form-inline"
			@submit.native.prevent
		>
			<el-form-item label="商品名称:" prop="name">
				<el-input v-model="productAddForm.name" placeholder="请输入商品名称" size="small" style="width: 300px;"></el-input>
			</el-form-item>
			<br />
			<el-form-item label="商品类型:" prop="categoryInfo.value">
				<el-cascader
					size="small"
					:props="props"
					v-model="productAddForm.categoryInfo.value">
				</el-cascader>
			</el-form-item>
			<br />
			<el-form-item  label="商品品牌:" prop="brandInfo.value">
				<el-select v-model="productAddForm.brandInfo.value" placeholder="请选择" size="small" style="width: 250px;">
					<el-option
					  v-for="item in productAddForm.brandInfo.options"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<br />
			<el-form-item label="商品售价:" prop="price">
				<el-input v-model="productAddForm.price" placeholder="请输入商品售价" size="small" style="width: 300px;"></el-input>
			</el-form-item>
			<el-form-item label="商品库存:" prop="stock">
				<el-input v-model="productAddForm.stock" placeholder="请输入商品库存" size="small" style="width: 300px;"></el-input>
			</el-form-item>
			<el-form-item label="预警库存:" prop="lowStock">
				<el-input v-model="productAddForm.lowStock" placeholder="请输入商品库存" size="small" style="width: 300px;"></el-input>
			</el-form-item>
			<br />
			<el-form-item label="商品单位:" prop="unit">
				<el-input v-model="productAddForm.unit" placeholder="请输入商品库存" size="small" style="width: 300px;"></el-input>
			</el-form-item>
			
			<br />
			<el-form-item  label="上架状态:" >
				<el-switch
				v-model="productAddForm.publishStatus"
				active-color="#409eff"
				inactive-color="#dcdfe6"
				:active-value="1"
				:inactive-value="0"
				>
				</el-switch>
				
			</el-form-item>
			<span style="margin-left: 40px;"></span>
			<el-form-item  label="是否是新品:" >
				<el-switch
				
				v-model="productAddForm.newStatus"
				active-color="#409eff"
				inactive-color="#dcdfe6"
				:active-value="1"
				:inactive-value="0"
				>
				</el-switch>
			</el-form-item>
			<span style="margin-left: 40px;"></span>
			<el-form-item  label="是否推荐:" >
				<el-switch
				v-model="productAddForm.recommandStatus"
				active-color="#409eff"
				inactive-color="#dcdfe6"
				:active-value="1"
				:inactive-value="0"
				>
				</el-switch>
				
			</el-form-item>
			
			<br />
			
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
					:file-list="productAddForm.pic.iconImagelist"
					:class="{disabled:iconUploadDisabled}"
					:on-change="iconUploadChange"
					:on-success='iconOnSuccess'
					
					accept="image/jpeg,image/jpg,image/png"
					>
					<i class="el-icon-plus"></i>
				</el-upload>
					<el-button style="margin-left: 10px;" type="success" icon="el-icon-check" round size="small" @click="iconSubmitAssess()">上传到服务器</el-button>
					<!-- 大图查看 -->
					<el-dialog :visible.sync="productAddForm.pic.dialogVisible" append-to-body>
						<img width="100%" :src="productAddForm.pic.dialogImageUrl" alt="">
					</el-dialog>
			</el-form-item>
			<br />
			
			<el-form-item label="商品描述:" prop="description" class="my-el-form-item">
				<el-input maxlength="50" show-word-limit :autosize="{ minRows: 2, maxRows: 5}" type="textarea" v-model="productAddForm.description" style="width: 450px;"></el-input>
			</el-form-item>
			
		</el-form>
		</div>
		<!-- 商品信息 end -->
		
		
		<br /><br />
		<!-- <el-button style="margin-top: 12px;" @click="prev()">上一步</el-button> -->
		<el-button style="margin-left: 200px;" @click="next()">确认添加</el-button>
	</div>
</template>

<script>
	import axios from 'axios';
	import qs from "qs";
	export default{
		mounted() {
			this.queryBrandAll();//查询所有品牌
		},
		methods:{
			queryBrandAll(){//查询所有品牌
				//查询get请求
				this.$http
				.get('/brand/getAll')
				.then(response => {
					console.log(response.data)
					
					//给下拉框赋值
					this.productAddForm.brandInfo.options = response.data.data;
				})
				.catch(error => {
				  	//弹出消息框
				  	this.$message({
						message: '服务器异常',
						type: 'error'
				  	});
				})
			},
			prev(){
				this.$emit('active',0)
			},
			next(){//下一步
				this.$refs["productAddForm"].validate(valid => {//判断校验是否成功
					if(valid){
						this.$emit('active',1)
						this.$emit('productForm',this.productAddForm)
					}
				})
			},
			/* 上传 start */
			iconSubmitAssess(){//点击上传至服务器
				if(this.productAddForm.pic.iconImagelist.length>0){
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
			  this.productAddForm.pic.dialogImageUrl = file.url;
			  this.productAddForm.pic.dialogVisible = true;
			},
			iconUploadChange(file, fileList){//添加图片发生的事件
				this.productAddForm.pic.iconImagelist=fileList;
			},
			iconHandleRemove(file, fileList) {//删除图片发生
			    console.log(file, fileList);
				this.productAddForm.pic.iconImagelist=fileList;
			},
			iconOnSuccess(filePath){//上传成功(文件上传成功的回调)
				this.productAddForm.pic.iconPath=filePath;
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
		},
		data(){
			return{
				productAddForm:{//商品表单
					name:null,//商品名称
					price:0,//商品售价
					stock:0,  //库存
					lowStock:0,  //预警库存
					unit:"件",
					categoryInfo:{//商品类型
						value:[]
					},
					brandInfo:{//商品品牌
						value:null,
						options:[]
					},
					publishStatus:1,//上架状态
					newStatus:1,//是否新品
					recommandStatus:1,//是否推荐
					pic:{
						dialogImageUrl: '',//大图查看路径
						dialogVisible: false,//大图图查看弹出
						iconPath:'',//icon路径
						iconImagelist:[]//图片
					},
					description:null
					
				},
				productAddRules:{//校验规则
					//校验规则
					name: [
					  { required: true, message: "请输入商品名称", trigger: "blur" }
					],
					price:[
					  { required: true, message: "请输入商品售价", trigger: "blur" }
					],
					stock: [
						{ required: true, message: '请输入商品库存', trigger: 'change' }
					],
					lowStock: [
						{ required: true, message: '请输入预警库存', trigger: 'change' }
					],
					unit:[
						{ required: true, message: '请输入商品单位', trigger: 'change' }
					],
					'categoryInfo.value': [
						{required: true,message: '请选择商品类型',trigger: 'change'},
					],
					'brandInfo.value': [
						{required: true,message: '请选择商品品牌',trigger: 'change'},
					]
				},
				props: {//懒加载数据
					lazy: true,
					category: { listByParentId (node, resolve, parentId) {//写一个方法
					  axios
						.post('/category/listByParentId', qs.stringify({ parentId: parentId }))
						.then(res => {
						  // console.log(res.data)
						  const cities = res.data.data.map((value, i) => ({
							value: value.id,
							label: value.name,
							parentId: value.id,
							leaf: node.level >= 1
						  }))
						  // 通过调用resolve将子节点数据返回，通知组件数据加载完成
						  resolve(cities)
						})
					}},
					lazyLoad (node, resolve) {
					  var _this = this
						if (node.level === 0) {//判断是第几级
						  _this.category.listByParentId(node, resolve, 0)
						} else if (node.level !== 0) {//node.data可取到resolve返回的数据
						  _this.category.listByParentId(node, resolve, node.data.parentId)
						}
					}
				}
			}
		},
		computed: {
			iconUploadDisabled:function(){//是否显示bigPic上传的+号
				return this.productAddForm.pic.iconImagelist.length > 0
			}
		}
	}
</script>

<style>
	.disabled .el-upload--picture-card {
		display: none; /* 上传图片是否显示+ */
	}
</style>
