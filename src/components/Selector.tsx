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
  onDeleteItem: (item: string) => void;
};

const Selector: React.FC<SelectorProps> = ({ title, icon, items, selectedItem, onSelectItem, onAddItem, onDeleteItem }) => {
  const handleAddItem = () => {
    const newItem = window.prompt(`${title}を追加してください:`);
    if (newItem && newItem.trim() !== '') {
      onAddItem(newItem.trim());
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, item: string) => {
    // 重要: 親要素の onSelectItem が発火しないようにイベントの伝播を止める
    e.stopPropagation();
    onDeleteItem(item);
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
          <div
            key={item}
            className={`item-wrapper ${selectedItem === item ? 'selected' : ''}`}
            onClick={() => onSelectItem(item)}
          >
            {item}
            <button
              className="delete-item-button"
              onClick={(e) => handleDeleteClick(e, item)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Selector;