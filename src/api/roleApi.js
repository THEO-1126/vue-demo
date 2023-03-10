import request from '@/utils/request' //引入封装好的 axios 请求

export function getRoleList() { // 获取 角色列表
  return request({ //使用封装好的 axios 进行网络请求
    url: '/getRoleList',
    method: 'get',
  })
}


export function insertRole(role) { // 插入
  return request({ //使用封装好的 axios 进行网络请求
    url: '/insertRole',
    method: 'post',
    data:role
  })
}

export function updateRole(role) { // 更新
  return request({ //使用封装好的 axios 进行网络请求
    url: '/updateRole',
    method: 'post',
    data:role
  })
}

export function deleteRoleById(roleId) { 
  return request({ //使用封装好的 axios 进行网络请求
    url: '/deleteRoleById',
    method: 'get',
    params:{
      roleId:roleId
    }
  })
}

export function searchRoleByName(roleName) { 
  return request({ //使用封装好的 axios 进行网络请求
    url: '/searchRoleByName',
    method: 'get',
    params:{
      roleName:roleName
    }
  })
}

export function insertRoleMenu(role) { 
  return request({ //使用封装好的 axios 进行网络请求
    url: '/insertRoleMenu',
    method: 'post',
    data:role
  })
}