import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  const style = {
    border: 'solid',
    padding: 15,
    borderWidth: 2
  }
  if (notification !== '') {
    return <div style={style}>
    {notification}
    </div>
  }
}

export default Notification