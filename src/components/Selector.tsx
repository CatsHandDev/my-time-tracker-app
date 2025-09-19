import React from 'react';
import './Selector.scss';

type SelectorProps = {
  title: string;
  items: string[];
  selectedItem: string | null;
  onSelectItem: (item: string) => void;
  onAddItem: (item: string) => void;
};

const Selector: React.FC<SelectorProps> = ({ title, items, selectedItem, onSelectItem, onAddItem }) => {
  const handleAddItem = () => {
    const newItem = window.prompt(`${title}を追加してください:`);
    if (newItem && newItem.trim() !== '') {
      onAddItem(newItem.trim());
    }
  };

  return (
    <div className="selector-container">
      <h3>{title}</h3>
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
        <button className="add-button" onClick={handleAddItem}>+</button>
      </div>
    </div>
  );
};

export default Selector;