<template>
	<div style="margin-left: 40px;margin-top: 50px;">
		<div style="margin-left: 90px;">
			<span v-for="(attr,index) in productAttr">
				<span style="font-size: 13px;">{{attr.name}}:</span>
				<div style="height: 15px;"></div>
				<el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
					<el-checkbox  v-for="option in attr.attrOptions" :label="option.id" :key="option.id">{{option.name}}</el-checkbox>
				</el-checkbox-group>
				<br />
			</span>
		</div>
		
		<br /><br />
		<el-button style="margin-top: 12px;" @click="prev()">上一步</el-button>
		<el-button style="margin-top: 12px;" @click="next()">确认添加</el-button>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				productAttr:[],
				checkedCities:[], //已选中的值
				stockTable:{
					stockInfo:[]
				}
			};
		},
		props: {'categoryId':{default:0}},
		methods:{
			prev(){
				this.$emit('active',0)
			},
			next(){//下一步
				this.$emit('active',2)
			},
			handleCheckedCitiesChange(value) {
				alert(value)
			    // let checkedCount = value.length;
			    // this.checkAll = checkedCount === this.cities.length;
			    // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
			}
		},
		watch:{
			categoryId:function(val){//查询所有属性
				this.$http
				.post('/productAttr/list',this.$qs.stringify({categoryId:val}))
				.then(response => {
					console.log(response.data)
					this.productAttr = response.data.data;
				})
				.catch(error => {
				  	//弹出消息框
				  	this.$message({
						message: '服务器异常',
						type: 'error'
				  	});
				})
			}
		}
	}
</script>

<style>
</style>
