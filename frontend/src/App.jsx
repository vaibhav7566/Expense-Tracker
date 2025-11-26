
import Layout from './routes/Routes'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { fetchMeAsync } from '../src/store/slices/userReducer'



const App = () => {
   const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // agar token hai toh server se user fetch karo
      dispatch(fetchMeAsync());
    }
  }, [dispatch]);


  return (
   <>
   <Layout />
   </>
  )
}

export default App