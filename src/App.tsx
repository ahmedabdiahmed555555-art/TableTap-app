/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerView from './components/CustomerView';
import StaffDashboard from './components/StaffDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0A0A0C] text-white font-sans selection:bg-teal-400 selection:text-slate-950 relative overflow-x-hidden">
        {/* Background Glows */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<CustomerView />} />
            <Route path="/staff" element={<StaffDashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

