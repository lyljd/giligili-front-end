import axios from 'axios';

// 用户注册
const register = form => axios.post('/api/v1/register', form).then(res => res.data);

// 用户登陆
const login = form => axios.post('/api/v1/login', form).then(res => res.data);

//我
const me = () => axios.get(`/api/v1/me`).then(res => res.data);

// 用户详情
const getUser = id => axios.get(`/api/v1/user/${id}`).then(res => res.data);

// 修改昵称
const updateNickname = form => axios.put(`/api/v1/user/nickname`, form).then(res => res.data);

// 修改签名
const updateSignature = form => axios.put(`/api/v1/user/signature`, form).then(res => res.data);

// 修改密码
const updatePassword = form => axios.put(`/api/v1/user/password`, form).then(res => res.data);

// 上传头像
const uploadAvatar = form => axios.post('/api/v1/user/avatar', form).then(res => res.data);

export {
    register,
    login,
    me,
    getUser,
    updateNickname,
    updateSignature,
    updatePassword,
    uploadAvatar,
};