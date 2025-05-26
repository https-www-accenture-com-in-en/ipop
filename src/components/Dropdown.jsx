import React, { useState, useEffect, useRef } from 'react';
import { apiPost, apiPut, apiDelete } from '../utils/api';
import { useSnackbar } from './CustomSnackbar';

const CrudDropdown = ({
  items = [],
  onItemsChange,
  onItemSelected = () => { },
  label,
  endpoint,
  displayField = 'name',
  valueField = '_id',
  disabled = false,
  placeholder = "Type or select an item",
  additionalCreatePayload = {},
}) => {
  const [inputValue, setInputValue] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { showSnackbar } = useSnackbar();
  const [lastSelectedId, setLastSelectedId] = useState(null);

  // Generate a unique ID for the input field once
  const inputId = useRef(`crud-dropdown-input-${label ? label.replace(/\s+/g, '-').toLowerCase() : Math.random().toString(36).substring(2, 9)}`).current;

  useEffect(() => {
    const onClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // If input is empty, was previously selected, and not editing, treat as deselection
        if (inputValue.trim() === '' && lastSelectedId !== null && editingItemId === null) {
          const isEmptyValueActuallyAnItem = items.some(
            item => item && typeof item[displayField] === 'string' && item[displayField] === '' && item[valueField] === lastSelectedId
          );
          if (!isEmptyValueActuallyAnItem) {
            onItemSelected(null, -1);
            setLastSelectedId(null);
          }
        }
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [inputValue, items, lastSelectedId, editingItemId, onItemSelected, displayField, valueField]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    if (newValue.trim() === '' && lastSelectedId !== null && editingItemId === null) {
      const isEmptyValueActuallyAnItem = items.some(
        item => item && typeof item[displayField] === 'string' && item[displayField] === '' && item[valueField] === lastSelectedId
      );
      if (!isEmptyValueActuallyAnItem) {
        onItemSelected(null, -1); // Signal deselection to parent
        setLastSelectedId(null); // Reset last selected
      }
    }
    if (!isOpen && !disabled) {
      setIsOpen(true);
    }
  };

  const resetInputAndState = (clearSelectionSignal = true) => {
    setInputValue('');
    setEditingItemId(null);
    setIsOpen(false);
    if (clearSelectionSignal && lastSelectedId !== null) {
      onItemSelected(null, -1);
      setLastSelectedId(null);
    }
  };

  const handleSaveItem = async () => {
    if (!endpoint && (editingItemId !== null || inputValue.trim())) {
      showSnackbar('Configuration error: Endpoint not defined.', 'error');
      if (!inputValue.trim()) resetInputAndState(false);
      return;
    }
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      resetInputAndState(false);
      return;
    }

    try {
      if (editingItemId !== null) {
        const currentItem = items.find(item => item && item[valueField] === editingItemId);
        if (currentItem && typeof currentItem[displayField] === 'string' && currentItem[displayField] === trimmedValue) {
          showSnackbar('No changes to save.', 'info');
          resetInputAndState(false);
          return;
        }
        const payload = { ...additionalCreatePayload, [displayField]: trimmedValue };
        const updatedItemFromApi = await apiPut(`${endpoint}/${editingItemId}`, payload);
        const updatedItems = items.map(item =>
          item && item[valueField] === editingItemId ? { ...item, ...updatedItemFromApi } : item
        );
        if (onItemsChange) onItemsChange(updatedItems.filter(Boolean));
        showSnackbar('Item updated successfully!', 'success');
        resetInputAndState(false);
      } else { // Create
        const existingItem = items.find(item =>
          item && typeof item[displayField] === 'string' &&
          item[displayField].toLowerCase() === trimmedValue.toLowerCase()
        );
        if (!existingItem) {
          const payload = { ...additionalCreatePayload, [displayField]: trimmedValue };
          const newItemFromApi = await apiPost(endpoint, payload);
          if (newItemFromApi && typeof newItemFromApi[valueField] !== 'undefined') {
            if (onItemsChange) onItemsChange([...items, newItemFromApi].filter(Boolean));
            showSnackbar('Item created successfully!', 'success');
            resetInputAndState(true);
          } else {
            console.error("API Error: New item response error.", newItemFromApi);
            showSnackbar(`Error: Could not create item (invalid API response).`, 'error');
            resetInputAndState(false);
          }
        } else { // Item name already exists
          const itemIndex = items.findIndex(i => i && i[valueField] === existingItem[valueField]);
          handleSelectItem(existingItem, itemIndex); // Selects the existing item
          showSnackbar('Item already exists and has been selected.', 'info');
          return;
        }
      }
    } catch (error) {
      console.error('Failed to save item:', error);
      showSnackbar(`Error: ${error.message || 'Failed to save item.'}`, 'error');
      resetInputAndState(false);
    }
  };

  const handleDeleteItem = async (itemIdToDelete) => {
    if (!endpoint) {
      showSnackbar('Configuration error: Endpoint not defined for delete.', 'error');
      return;
    }
    if (itemIdToDelete === null || typeof itemIdToDelete === 'undefined') {
      resetInputAndState(false);
      return;
    }
    try {
      await apiDelete(`${endpoint}/${itemIdToDelete}`);
      const updatedItems = items.filter(item => item && item[valueField] !== itemIdToDelete);
      if (onItemsChange) onItemsChange(updatedItems.filter(Boolean));
      showSnackbar('Item deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete item:', error);
      showSnackbar(`Error: ${error.message || 'Failed to delete item.'}`, 'error');
    }
    if (editingItemId === itemIdToDelete) {
      resetInputAndState(true);
    } else {
      setIsOpen(false);
      if (lastSelectedId === itemIdToDelete) {
        onItemSelected(null, -1);
        setLastSelectedId(null);
        setInputValue('');
      }
    }
  };

  const handleSelectItem = (item, index) => {
    if (item && typeof item[displayField] === 'string') {
      setInputValue(item[displayField]);
    } else if (item) {
      setInputValue(`Item ID: ${item[valueField]}`);
      console.warn(`Item with ID ${item[valueField]} has a non-string or missing displayField '${displayField}'.`);
    } else {
      setInputValue('');
    }
    setEditingItemId(null);
    setIsOpen(false);
    onItemSelected(item, index);
    setLastSelectedId(item ? item[valueField] : null);
  };

  const handleEditItem = (item) => {
    if (item && typeof item[displayField] === 'string') {
      setInputValue(item[displayField]);
    } else if (item) {
      setInputValue(`Editing ID: ${item[valueField]}`);
      console.warn(`Item with ID ${item[valueField]} has a non-string or missing displayField '${displayField}' for editing.`);
    } else {
      setInputValue('');
    }
    setEditingItemId(item ? item[valueField] : null);
    setIsOpen(false);
    onItemSelected(null, -1);
    setLastSelectedId(null);
  };

  const handleKeyDown = (event) => {
    if (disabled) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSaveItem();
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      if (editingItemId) { // If currently editing an item
        const currentEditingItem = items.find(i => i && i[valueField] === editingItemId);
        if (currentEditingItem && typeof currentEditingItem[displayField] === 'string') {
          setInputValue(currentEditingItem[displayField]); // Revert to its original display value
        } else if (currentEditingItem) {
          setInputValue(''); // Fallback if no display string
        }
      } else { // Not editing, just typed in input or input was from a selection
        const lastSelectedItemObject = items.find(i => i && i[valueField] === lastSelectedId);
        if (lastSelectedItemObject && typeof lastSelectedItemObject[displayField] === 'string') {
          setInputValue(lastSelectedItemObject[displayField]); // Revert to last selected item's display
        } else { // No valid last selection or it had no display string
          setInputValue('');
          if (lastSelectedId !== null) {
            onItemSelected(null, -1);
            setLastSelectedId(null);
          }
        }
      }
    }
  };

  const handleReorderItem = (currentIndex, direction) => {
    if (!onItemsChange || currentIndex < 0 || currentIndex >= items.length) return;
    const newItems = [...items];
    const itemToMove = newItems[currentIndex];
    let targetIndex = currentIndex;
    if (direction === 'up' && currentIndex > 0) targetIndex = currentIndex - 1;
    else if (direction === 'down' && currentIndex < items.length - 1) targetIndex = currentIndex + 1;
    else return;
    newItems.splice(currentIndex, 1);
    newItems.splice(targetIndex, 0, itemToMove);
    onItemsChange(newItems.filter(Boolean));
  };

  const trimmedInputValue = inputValue.trim();
  const isExistingItemName = items.some(item =>
    item && item[displayField] && typeof item[displayField] === 'string' &&
    item[displayField].toLowerCase() === trimmedInputValue.toLowerCase() &&
    item[valueField] !== editingItemId
  );

  let showSaveButton = false;
  if (trimmedInputValue.length > 0 && !disabled && endpoint) {
    if (editingItemId !== null) { // Editing mode
      const currentItem = items.find(item => item && item[valueField] === editingItemId);
      // Show save if text changed from original, or original had no display text
      if (currentItem && typeof currentItem[displayField] === 'string' && currentItem[displayField] !== trimmedInputValue) {
        showSaveButton = true;
      } else if (currentItem && typeof currentItem[displayField] !== 'string' && trimmedInputValue) {
        showSaveButton = true;
      } else if (!currentItem && trimmedInputValue) {
        showSaveButton = true;
      }
    } else { // Creating new mode
      if (!isExistingItemName) showSaveButton = true;
    }
  }

  const showDeleteButtonInInput = editingItemId !== null && !disabled && endpoint;
  const showToggleDropdownButton = !disabled && !showSaveButton && !showDeleteButtonInInput;

  const filteredItems = items.filter(item =>
    item && item[displayField] && typeof item[displayField] === 'string' &&
    item[displayField].toLowerCase().includes(inputValue.toLowerCase()) // Filter based on current input
  );

  return (
    <div ref={wrapperRef} style={{ position: 'relative', minWidth: 250, width: '100%' }}>
      {label && (
        <label htmlFor={inputId} style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          id={inputId}
          style={{ width: '100%', padding: '8px 60px 8px 8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => { if (!disabled) setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
        />
        {showSaveButton && (
          <button 
            onClick={handleSaveItem} 
            aria-label={editingItemId ? "Update item" : "Create item"} 
            title={editingItemId ? "Update item" : "Create item"} 
            style={{ position: 'absolute', right: showDeleteButtonInInput ? 40 : 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2em', padding: '4px' }}>
            💾
          </button>
          )}
        {showDeleteButtonInInput && (
          <button 
            onClick={() => handleDeleteItem(editingItemId)} 
            aria-label="Delete item being edited" 
            title="Delete item being edited" 
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2em', color: 'red', padding: '4px' }}>
            🗑️
          </button>
        )}
        {showToggleDropdownButton && (
          <button 
            onClick={() => setIsOpen(o => !o)} 
            aria-label="Toggle dropdown" 
            title="Toggle dropdown" 
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2em', padding: '4px' }}>
              {isOpen ? '▲' : '▼'}
          </button>
        )}
      </div>

      {!disabled && isOpen && (
        <ul style={{ listStyle: 'none', margin: '4px 0 0 0', padding: 0, border: '1px solid #ccc', borderRadius: '4px', maxHeight: 200, overflowY: 'auto', position: 'absolute', width: '100%', background: '#fff', zIndex: 1000 }}>
          {filteredItems.length > 0 ? filteredItems.map((item) => {
            const originalIndex = items.findIndex(i => i && i[valueField] === item[valueField]);
            if (!item || typeof item[valueField] === 'undefined') return null;
            const displayValue = (item && typeof item[displayField] === 'string') ? item[displayField] : `[No ${displayField}]`;

            return (
              <li key={item[valueField]}
                onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                onClick={() => handleSelectItem(item, originalIndex)}
              >
                <span style={{ flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {`${originalIndex >= 0 ? originalIndex + 1 : '-'}. ${displayValue}`}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {endpoint && <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEditItem(item); }} 
                      aria-label={`Edit ${displayValue}`} 
                      title={`Edit ${displayValue}`} 
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1em', padding: '4px', marginRight: '4px' }}>
                        ✏️
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteItem(item[valueField]); }} 
                      aria-label={`Delete ${displayValue}`} 
                      title={`Delete ${displayValue}`} 
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1em', color: 'red', padding: '4px', marginRight: '4px' }}>
                        🗑️
                    </button>
                  </>}
                  {onItemsChange && originalIndex >= 0 && <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleReorderItem(originalIndex, 'up'); }} 
                      disabled={originalIndex === 0} 
                      aria-label={`Move ${displayValue} up`} 
                      title={`Move ${displayValue} up`} 
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', marginRight: '2px' }}>
                        ↑
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleReorderItem(originalIndex, 'down'); }} 
                      disabled={originalIndex === items.length - 1} 
                      aria-label={`Move ${displayValue} down`} 
                      title={`Move ${displayValue} down`} 
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        ↓
                    </button>
                  </>}
                </div>
              </li>);
          }) : (
          <li 
          style={{ padding: '8px', color: '#777', fontStyle: 'italic' }}> 
          {trimmedInputValue && !editingItemId && endpoint ? 'No matches. Type and Press Enter to create new.' : (items.length > 0 ? 'No items to display.' : 'List is empty.')} 
          </li>)}
        </ul>
      )}
    </div>
  );
};

export default CrudDropdown;