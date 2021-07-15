export const getRewardInfo = (reward) => ({
    type: 'get_reward',
    reward
})

export const setRewardInfo = (reward) => ({
    type: 'set_reward',
    reward
})

export const applyRewardPt = (point) => ({
    type: 'apply_point',
    point
})

export const rewardLogout = () => ({
    type: 'reward_logout'
})