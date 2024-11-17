import React from 'react';
import { Agent } from 'react-agents';
import SkinCareAdvisorAgent from './SkinCareAdvisorAgent';

const App: React.FC = () => {
  return (
    <Agent>
      <SkinCareAdvisorAgent />
    </Agent>
  );
};

export default App;