import { Link, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import AddAddress from "./pages/AddAddress"
import { APIProvider } from "@vis.gl/react-google-maps"
import '@vis.gl/react-google-maps/examples.css';
import RotaCiz from "./pages/RotaCiz";
import YoldakiRota from "./pages/YoldakiRota";

const API_KEY = "AIzaSyCh-IugZWSojfTJOdMaujbd24XjkT8KHWU";


function App() {

  return (
     <APIProvider apiKey={API_KEY}>
      <div className="flex items-center justify-center my-5 gap-4">
        <Link to="/" className="p-2 bg-gray-400 text-white">anasayfa</Link>
        <Link to="/add-address" className="p-2 bg-gray-400 text-white">adres ekle</Link>
        <Link to="/rota-ciz" className="p-2 bg-gray-400 text-white">Rota çiz</Link>
        <Link to="/yoldaki-rota" className="p-2 bg-gray-400 text-white">Yoldaki Rota</Link>
      </div>
      <Routes>
          <Route index element={<Home />} />
          <Route path="add-address" element={<AddAddress />} />
          <Route path="rota-ciz" element={<RotaCiz />} />
          <Route path="yoldaki-rota" element={<YoldakiRota />} />
      </Routes>
      </APIProvider>
  )
}

export default App
