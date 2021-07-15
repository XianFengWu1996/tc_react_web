export const saveUserInfo = (data) => ({
    type: 'get_user', 
    data
})

export const authLogout = () => ({
    type: 'auth_logout'
})
