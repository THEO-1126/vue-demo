<template>
  <div id="view">
    <div id="box">
      <vxe-toolbar>
          <template #buttons>
            <vxe-input v-model="filter.nickName"  placeholder="输入姓名" @keyup.enter.native="searchEvent()"></vxe-input>
            <vxe-input v-model="filter.name"  placeholder="输入账号" @keyup.enter.native="searchEvent()"></vxe-input>
            <vxe-button  status="primary" content="查询" @click="searchEvent()"></vxe-button>
            <vxe-button  content="返回全部数据" status="danger"  @click="resetEvent()" :disabled="!searchFlag"></vxe-button>
            <vxe-button status="primary" icon="vxe-icon-square-plus" @click="insertEvent()">新增</vxe-button>
          </template>
        </vxe-toolbar>
        <vxe-table :data="data.list" class="table"
            border
            ref="userTable"
            height="80%"
            :row-config="{isHover: true}"
            :loading="tableLoading">
            <vxe-column type="seq" width="100"></vxe-column>
            <vxe-column field="nickName" title="姓名" width="100" sortable type="html"></vxe-column>
            <vxe-column field="username" title="账号" width="100" type="html"></vxe-column>
            <vxe-column field="mobile" title="电话" width="120"></vxe-column>
            <vxe-column field="identity" title="身份证" width="100"></vxe-column>
            <vxe-column field="homeAddress" title="家庭住址" width="150"></vxe-column>
            <vxe-column field="onboardingTime" title="入职时间" width="130" sortable></vxe-column>
            <vxe-column field="departureTime" title="离职时间" width="130" sortable></vxe-column>
            <vxe-column field="status" title="状态" width="100">
              <template v-slot="{ row }">
                <el-tag v-if="row.status=='在职'" type="success">{{ row.status }}</el-tag>
                <el-tag v-else type="info">{{ row.status }}</el-tag>
              </template>
            </vxe-column>
            <vxe-column title="操作" width="180" show-overflow>
            <template #default="{ row}">
              <vxe-button status="primary" icon="vxe-icon-edit" @click="editEvent(row)"></vxe-button>
              <vxe-button status="danger" icon="vxe-icon-delete" @click="removeEvent(row)"></vxe-button>
            </template>
          </vxe-column>
            <template #empty>
            <span style="color: red;">
              <img src="https://n.sinaimg.cn/sinacn17/w120h120/20180314/89fc-fyscsmv5911424.gif">
              <p>没有更多数据了！</p>
            </span>
          </template>
      </vxe-table>
      <vxe-pager
        :loading="tableLoading"
        :current-page="tablePage.currentPage"
        :page-size="tablePage.pageSize"
        :page-sizes= "tablePage.pageSizes"
        :total="tablePage.total"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="handlePageChange">
      </vxe-pager>

      <!-- 弹出的新增或编辑表单 -->
      <vxe-modal v-model="showEdit" :title="selectRow ? '编辑&保存' : '新增&保存'" width="800" 
            min-width="600" min-height="300" :loading="submitLoading" resize destroy-on-close>
          <template #default>
            <vxe-form :data="formData" :rules="formRules" title-align="right" title-width="100" @submit="submitEvent">
              <vxe-form-item field="nickName" title="姓名" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-input v-model="data.nickName" placeholder="请输入名称"></vxe-input>
                </template>
              </vxe-form-item>
              <vxe-form-item field="identity" title="身份证" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-input v-model="data.identity" placeholder="请输入身份证"></vxe-input>
                </template>
              </vxe-form-item>
              <vxe-form-item field="age" title="年龄" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-input v-model="data.age" placeholder="请输年龄"></vxe-input>
                </template>
              </vxe-form-item>
              <vxe-form-item field="mobile" title="电话" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-input v-model="data.mobile" placeholder="请输入电话"></vxe-input>
                </template>
              </vxe-form-item>
              <vxe-form-item field="username" title="用户名" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-input v-model="data.username" placeholder="请输入用户名"></vxe-input>
                </template>
              </vxe-form-item>

              <vxe-form-item field="password" title="密码" :span="12" :item-render="{}" v-if="!selectRow">
                <template #default="{ data }">
                  <vxe-input v-model="data.password" placeholder="请输入密码"></vxe-input>
                </template>
              </vxe-form-item>

              <vxe-form-item field="onboardingTime" title="入职时间" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-input v-model="data.onboardingTime" type="date" placeholder="请选择日期" transfer></vxe-input>
                </template>
              </vxe-form-item>
              <vxe-form-item field="departureTime" title="离职时间" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-input v-model="data.departureTime" type="date" placeholder="请选择日期" transfer></vxe-input>
                </template>
              </vxe-form-item>

              <!-- 角色 下拉框多选 -->
              <vxe-form-item field="roleIdList" title="角色" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-select v-model="data.roleIdList" multiple clearable transfer>
                    <vxe-option v-for="item in roleList" :key="item.roleId" :value="item.roleId" :label="item.roleName"></vxe-option>
                  </vxe-select>
                </template>
              </vxe-form-item>

              <!-- 状态 单选 -->
              <vxe-form-item field="status" title="状态" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-radio-group v-model="data.status">
                    <vxe-radio label="在职" content="在职"></vxe-radio>
                    <vxe-radio label="离职" content="离职"></vxe-radio>
                  </vxe-radio-group>
                </template>
              </vxe-form-item>

              <vxe-form-item field="homeAddress" title="家庭住址" :span="24" :item-render="{}">
                <template #default="{ data }">
                  <vxe-textarea v-model="data.homeAddress" :autosize="{minRows: 2, maxRows: 4}"></vxe-textarea>
                </template>
              </vxe-form-item>
              
              <vxe-form-item align="center" title-align="left" :span="24">
                <template #default>
                  <vxe-button status="primary" type="submit">提交</vxe-button>
                  <vxe-button type="reset">重置</vxe-button>
                </template>
              </vxe-form-item>
            </vxe-form>
          </template>
        </vxe-modal>

  </div>
