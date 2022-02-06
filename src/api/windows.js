import axios from '@/libs/api.request'

export const getWindowsStatList = parameter => {
  return axios.request({
    url: `/windows/api/windows-stat-list?${parameter}`,
    method: 'get'
  })
}

export const getWindowsStat = parameter => {
  return axios.request({
    url: `/windows/api/windows-stat?${parameter}`,
    method: 'get'
  })
}

export const getWindowsStatHis = parameter => {
  return axios.request({
    url: `/windows/api/windows-stat-his?${parameter}`,
    method: 'get'
  })
}

export const getWindowsDisk = parameter => {
  return axios.request({
    url: `/windows/api/windows-disk?${parameter}`,
    method: 'get'
  })
}










