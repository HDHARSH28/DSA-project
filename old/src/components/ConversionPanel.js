import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ConversionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ConversionCard = styled(motion.div)`
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(102, 126, 234, 0.5);
    transform: translateY(-2px);
  }
`;

const ConversionTitle = styled.h4`
  color: #667eea;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ConversionDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
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

const ResultSection = styled.div`
  background: rgba(102, 126, 234, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const ResultTitle = styled.h5`
  color: #667eea;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ResultContent = styled.div`
  color: #333;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const ConversionPanel = ({ dataStructures, onUpdate }) => {
  const [conversionResults, setConversionResults] = useState({});

  // Array to Linked List conversion
  const arrayToLinkedList = () => {
    const result = `Array: [${dataStructures.array.join(', ')}]\nLinked List: ${dataStructures.array.join(' -> ')} -> NULL`;
    setConversionResults(prev => ({ ...prev, arrayToLinkedList: result }));
    onUpdate('linkedList', [...dataStructures.array]);
  };

  // Array/Linked List to BST conversion
  const arrayToBST = () => {
    const sortedArray = [...dataStructures.array].sort((a, b) => a - b);
    const result = `Array: [${dataStructures.array.join(', ')}]\nSorted for BST: [${sortedArray.join(', ')}]`;
    setConversionResults(prev => ({ ...prev, arrayToBST: result }));
    onUpdate('bst', sortedArray);
  };

  const linkedListToBST = () => {
    const sortedArray = [...dataStructures.linkedList].sort((a, b) => a - b);
    const result = `Linked List: ${dataStructures.linkedList.join(' -> ')} -> NULL\nSorted for BST: [${sortedArray.join(', ')}]`;
    setConversionResults(prev => ({ ...prev, linkedListToBST: result }));
    onUpdate('bst', sortedArray);
  };

  // Linked List to Array conversion
  const linkedListToArray = () => {
    const result = `Linked List: ${dataStructures.linkedList.join(' -> ')} -> NULL\nArray: [${dataStructures.linkedList.join(', ')}]`;
    setConversionResults(prev => ({ ...prev, linkedListToArray: result }));
    onUpdate('array', [...dataStructures.linkedList]);
  };

  // BST to HashMap conversion
  const bstToHashMap = () => {
    const hashMap = {};
    dataStructures.bst.forEach((value, index) => {
      hashMap[index] = value;
    });
    const result = `BST: [${dataStructures.bst.join(', ')}]\nHashMap: {${Object.entries(hashMap).map(([k, v]) => `${k}:${v}`).join(', ')}}`;
    setConversionResults(prev => ({ ...prev, bstToHashMap: result }));
    onUpdate('hashMap', hashMap);
  };

  // HashMap to BST conversion
  const hashMapToBST = () => {
    const values = Object.values(dataStructures.hashMap);
    const sortedValues = values.sort((a, b) => a - b);
    const result = `HashMap: {${Object.entries(dataStructures.hashMap).map(([k, v]) => `${k}:${v}`).join(', ')}}\nBST: [${sortedValues.join(', ')}]`;
    setConversionResults(prev => ({ ...prev, hashMapToBST: result }));
    onUpdate('bst', sortedValues);
  };

  const conversions = [
    {
      id: 'arrayToLinkedList',
      title: 'Array → Linked List',
      description: 'Convert array elements to a linked list structure',
      action: arrayToLinkedList,
      result: conversionResults.arrayToLinkedList
    },
    {
      id: 'arrayToBST',
      title: 'Array → Binary Search Tree',
      description: 'Convert array to a balanced binary search tree',
      action: arrayToBST,
      result: conversionResults.arrayToBST
    },
    {
      id: 'linkedListToBST',
      title: 'Linked List → Binary Search Tree',
      description: 'Convert linked list to a balanced binary search tree',
      action: linkedListToBST,
      result: conversionResults.linkedListToBST
    },
    {
      id: 'linkedListToArray',
      title: 'Linked List → Array',
      description: 'Convert linked list elements back to an array',
      action: linkedListToArray,
      result: conversionResults.linkedListToArray
    },
    {
      id: 'bstToHashMap',
      title: 'Binary Search Tree → HashMap',
      description: 'Convert BST nodes to hash map key-value pairs',
      action: bstToHashMap,
      result: conversionResults.bstToHashMap
    },
    {
      id: 'hashMapToBST',
      title: 'HashMap → Binary Search Tree',
      description: 'Convert hash map values to a balanced BST',
      action: hashMapToBST,
      result: conversionResults.hashMapToBST
    }
  ];

  return (
    <Container>
      <Title>Data Structure Conversions</Title>
      <ConversionDescription>
        Transform data between different structures. Click any conversion to see the transformation and update the corresponding visualization.
      </ConversionDescription>
      
      <ConversionGrid>
        {conversions.map((conversion) => (
          <ConversionCard
            key={conversion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ConversionTitle>{conversion.title}</ConversionTitle>
            <ConversionDescription>{conversion.description}</ConversionDescription>
            <Button onClick={conversion.action}>
              Convert
            </Button>
            
            {conversion.result && (
              <ResultSection>
                <ResultTitle>Result:</ResultTitle>
                <ResultContent>
                  <pre>{conversion.result}</pre>
                </ResultContent>
              </ResultSection>
            )}
          </ConversionCard>
        ))}
      </ConversionGrid>
    </Container>
  );
};

export default ConversionPanel; 