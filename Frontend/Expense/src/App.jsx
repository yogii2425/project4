import React, { useState } from 'react';
import EmployeeDashboard from './pages/EmployeeDashboard';
import  dashboardCards  from './data/dashboardData';


const AdminDashboard = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <TopBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
        {dashboardCards.map((card) => (
          <Card key={card.id} card={card} onClick={setSelectedCard} />
        ))}
      </div>

      {selectedCard && <Modal card={selectedCard} onClose={() => setSelectedCard(null)} />}
    </div>
  );
};

export default AdminDashboard;
