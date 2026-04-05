import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Toast from '../common/Toast';
import TransactionForm from '../transactions/TransactionForm';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';

export default function Layout() {
  const { state } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={state.darkMode ? 'dark' : ''}>
      <div className="bg-app min-h-screen text-main">
        <Sidebar
          onAddTransaction={() => setShowAddModal(true)}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        <div className={`transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <Header />
          <main className="p-8 min-h-[calc(100vh-73px)] relative">
            <div key={location.pathname} className="animate-page-in w-full h-full">
              <Outlet />
            </div>
          </main>
        </div>
        {state.toast && <Toast message={state.toast.message} type={state.toast.type} />}
        {showAddModal && (
          <Modal onClose={() => setShowAddModal(false)} title="New Transaction">
            <TransactionForm onClose={() => setShowAddModal(false)} />
          </Modal>
        )}
      </div>
    </div>
  );
}
