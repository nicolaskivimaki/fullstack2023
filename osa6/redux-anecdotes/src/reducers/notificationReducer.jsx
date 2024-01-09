import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    }
  }
})

let timeoutId
export const createNotification = (message) => {
    return dispatch => {
      dispatch(setNotification(message))
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => dispatch(setNotification('')), 5000)
    }
  }
  
  export const { setNotification, deleteNotification } = notificationSlice.actions
  export default notificationSlice.reducer
