import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Header from './components/Header';
import ArrayVisualizer from './components/ArrayVisualizer';
import LinkedListVisualizer from './components/LinkedListVisualizer';
import BSTVisualizer from './components/BSTVisualizer';
import HashMapVisualizer from './components/HashMapVisualizer';
import ConversionPanel from './components/ConversionPanel';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.main`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const TabContainer = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 0.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }
`;

const ContentArea = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  min-height: 600px;
`;

function App() {
  const [activeTab, setActiveTab] = useState('array');
  const [dataStructures, setDataStructures] = useState({
    array: [64, 34, 25, 12, 22, 11, 90],
    linkedList: [64, 34, 25, 12, 22, 11, 90],
    bst: [64, 34, 25, 12, 22, 11, 90],
    hashMap: { 0: 64, 1: 34, 2: 25, 3: 12, 4: 22, 5: 11, 6: 90 }
  });

  const tabs = [
    { id: 'array', label: 'Array', component: ArrayVisualizer },
    { id: 'linkedList', label: 'Linked List', component: LinkedListVisualizer },
    { id: 'bst', label: 'Binary Search Tree', component: BSTVisualizer },
    { id: 'hashMap', label: 'HashMap', component: HashMapVisualizer }
  ];

  const updateDataStructure = (type, newData) => {
    setDataStructures(prev => ({
      ...prev,
      [type]: newData
    }));
  };

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <AppContainer>
      <Header />
      <MainContent>
        <TabContainer>
          {tabs.map(tab => (
            <Tab
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Tab>
          ))}
        </TabContainer>

        <ContentArea
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {ActiveComponent && (
            <ActiveComponent
              data={dataStructures[activeTab]}
              onUpdate={(newData) => updateDataStructure(activeTab, newData)}
            />
          )}
        </ContentArea>

        <ConversionPanel
          dataStructures={dataStructures}
          onUpdate={updateDataStructure}
        />
      </MainContent>
    </AppContainer>
  );
}

export default App; 