import './index.css'
import "react-easy-crop/react-easy-crop.css";
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <AppRoutes/>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  )
}

export default App
