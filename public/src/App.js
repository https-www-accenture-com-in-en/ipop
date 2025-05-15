import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// Lazy load pages
const Home = lazy(() => import("./pages/home"));
const Contact = lazy(() => import("./pages/contact"));
const About = lazy(() => import("./pages/about"));
const ClockView = lazy(() => import("./pages/clockView"));
const SignUp = lazy(() => import("./authentication/signUp"));
const Login = lazy(() => import("./authentication/signIn"));
const ForgotPasswordPage = lazy(() => import("./authentication/forgotPassword"));
const AMData = lazy(() => import("./pages/admin"));
const NTND = lazy(() => import("./pages/NTND"));
const AMSNonTicketDelivery = lazy(() => import("./pages/NTD"));
const AD = lazy(() => import("./pages/AD"));
const AM = lazy(() => import("./pages/AM"));


const App = () => {
  return (
    <Router>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
        <Routes>
        <Route path= "/" element={<Login/>} />
        <Route path= "/forgot-password" element={<ForgotPasswordPage/>} />
        <Route  path="/register" element={<SignUp />} />
          {/* Common layout for all pages */}
          {/* <Route path="/" element={<HeaderSidebarLayout />}> */}
            <Route  path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path= "/contact" element={<Contact/>} />
            <Route path= "/clock-view" element={<ClockView/>} />
            <Route path= "/ntnd" element={<NTND/>} />
            <Route path= "/ntd" element={<AMSNonTicketDelivery/>} />
            <Route path= "/ad" element={<AD/>} /> 
             <Route path= "/am" element={<AM/>} />
            <Route path= "/admin" element={<AMData/>} />
          {/* </Route> */}
        </Routes>
      {/* </Suspense> */}
    </Router>
  );
};

export default App;
