import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h2`
  color: #333;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
`;

const HashMapContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const KeyValuePair = styled(motion.div)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`;

const Key = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Value = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const InputSection = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #667eea;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const StatCard = styled.div`
  background: rgba(102, 126, 234, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  border: 1px solid rgba(102, 126, 234, 0.2);
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
`;

const HashMapVisualizer = ({ data, onUpdate }) => {
  const [inputKey, setInputKey] = useState('');
  const [inputValue, setInputValue] = useState('');

  const addKeyValue = () => {
    if (inputKey.trim() !== '' && inputValue.trim() !== '') {
      const newHashMap = { ...data, [inputKey]: parseInt(inputValue) };
      onUpdate(newHashMap);
      setInputKey('');
      setInputValue('');
    }
  };

  const removeKeyValue = (key) => {
    const newHashMap = { ...data };
    delete newHashMap[key];
    onUpdate(newHashMap);
  };

  const clearHashMap = () => {
    onUpdate({});
  };

  const generateRandomHashMap = () => {
    const randomHashMap = {};
    for (let i = 0; i < 6; i++) {
      randomHashMap[i] = Math.floor(Math.random() * 100);
    }
    onUpdate(randomHashMap);
  };

  const sortByValue = () => {
    const sortedEntries = Object.entries(data).sort(([,a], [,b]) => a - b);
    const sortedHashMap = Object.fromEntries(sortedEntries);
    onUpdate(sortedHashMap);
  };

  const sortByKey = () => {
    const sortedEntries = Object.entries(data).sort(([a], [b]) => parseInt(a) - parseInt(b));
    const sortedHashMap = Object.fromEntries(sortedEntries);
    onUpdate(sortedHashMap);
  };

  const keyValuePairs = Object.entries(data);

  return (
    <Container>
      <Title>HashMap Visualization</Title>
      
      {keyValuePairs.length > 0 ? (
        <HashMapContainer>
          {keyValuePairs.map(([key, value], index) => (
            <KeyValuePair
              key={key}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => removeKeyValue(key)}
              title={`Click to remove key ${key}`}
            >
              <Key>Key: {key}</Key>
              <Value>{value}</Value>
            </KeyValuePair>
          ))}
        </HashMapContainer>
      ) : (
        <EmptyState>
          <p>No key-value pairs in the HashMap</p>
          <p>Add some elements to get started!</p>
        </EmptyState>
      )}

      <InputSection>
        <Input
          type="text"
          placeholder="Enter key"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Enter value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={addKeyValue}>Add Key-Value</Button>
      </InputSection>

      <InputSection>
        <Button onClick={generateRandomHashMap}>Generate Random</Button>
        <Button onClick={sortByValue}>Sort by Value</Button>
        <Button onClick={sortByKey}>Sort by Key</Button>
        <Button onClick={clearHashMap} style={{ background: '#e74c3c' }}>Clear</Button>
      </InputSection>

      <StatsContainer>
        <StatCard>
          <StatValue>{keyValuePairs.length}</StatValue>
          <StatLabel>Key-Value Pairs</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            {keyValuePairs.length > 0 ? Math.max(...Object.values(data)) : 0}
          </StatValue>
          <StatLabel>Maximum Value</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            {keyValuePairs.length > 0 ? Math.min(...Object.values(data)) : 0}
          </StatValue>
          <StatLabel>Minimum Value</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            {keyValuePairs.length > 0 
              ? (Object.values(data).reduce((a, b) => a + b, 0) / keyValuePairs.length).toFixed(1) 
              : 0
            }
          </StatValue>
          <StatLabel>Average Value</StatLabel>
        </StatCard>
      </StatsContainer>
    </Container>
  );
};

export default HashMapVisualizer; 