</div>
</template>
<script>
import {dateFormat} from '../../utils/dateUtil'  // 日期格式化
import { VXETable } from 'vxe-table'
import console from 'console'

export default { 
  name:"userList",
  data() {
    return {
      searchFlag:false, // 搜索标志
      tableLoading: false,
      submitLoading: false,
      tablePage: {
        currentPage: 1,
        pageSize: 5,
        pageSizes:[5,10,20,50,100],
        total: 0
      },
      searchInfo:{
        name:'',
        nickName:'',
        currentPage:'',
        pageSize:''
      },
      filter:{
        name:'',
        nickName:''
      },
      data:{
        list: [],  // 用于在界面显示的数据
        tableData:[],  // 存放真正的数据
        tableTotal:0,
        searchTotal:0
        // listCopy:[], // 用于查询前后存放的假数据
      },
      showEdit: false,
      selectRow:null,
      formRules: {
        username: [
          { required: true, message: '请输入用户名' },
        ],
        nickName: [
          { required: true, message: '请输入姓名' }
        ],
        age: [
          { required: true, message: '请输入年龄' }
        ],
        mobile:[
          { required: true, message: '请输入手机号' },
          { min: 11, max: 11, message: '长度 11 个字符' }
        ],
        identity:[
          { required: true, message: '请输入身份证' },
          { min: 18, max: 18, message: '长度 18 个字符'}
        ],
        homeAddress:[
          { required: true, message: '请输入家庭住址' }
        ],
        roleIdList:[
          { required: true, message: '请选择角色' }
        ],
        status:[
          { required: true, message: '请选择状态' }
        ],
        password:[
          { required: true, message: '请输入密码' }
        ]
      },      
      formData: { // 弹出的表单数据
        username: '',
        nickName: '',
        mobile:'',
        roleName: '',
        onboardingTime:'',
        departureTime:'',
        age: '',
        homeAddress:'',
        status:'',
        roleIdList:'',
        identity:'',
        password:'',
      },
      roleList: [],
    }
  },

  methods:{
      insertEvent(){
        this.showEdit=true,
        this.selectRow=null,
        this.getRoleNameList()
        this.formData = {
          username: '',
          nickName: '',
          mobile:'',
          identity:'',
          onboardingTime:'',
          departureTime:'',
          age: '',
          homeAddress:'',
          status:'',
          identity:'',
          password:'',
          roleIdList:'',
        }
      },
      editEvent(row){
        this.getRoleNameList()
        this.selectRow = row
        this.showEdit = true
        this.formData = {
          userId:row.userId,
          username: row.username,
          nickName: row.nickName,
          mobile:row.mobile,
          onboardingTime:row.onboardingTime,
          departureTime:row.departureTime,
          age: row.age,
          homeAddress:row.homeAddress,
          status:row.status,
          identity:row.identity,
          roleIdList:row.roleIdList
        }
      },
      getUserListTotalPage(){
          this.$store.dispatch('GetUserListTotalPage').then((res) => {  
          this.data.tableTotal=res.data.data
          this.tablePage.total = this.data.tableTotal
          this.tableLoading = false

          }).catch((err) => {
              this.$message({
                  showClose: true,
                  message: '无权访问！',
                  type: 'error'
              });
          })
      },

      //  分页查询
      getUserListByPage(){
        this.tableLoading = true
          this.$store.dispatch('GetUserListByPage',this.tablePage).then((res) => {
            let statusCode = res.data.statusCode
                // 判断结果
            if (statusCode==200) {
                this.data.list=res.data.data
                this.tableLoading = false
                this.data.list.forEach(item=>{
                  var roleIdList=[]
                  item.roleList.forEach(i=>{
                    roleIdList.push(i.roleId)
                  })
                  item.roleIdList=roleIdList
                  if(item.onboardingTime!=null){
                    item.onboardingTime =dateFormat(item.onboardingTime)
                  }
                  if(item.departureTime!=null){
                    item.departureTime =dateFormat(item.departureTime)
                  }
                })
                this.data.tableData=this.data.list
            } else {
                console.log("错误")
            }
          }).catch((err) => {
              console.log(err);
              this.$message({
                showClose: true,
                message: '无权访问！',
                type: 'error'
              });
          })
      },
      // 搜索事件 
      async searchEvent() {
        const nickName = this.$XEUtils.toValueString(this.filter.nickName).trim().toLowerCase()
        const name = this.$XEUtils.toValueString(this.filter.name).trim().toLowerCase()
        if(nickName || name){
          this.searchFlag=true
          this.searchInfo.name=name
          this.searchInfo.nickName=nickName
          this.searchInfo.currentPage=this.tablePage.currentPage
          this.searchInfo.pageSize=this.tablePage.pageSize
          console.log(this.searchInfo)
          await this.searchUserList()
          // await this.searchUserListTotalPage()    
        }
    },
    resetEvent(){
      if(this.searchFlag){
        this.searchFlag=false
        this.filter.name='',
        this.filter.nickName=''
        this.getUserListByPage()
        this.tablePage.total=this.data.tableTotal
      }
    },
    searchUserList(){
      console.log(this.searchInfo)
      this.$store.dispatch("SearchUserList",this.searchInfo).then((res)=>{
        let statusCode=res.data.statusCode
        if (statusCode==200) {
            this.data.list=res.data.data
            this.tableLoading = false
            this.data.list.forEach(item=>{
              var roleIdList=[]
              item.roleList.forEach(i=>{
                roleIdList.push(i.roleId)
              })
              item.roleIdList=roleIdList
              if(item.onboardingTime!=null){
                item.onboardingTime =dateFormat(item.onboardingTime)
              }
              if(item.departureTime!=null){
                item.departureTime =dateFormat(item.departureTime)
              }
            })
            this.searchUserListTotalPage()
        } else {
            console.log("错误")
        }
      }).catch((err) => {
          console.log(err);
          this.$message({
            showClose: true,
            message: '无权访问！',
            type: 'error'
          });
      })
    },
    searchUserListTotalPage(){
      this.$store.dispatch('SearchUserListTotalPage',this.searchInfo).then((res) => {
        this.data.searchTotal=res.data.data
        this.tablePage.total=this.data.searchTotal
        this.tableLoading = false
        }).catch((err) => {
          console.log(err)
            this.$message({
                showClose: true,
                message: '无权访问！',
                type: 'error'
            });
        })
    },
    insertUser(userInfo){
      this.$store.dispatch("InsertUser",userInfo).then((res)=>{
          console.log(res.data)
          if(res.data){
            this.submitLoading = false
            VXETable.modal.message({ content: '新增成功', status: 'success' })
            this.getUserListByPage()
            this.showEdit = false
            this.data.tableTotal=this.data.tableTotal+1
            this.tablePage.total=this.data.tableTotal
          }else{
            this.submitLoading = false
            this.showEdit = true
            VXETable.modal.message({ content: '新增错误', status: 'error' })
          }
      }).catch((err)=>{
          this.submitLoading = false
          this.showEdit = true
          console.log("错误"+err)
          VXETable.modal.message({ content: '新增错误', status: 'error' })
      })
    },
    updateUser(userInfo){
      this.$store.dispatch("UpdateUser",userInfo).then((res)=>{
          if(res.data){
            this.submitLoading = false
            VXETable.modal.message({ content: '更新成功', status: 'success' })
            this.getUserListByPage()
            this.showEdit = false
          }else{
            this.submitLoading = false
            this.showEdit = true
            VXETable.modal.message({ content: '更新错误', status: 'error' })
          }
      }).catch((err)=>{
          this.submitLoading = false
          this.showEdit = true
          VXETable.modal.message({ content: '更新错误', status: 'error' })
      })
    },
    //  提交
    submitEvent() {
        this.submitLoading = true
        var roleList=[];
        var submitFormData={};
        for(var i=0;i<this.formData.roleIdList.length;i++){
            roleList[i]={}
            roleList[i]["roleId"]=this.formData.roleIdList[i]
        }
        for(var item in this.formData){
          if(this.formData[item]){
            submitFormData[item]=this.formData[item]
          }
        }
        submitFormData["roleList"]=roleList
      if(!this.selectRow){
        this.insertUser(submitFormData)
      }else{
        this.updateUser(submitFormData)
      }
    },
    
    // 删除  async 和 await来实现同步和异步
    async removeEvent(row) {
      const type = await VXETable.modal.confirm('您确定要删除该数据?')
      if (type === 'confirm'){
        let userId=row.userId
        this.deleteUser(userId)
      }
    },
    // 删除员工
    deleteUser(userId){
      this.$store.dispatch('DeleteUser',userId).then((res=>{
          if(res){
            VXETable.modal.message({ content: '删除成功', status: 'success' })
            this.data.tableTotal=this.data.tableTotal-1
            this.tablePage.total=this.data.tableTotal
            this.getUserListByPage()
          }else{
            VXETable.modal.message({ content: '删除错误', status: 'error' })
          }
      }))
    },

    // 获取所有的角色名
    getRoleNameList(){
      this.$store.dispatch('GetRoleNameList').then((res=>{
        this.roleList=res.data;
      }))
    },
    // 分页组件触发 
    handlePageChange ({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      if(this.searchFlag){
        // this.searchUserList()
        this.searchEvent()
      }else{
        this.getUserListByPage()
      }
      
    },
  },

  async created(){
      // await this.getUserList()
      await this.getUserListTotalPage()
      await this.getUserListByPage()
  }
}
</script>
  
  <style scoped>
  #box{
    width: 95%;
    height: 100%;
    margin: auto;
    margin-top: 20px;
  }
  #box .table{
    margin-top: 20px;
    margin: auto;
  }
  </style>