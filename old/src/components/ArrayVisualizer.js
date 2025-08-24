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

const ArrayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 2rem 0;
`;

const ArrayElement = styled(motion.div)`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
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

const ArrayVisualizer = ({ data, onUpdate }) => {
  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');

  const addElement = () => {
    if (inputValue.trim() !== '') {
      const newArray = [...data, parseInt(inputValue)];
      onUpdate(newArray);
      setInputValue('');
    }
  };

  const removeElement = (index) => {
    const newArray = data.filter((_, i) => i !== index);
    onUpdate(newArray);
  };

  const insertAtIndex = () => {
    if (inputValue.trim() !== '' && inputIndex.trim() !== '') {
      const index = parseInt(inputIndex);
      if (index >= 0 && index <= data.length) {
        const newArray = [...data];
        newArray.splice(index, 0, parseInt(inputValue));
        onUpdate(newArray);
        setInputValue('');
        setInputIndex('');
      }
    }
  };

  const clearArray = () => {
    onUpdate([]);
  };

  const generateRandomArray = () => {
    const randomArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100));
    onUpdate(randomArray);
  };

  const sortArray = () => {
    const sortedArray = [...data].sort((a, b) => a - b);
    onUpdate(sortedArray);
  };

  const reverseArray = () => {
    const reversedArray = [...data].reverse();
    onUpdate(reversedArray);
  };

  return (
    <Container>
      <Title>Array Visualization</Title>
      
      <ArrayContainer>
        {data.map((element, index) => (
          <ArrayElement
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => removeElement(index)}
            title={`Click to remove ${element}`}
          >
            {element}
          </ArrayElement>
        ))}
      </ArrayContainer>

      <InputSection>
        <Input
          type="number"
          placeholder="Enter value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Index (optional)"
          value={inputIndex}
          onChange={(e) => setInputIndex(e.target.value)}
        />
        <Button onClick={addElement}>Add Element</Button>
        <Button onClick={insertAtIndex}>Insert at Index</Button>
      </InputSection>

      <InputSection>
        <Button onClick={generateRandomArray}>Generate Random</Button>
        <Button onClick={sortArray}>Sort</Button>
        <Button onClick={reverseArray}>Reverse</Button>
        <Button onClick={clearArray} style={{ background: '#e74c3c' }}>Clear</Button>
      </InputSection>

      <StatsContainer>
        <StatCard>
          <StatValue>{data.length}</StatValue>
          <StatLabel>Elements</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{data.length > 0 ? Math.max(...data) : 0}</StatValue>
          <StatLabel>Maximum</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{data.length > 0 ? Math.min(...data) : 0}</StatValue>
          <StatLabel>Minimum</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            {data.length > 0 ? (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1) : 0}
          </StatValue>
          <StatLabel>Average</StatLabel>
        </StatCard>
      </StatsContainer>
    </Container>
  );
};

export default ArrayVisualizer; 