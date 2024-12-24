import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Category from './pages/Category';
import Subcategory from './pages/Subcategory';
import Inventory from './pages/Inventory';
import Stockin from './pages/Stockin';
import Stockout from './pages/Stockout';
import Purchase from './pages/Purchase';
import Reports from './pages/Reports';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/navbar' element={<Navbar/>}/>
        <Route path='/category' element={<Category/>}/>
        <Route path='/subcategory' element={<Subcategory/>}/>
        <Route path='/inventory' element={<Inventory/>}/>
        <Route path='/stockinward' element={<Stockin/>}/>
        <Route path='/stockoutward' element={<Stockout/>}/>
        <Route path='/purchasereturn' element={<Purchase/>}/>
        <Route path='/reports' element={<Reports/>}/>

      </Routes>
      
    </div>
  );
}

export default App;
