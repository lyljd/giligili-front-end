import axios from 'axios';

const postVideo = (form, callback) => axios.post('/api/v1/videos', form, {
    onUploadProgress: function(progressEvent) {
        callback(progressEvent)
    }
}).then(res => res.data);

// 视频详情
const getVideo = id => axios.get(`/api/v1/video/${id}`).then(res => res.data);

// 视频列表
const getVideos = () => axios.get('/api/v1/videos').then(res => res.data);

// 视频每日排行
const getVideoDailyRank = () => axios.get('/api/v1/videos/rank/daily').then(res => res.data);

// 视频搜索
const search = form => axios.post('/api/v1/videos/search', form).then(res => res.data);

// 视频删除
const deleteVideo = id => axios.delete(`/api/v1/video/${id}`).then(res => res.data);

// 视频更新
const updateVideo = (id, form, callback) => axios.put(`/api/v1/video/${id}`, form, {
    onUploadProgress: function(progressEvent) {
        callback(progressEvent)
    }
}).then(res => res.data);

export {
    getVideos,
    getVideo,
    postVideo,
    getVideoDailyRank,
    search,
    deleteVideo,
    updateVideo,
};