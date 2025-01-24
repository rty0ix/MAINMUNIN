import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { CheckInForm } from './components/CheckInForm';
import { Dashboard } from './components/Dashboard';
import { Home } from './pages/Home';
import { Landing } from './pages/Landing';
import { GuardianNetwork } from './pages/GuardianNetwork';
import { BPOA } from './pages/BPOA';
import { BPOALogin } from './components/BPOALogin';
import { Deckys } from './pages/Deckys';
import { TTM } from './pages/TTM';
import { Cerbo } from './pages/Cerbo';
import { LLM } from './pages/LLM';
import { TestDeployment } from './pages/TestDeployment';
import { useAuthStore } from './store/authStore';

function App() {
  const user = useAuthStore((state) => state.user);

  const isBPOAAuthenticated = () => {
    return localStorage.getItem('bpoa_auth') === 'true' && user !== null;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/munin" element={<Landing />} />
        <Route path="/test-deployment" element={<TestDeployment />} />
        <Route path="/guardian-network" element={<GuardianNetwork />} />
        <Route path="/bpoa-login" element={<BPOALogin />} />
        <Route path="/bpoa-register" element={<RegisterForm />} />
        <Route
          path="/bpoa"
          element={
            isBPOAAuthenticated() ? <BPOA /> : <Navigate to="/bpoa-login" />
          }
        />
        <Route path="/deckys" element={<Deckys />} />
        <Route path="/ttm" element={<TTM />} />
        <Route path="/cerbo" element={<Cerbo />} />
        <Route path="/llm" element={<LLM />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/check-in"
          element={
            user?.role === 'kiosk' ? <CheckInForm /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/dashboard"
          element={
            user?.role === 'admin' ? <Dashboard /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;