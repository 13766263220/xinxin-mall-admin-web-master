<template>
  <div style="border:1px #ebeef5 solid;margin-bottom: 20px;border-radius: 10px;width: 800px;margin-left: 50px;">
	<div style="width: 500px;margin-left: 100px;margin-top: 50px;">
		<el-steps :active="active" align-center finish-status="success">
		  <el-step title="填写商品信息"></el-step>
		  <!-- <el-step title="填写商品属性"></el-step> -->
		  <el-step title="完成"></el-step>
		</el-steps>
		
	</div>
	<product-detail v-show="showStatus[0]" @active="getActive" @productForm="getProductForm" ></product-detail>
	<!-- <product-attr-detail v-show="showStatus[1]" :categoryId="categoryId" @active="getActive"></product-attr-detail> -->
	
  </div>
</template>

<script>
import ProductDetail from './detail/ProductDetail.vue';
import ProductAttrDetail from './detail/ProductAttrDetail.vue';
export default {
    data() {
      return {
		active: 0, //保存到第几步
		showStatus: [true, false, false],
		productForm:{},//保存商品准备提交的信息
		categoryId:0
	  }
    },
	components: {ProductDetail,ProductAttrDetail},
    methods: {
	  getActive(active){//第几步
			for(var i = 0;i<2;i++){
				this.showStatus[i] = false;
			}
			this.showStatus[active] = true;
			this.active = active;
			
			
	  },
	  getProductForm(data){
		  this.productForm = data;
		  this.categoryId = data.categoryInfo.value[1];
		  
		  alert(data.name)
		  var datas = {
			name:data.name,
			price:data.price,
			pic:data.pic.iconPath,
			brandId:data.brandInfo.value,
			categoryId:data.categoryInfo.value[1],
			stock:data.stock,
			lowStock:data.lowStock,
			unit:data.unit,
			description:data.description,
			publishStatus:data.publishStatus,
			newStatus:data.newStatus,
			recommandStatus:data.recommandStatus
		  }
		  this.$http
		  .post('/product/insertProduct',datas)
		  .then(response => {
		  	console.log(response.data)
			if(response.data.code == 200){
				//弹出消息框
				this.$message({
				message: '添加成功',
				type: 'success'
				});
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
	  }
    },
	
  }
</script>

<style >
	
</style>
