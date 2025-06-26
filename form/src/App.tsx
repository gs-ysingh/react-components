import React, { useState } from 'react';
import SimpleFormExample from './SimpleFormExample';
import MultiStepFormExample from './MultiStepFormExample';


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simple' | 'multi'>('simple');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
        <button
          onClick={() => setActiveTab('simple')}
          style={{
            padding: '0.75rem 2rem',
            marginRight: '1rem',
            border: 'none',
            borderBottom: activeTab === 'simple' ? '3px solid #007bff' : '3px solid transparent',
            background: 'none',
            fontWeight: activeTab === 'simple' ? 'bold' : 'normal',
            color: activeTab === 'simple' ? '#007bff' : '#333',
            cursor: 'pointer',
            fontSize: '1.1rem',
            outline: 'none',
            transition: 'border-bottom 0.2s'
          }}
        >
          Simple Form
        </button>
        <button
          onClick={() => setActiveTab('multi')}
          style={{
            padding: '0.75rem 2rem',
            border: 'none',
            borderBottom: activeTab === 'multi' ? '3px solid #007bff' : '3px solid transparent',
            background: 'none',
            fontWeight: activeTab === 'multi' ? 'bold' : 'normal',
            color: activeTab === 'multi' ? '#007bff' : '#333',
            cursor: 'pointer',
            fontSize: '1.1rem',
            outline: 'none',
            transition: 'border-bottom 0.2s'
          }}
        >
          Multi-Step Form
        </button>
      </div>
      <div>
        {activeTab === 'simple' && <SimpleFormExample />}
        {activeTab === 'multi' && <MultiStepFormExample />}
      </div>
    </div>
  );
};

export default App;
