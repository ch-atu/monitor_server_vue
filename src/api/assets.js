import axios from '@/libs/api.request'

export const getMysqlList = parameter => {
  return axios.request({
    url: `/assets/api/mysql?${parameter}`,
    method: 'get'
  })
}

export const createMysql = data => {
  return axios.request({
    url: '/assets/api/mysql',
    data: data,
    method: 'post'
  })
}

export const updateMysql = (id, data) => {
  return axios.request({
    url: `/assets/api/mysql/${id}`,
    data: data,
    method: 'PUT'
  })
}

export const deleteMysql = id => {
  return axios.request({
    url: `/assets/api/mysql/${id}`,
    method: 'delete'
  })
}

export const deleteMysqlStat = host => {
  return axios.request({
    url: `/mysql/api/del_mysql_stat/${host}`,
    method: 'delete'
  })
}

export const getLinuxList = parameter => {
  return axios.request({
    url: `/assets/api/linux?${parameter}`,
    method: 'get'
  })
}

export const createLinux = data => {
  return axios.request({
    url: '/assets/api/linux',
    data: data,
    method: 'post'
  })
}

export const updateLinux = (id, data) => {
  return axios.request({
    url: `/assets/api/linux/${id}`,
    data: data,
    method: 'PUT'
  })
}

export const deleteLinux = id => {
  return axios.request({
    url: `/assets/api/linux/${id}`,
    method: 'delete'
  })
}

export const deleteLinuxStat = host => {
  return axios.request(
    {
      url: `/linux/api/del_linux_stat/${host}`,
      method: 'delete'
    }
  )
}

export const getRedisList = parameter => {
  return axios.request({
    url: `/assets/api/redis?${parameter}`,
    method: 'get'
  })
}

export const createRedis = data => {
  return axios.request({
    url: '/assets/api/redis',
    data: data,
    method: 'post'
  })
}

export const updateRedis = (id, data) => {
  return axios.request({
    url: `/assets/api/redis/${id}`,
    data: data,
    method: 'PUT'
  })
}

export const deleteRedis = id => {
  return axios.request({
    url: `/assets/api/redis/${id}`,
    method: 'delete'
  })
}

export const deleteRedisStat = host => {
  return axios.request({
    url: `/rds/api/del_redis_stat/${host}`,
    method: 'delete'
  })
}

export const createWindows = data => {
  return axios.request({
    url: '/assets/api/windows',
    data: data,
    method: 'post'
  })
}

export const getWindowsList = parameter => {
  return axios.request({
    url: `/assets/api/windows?${parameter}`,
    method: 'get'
  })
}

export const deleteWindows = id => {
  return axios.request({
    url: `/assets/api/windows/${id}`,
    method: 'delete'
  })
}

export const updateWindows = (id, data) => {
  return axios.request({
    url: `/assets/api/windows/${id}`,
    data: data,
    method: 'PUT'
  })
}

export const deleteWindowsStat = host => {
  return axios.request(
    {
      url: `/windows/api/del_windows_stat/${host}`,
      method: 'delete'
    }
  )
}












