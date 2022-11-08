import router from '@/router'

function checkToken() {
    let t = localStorage.getItem("token");
    if (t === null || t === '') {
        return false
    }
    return true
}

function checkRefreshToken() {
    let t = localStorage.getItem("refresh_token");
    if (t === null || t === '') {
        return false
    }
    return true
}

function clearAllTokenAndToLoginPage() {
    localStorage.removeItem("token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("uid")
    router.push({ name: 'login' })
}

export {
    checkToken,
    checkRefreshToken,
    clearAllTokenAndToLoginPage,
}