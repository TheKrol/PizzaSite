import React from 'react';
import Main from './components/Main';
import Login from './pages/login.jsx';
import Register from './pages/signup.jsx';
import ForgetPass from './pages/forgetPassword';
import ResetPass from './pages/resetPassword';
import PizzaMenu from './pages/pizzaMenu';
import Profile from './pages/profile';
import OrderCart from './pages/orderCart';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
//import Header from './components/Header';
import Footer from './components/Footer';
import EmployeeCreate from './pages/employeeCreate';
import Contact from './pages/contact'; // Import the Contact component
import About from './pages/about'; // Import the About component
import BYO from './pages/Pizza/BYO';
import BBQ from './pages/Pizza/BBQ';
import HWN from './pages/Pizza/HWN';
import AMT from './pages/Pizza/AMT';
import VGE from './pages/Pizza/VGE';
import ABBQ from './pages/Pizza/ABBQ';
import ANTI from './pages/Salad/ANTI'
import GARDEN from './pages/Salad/GARDEN'
import GREEK from './pages/Salad/GREEK'
import { CartProvider } from './context/CartContext';
import EmployeeEdit from './pages/employeeEdit';
import EmployeeList from './pages/employeeList';
import TimeSheet from './pages/timeSheetPage';
import Inventory from './pages/inventory'; //Inventory view page
import EditInventory from './pages/inventoryEdit'; //Inventory edit page
import AddInventory from './pages/inventoryAdd'; //Inventory add item page
import TrackInventory from './pages/inventoryTrack.jsx' //Inventory tracking page
import TrackInventoryForm from './pages/inventoryTrackForm' //Inventory track form
import TimeEntryPage from './pages/timeEntryPage';
import OrderList from './pages/orderList'; // Sale_track
import OrderConfirmation from './pages/orderConfirmation.jsx'; //Order confirmation page

function App() {
  const { user } = useAuthContext();

  return (
    <div className="app-container">
      <CartProvider>
        <BrowserRouter>
          <div className="content-below-navbar">
            {/*<Header />*/}
            <Routes>
              <Route path='/' element={<Main />}></Route>
              <Route path='/profile' element={user ? <Profile /> : <Navigate to='/' />}></Route>{/*for Profile page. */}
              <Route path='/login' element={<Login />}></Route>{/*for Redirect login page. */}
              <Route path='/signup' element={!user ? <Register /> : <Navigate to='/' />}></Route>{/*for Redirect signup page.*/}
              <Route path='/forget-password' element={<ForgetPass />}></Route>{/*forget password page.*/}
              <Route path='/pizzaMenu' element={<PizzaMenu />}></Route>{/*pizza menu page.*/}
              <Route path='/reset-password/:resetToken' element={<ResetPass />}></Route> {/*reset password page.*/}
              <Route path='/contact' element={<Contact />}></Route> {/*For Contact Us */}
              <Route path='/about' element={<About />}></Route> {/*About Us */}
              <Route path="/employee" element={<EmployeeList />}></Route> {/*employee list */}
              {/* <Route path="/employee/:id" component={EmployeeDetails} /> */}
              <Route path="/employee/:id/edit" element={<EmployeeEdit />}></Route> {/*employee edit*/}
              <Route path="/employee-create" element={<EmployeeCreate />}></Route> {/*employee create*/}
              <Route path='/orderCart' element={<OrderCart />}></Route>{/*Order Cart Page*/}
              <Route path='*' element={<Navigate to='/' />} />  {/* Fallback route */}
              <Route path='/Pizza/BYO' element={<BYO />}></Route> {/* BYO pizza */}
              <Route path='/Pizza/BBQ' element={<BBQ />}></Route> {/* BBQ pizza */}
              <Route path='/Pizza/HWN' element={<HWN />}></Route> {/* HWN pizza */}
              <Route path='/Pizza/AMT' element={<AMT />}></Route> {/* AMT pizza */}
              <Route path='/Pizza/VGE' element={<VGE />}></Route> {/* VGE pizza */}
              <Route path='/Pizza/ABBQ' element={<ABBQ />}></Route> {/* ABBQ pizza */}
              <Route path='/Salad/ANTI' element={<ANTI />}></Route> {/* ANTI Salad */}
              <Route path='/Salad/GARDEN' element={<GARDEN />}></Route> {/* GARDEN Salad */}
              <Route path='/Salad/GREEK' element={<GREEK />}></Route> {/* GREEK Salad */}
              <Route path="/timesheet/:id" element={<TimeSheet />} />  {/* Route to the TimeSheetPage */}
              <Route exact path="/time-entry/:id" element={<TimeEntryPage />} />  {/* Route to the TimeEntryPage */}
              <Route path="/inventory" element={<Inventory />}></Route> {/*Inventory View*/}
              <Route path="/inventoryEdit" element={<EditInventory />}></Route> {/*Edit Inventory Items*/}
              <Route path='/inventoryAdd' element={<AddInventory />}></Route> {/*Add Inventory Items*/}
              <Route path='/inventoryTrack' element={<TrackInventory />}></Route> {/*Track Inventory Items*/}
              <Route path='/inventoryTrackForm' element={<TrackInventoryForm />}></Route> {/*Update & track inventory*/}
              <Route path='/orderConfirmation' element={<OrderConfirmation />}></Route> {/*Order confirmation page*/}
              <Route path='/order-list' element={<OrderList />}></Route> {/*Sale_Track*/}
            </Routes>
          </div>
          <div className="clear-fix"></div>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </div>
  );
}
export default App;