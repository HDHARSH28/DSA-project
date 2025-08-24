# DSA Visualizer Frontend

A modern React frontend application that provides interactive visualizations of data structures and their conversions, designed to work with your C++ DSA backend.

## Features

- **Interactive Data Structure Visualizations:**
  - **Array**: Visual array representation with add/remove operations
  - **Linked List**: Node-based visualization with connections
  - **Binary Search Tree**: Tree structure with proper positioning
  - **HashMap**: Key-value pair visualization

- **Real-time Conversions:**
  - Array ↔ Linked List
  - Array/Linked List ↔ Binary Search Tree
  - BST ↔ HashMap
  - All conversions update visualizations instantly

- **Modern UI/UX:**
  - Beautiful gradient design with glassmorphism effects
  - Smooth animations using Framer Motion
  - Responsive design for all screen sizes
  - Interactive elements with hover effects

## Screenshots

The application features:
- Clean, modern interface with gradient backgrounds
- Tabbed navigation between data structures
- Interactive conversion panel
- Real-time statistics and metrics
- Smooth animations and transitions

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Usage

### Data Structure Operations

1. **Array Tab:**
   - Add/remove elements
   - Insert at specific indices
   - Sort, reverse, and generate random arrays
   - View statistics (count, max, min, average)

2. **Linked List Tab:**
   - Visualize nodes with connections
   - Add/remove nodes
   - Generate random linked lists
   - Remove duplicates

3. **Binary Search Tree Tab:**
   - Balanced tree visualization
   - Add nodes to maintain BST properties
   - Balance existing trees
   - View tree height and statistics

4. **HashMap Tab:**
   - Key-value pair visualization
   - Add/remove entries
   - Sort by key or value
   - Generate random hash maps

### Conversions

Use the **Conversion Panel** at the bottom to transform data between structures:

- **Array → Linked List**: Convert array elements to linked list nodes
- **Array → BST**: Create balanced binary search tree from array
- **Linked List → BST**: Transform linked list to balanced BST
- **BST → HashMap**: Convert tree nodes to hash map entries
- **HashMap → BST**: Create BST from hash map values

### Interactive Features

- **Click on elements** to remove them
- **Hover effects** for better user experience
- **Real-time updates** across all visualizations
- **Statistics panels** showing current data metrics

## Project Structure

```
src/
├── components/
│   ├── Header.js              # Application header
│   ├── ArrayVisualizer.js     # Array visualization component
│   ├── LinkedListVisualizer.js # Linked list visualization
│   ├── BSTVisualizer.js       # Binary search tree visualization
│   ├── HashMapVisualizer.js   # HashMap visualization
│   └── ConversionPanel.js     # Data structure conversion panel
├── App.js                     # Main application component
├── index.js                   # Application entry point
└── index.css                  # Global styles
```

## Technologies Used

- **React 18** - Modern React with hooks
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Smooth animations and transitions
- **Modern CSS** - Flexbox, Grid, and CSS custom properties

## Backend Integration

This frontend is designed to work with your C++ DSA backend (`demo.cpp`). The conversion algorithms mirror the backend functionality:

- Array to Linked List conversion
- Array/Linked List to BST conversion
- BST to HashMap conversion
- HashMap to BST conversion

## Customization

### Styling
- Modify colors in `src/index.css` and component files
- Adjust animations in Framer Motion components
- Customize spacing and layout in styled components

### Functionality
- Add new data structure visualizations
- Implement additional conversion algorithms
- Extend statistics and metrics
- Add new interactive features

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance

- Optimized React components with proper state management
- Efficient re-rendering using React hooks
- Smooth animations with hardware acceleration
- Responsive design for mobile and desktop

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions or issues:
1. Check the documentation
2. Review the code structure
3. Test with different data sets
4. Ensure all dependencies are installed

---

**Enjoy exploring data structures with this interactive visualization tool!** 🚀 