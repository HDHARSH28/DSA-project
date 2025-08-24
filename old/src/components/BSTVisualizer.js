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

const TreeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  min-height: 400px;
  position: relative;
`;

const TreeNode = styled(motion.div)`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  position: absolute;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`;

const TreeLevel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin: 1rem 0;
  position: relative;
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

const BSTVisualizer = ({ data, onUpdate }) => {
  const [inputValue, setInputValue] = useState('');

  // Function to build BST from array
  const buildBST = (arr) => {
    if (!arr || arr.length === 0) return null;
    
    const sortedArr = [...arr].sort((a, b) => a - b);
    return buildBalancedBST(sortedArr, 0, sortedArr.length - 1);
  };

  const buildBalancedBST = (arr, start, end) => {
    if (start > end) return null;
    
    const mid = Math.floor((start + end) / 2);
    const root = { val: arr[mid], left: null, right: null };
    
    root.left = buildBalancedBST(arr, start, mid - 1);
    root.right = buildBalancedBST(arr, mid + 1, end);
    
    return root;
  };

  // Function to get tree levels for visualization
  const getTreeLevels = (root) => {
    if (!root) return [];
    
    const levels = [];
    const queue = [{ node: root, level: 0 }];
    
    while (queue.length > 0) {
      const { node, level } = queue.shift();
      
      if (!levels[level]) levels[level] = [];
      levels[level].push(node.val);
      
      if (node.left) queue.push({ node: node.left, level: level + 1 });
      if (node.right) queue.push({ node: node.right, level: level + 1 });
    }
    
    return levels;
  };

  // Function to calculate node positions
  const getNodePositions = (levels) => {
    const positions = [];
    const baseWidth = 80;
    const baseHeight = 100;
    
    levels.forEach((level, levelIndex) => {
      const levelWidth = level.length * baseWidth;
      const startX = -levelWidth / 2;
      
      level.forEach((val, nodeIndex) => {
        const x = startX + nodeIndex * baseWidth;
        const y = levelIndex * baseHeight;
        positions.push({ val, x, y });
      });
    });
    
    return positions;
  };

  const addElement = () => {
    if (inputValue.trim() !== '') {
      const newArray = [...data, parseInt(inputValue)];
      onUpdate(newArray);
      setInputValue('');
    }
  };

  const removeElement = (value) => {
    const newArray = data.filter(item => item !== value);
    onUpdate(newArray);
  };

  const clearTree = () => {
    onUpdate([]);
  };

  const generateRandomTree = () => {
    const randomArray = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));
    onUpdate(randomArray);
  };

  const balanceTree = () => {
    const balancedArray = [...data].sort((a, b) => a - b);
    onUpdate(balancedArray);
  };

  const bst = buildBST(data);
  const levels = getTreeLevels(bst);
  const nodePositions = getNodePositions(levels);

  return (
    <Container>
      <Title>Binary Search Tree Visualization</Title>
      
      <TreeContainer>
        {nodePositions.map((node, index) => (
          <TreeNode
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            style={{
              left: `calc(50% + ${node.x}px)`,
              top: `${node.y}px`
            }}
            onClick={() => removeElement(node.val)}
            title={`Click to remove ${node.val}`}
          >
            {node.val}
          </TreeNode>
        ))}
      </TreeContainer>

      <InputSection>
        <Input
          type="number"
          placeholder="Enter value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={addElement}>Add Element</Button>
      </InputSection>

      <InputSection>
        <Button onClick={generateRandomTree}>Generate Random</Button>
        <Button onClick={balanceTree}>Balance Tree</Button>
        <Button onClick={clearTree} style={{ background: '#e74c3c' }}>Clear</Button>
      </InputSection>

      <StatsContainer>
        <StatCard>
          <StatValue>{data.length}</StatValue>
          <StatLabel>Nodes</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{levels.length}</StatValue>
          <StatLabel>Height</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{data.length > 0 ? Math.max(...data) : 0}</StatValue>
          <StatLabel>Maximum</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{data.length > 0 ? Math.min(...data) : 0}</StatValue>
          <StatLabel>Minimum</StatLabel>
        </StatCard>
      </StatsContainer>
    </Container>
  );
};

export default BSTVisualizer; 