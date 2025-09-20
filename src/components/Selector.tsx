import React from 'react';
import './Selector.scss';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

type SelectorProps = {
  title: string;
  icon: React.ReactNode;
  items: string[];
  selectedItem: string | null;
  onSelectItem: (item: string) => void;
  onAddItem: (item: string) => void;
};

const Selector: React.FC<SelectorProps> = ({ title, icon, items, selectedItem, onSelectItem, onAddItem }) => {
  const handleAddItem = () => {
    const newItem = window.prompt(`${title}を追加してください:`);
    if (newItem && newItem.trim() !== '') {
      onAddItem(newItem.trim());
    }
  };

  return (
    <div className="selector-container">
      <div className="selector-header">
        {icon}
        <h3>{title}</h3>
        <button className="add-button" onClick={handleAddItem}>
          <AddCircleOutlineIcon />
        </button>
      </div>
      <div className="items">
        {items.map((item) => (
          <button
            key={item}
            className={`item-button ${selectedItem === item ? 'selected' : ''}`}
            onClick={() => onSelectItem(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Selector;