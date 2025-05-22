import React, { useState, useEffect, useRef } from 'react';
import { apiPost, apiPut, apiDelete } from '../utils/api';
import { useSnackbar } from './CustomSnackbar';


const ComboBox = ({
  allNameObjs,
  setAllNameObjs,
  setSelectedName = () => {},
  setSequence = () => {},
  label,
  endpoint,
  disabled = false
}) => {
  const [value, setValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const onInputChange = (e) => {
    setValue(e.target.value);
    setIsOpen(true); // Open dropdown when user types
  };

  const resetInput = () => {
    setValue('');
    setEditingId(null);
    setIsOpen(false);
  };

  const onUpdate = async () => {
    const trimmed = value.trim();
    if (!trimmed) {
      // If was editing, and input is cleared, effectively cancel edit without saving.
      // If it was a new entry, just clears.
      resetInput();
      return;
    }

    try {
      if (editingId !== null) {
        // Update existing item
        await apiPut(`${endpoint}/${editingId}`, { name: trimmed });
        setAllNameObjs(prevObjs =>
          prevObjs.map(obj =>
            obj._id === editingId ? { ...obj, name: trimmed } : obj
          )
        );
        showSnackbar('Item updated successfully!', 'success');
      } else {
        // Create new item, if name doesn't already exist
        // This check uses the current 'allNameObjs' state.
        if (!allNameObjs.some(obj => obj.name === trimmed)) {
          const res = await apiPost(endpoint, { name: trimmed });
          // Ensure 'res' from apiPost contains the 'id' of the newly created item.
          if (res && typeof res._id !== 'undefined') {
            setAllNameObjs(prevObjs => [...prevObjs, res]);
            showSnackbar('Item created successfully!', 'success');
          } else {
            console.error("API Error: New item was created but API response did not include an 'id'.", res);
            showSnackbar("Error: Could not create item (missing ID in response).", 'error');

          }
        } else {
          // Name already exists, user might be trying to select it or made a typo
          const existingObj = allNameObjs.find(obj => obj.name === trimmed);
          if (existingObj) {
            // Emulate selecting the existing item
    onSelectItem(existingObj, allNameObjs.findIndex(o => o._id === existingObj._id) + 1);
            return; // Skip resetInput if onSelect handles state
          }
        }
      }
    } catch (err) {
      console.error('Failed to commit change:', err);
      showSnackbar(`Error: ${err.message || 'Failed to save item.'}`, 'error');
    }

    resetInput(); // Reset after successful operation or if no operation was performed.
  };

  const onDelete = async (idToDeleteParam) => {
    const id = idToDeleteParam !== undefined ? idToDeleteParam : editingId;

    if (id === null || typeof id === 'undefined') {
      console.error("Delete Error: No ID specified for deletion.");
      showSnackbar('Error: No item selected for deletion.', 'error');
      resetInput();
      return;
    }

    try {
      await apiDelete(`${endpoint}/${id}`);
      setAllNameObjs(prevObjs => prevObjs.filter(obj => obj._id !== id));
      showSnackbar('Item deleted successfully!', 'success');
    } catch (err) {
      console.error('Failed to delete:', err);
      showSnackbar(`Error: ${err.message || 'Failed to delete item.'}`, 'error');
    }
    resetInput();
  };

  const onSelectItem = (obj, index) => { 
    setValue(obj.name);
    setEditingId(null); // Selecting an item clears editing mode
    setIsOpen(false);
    if (typeof setSelectedName === 'function') setSelectedName(obj.name);
    if (typeof setSequence === 'function') setSequence(index); // index is 1-based
  };

  const onEditItem = (obj) => {
    setValue(obj.name);
    setEditingId(obj._id);
    setIsOpen(false);
    if (typeof setSelectedName === 'function') setSelectedName(null);
    if (typeof setSequence === 'function') setSequence(null);
  };


  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onUpdate();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const trimmedValue = value.trim();
  const isExistingName = allNameObjs.some(obj => obj.name === trimmedValue);

  // Show save if:
  // 1. Input has text.
  // 2. EITHER we are editing an existing item (editingId is not null)
  // 3. OR we are creating a new item (editingId is null) AND its name doesn't already exist.
  const showSave = trimmedValue.length > 0 && (editingId !== null || !isExistingName);

  // Show delete button next to input only when an item is loaded for editing.
  const showDeleteInputButton = editingId !== null;

  // Show toggle if not showing save or delete (in input context), and not disabled.
  const showToggle = !disabled && !showSave && !showDeleteInputButton;


  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: 300 }}>
      <label htmlFor="nameInput" style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id="nameInput"
          style={{ width: '100%', padding: '8px 60px 8px 8px', boxSizing: 'border-box' }}
          value={value}
          onChange={onInputChange}
          onFocus={() => { if (!disabled) setIsOpen(true); }}
          onKeyDown={onKeyDown}
          placeholder="Type or select"
          disabled={disabled}
        />

        {/* Save Button for creating new or updating existing */}
        {showSave && !disabled && (
          <button
            onClick={onUpdate}
            aria-label="Save"
            style={{
              position: 'absolute',
              right: showDeleteInputButton ? 40 : 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2em'
            }}
          >
            💾
          </button>
        )}

        {/* Delete Button - next to input, for item currently being edited */}
        {showDeleteInputButton && !disabled && (
          <button
            onClick={() => onDelete()}
            aria-label="Delete current item"
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2em',
              color: 'red'
            }}
          >
            🗑️
          </button>
        )}

        {/* Toggle Dropdown Button (▼) */}
        {showToggle && !disabled && (
          <button
            onClick={() => setIsOpen(o => !o)}
            aria-label="Toggle dropdown"
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2em'
            }}
          >
            {isOpen ? '▲' : '▼'}
          </button>
        )}
      </div>

      {!disabled && isOpen && (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            border: '1px solid #ccc',
            maxHeight: 200,
            overflowY: 'auto',
            position: 'absolute',
            width: '100%',
            background: '#fff',
            zIndex: 10
          }}
        >
          {allNameObjs.map((obj, index) => (
            <li
              key={obj._id}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px',
                cursor: 'pointer'
              }}
              onClick={() => onSelectItem(obj, index + 1)}
            >
              <span>{`${index + 1}. ${obj.name}`}</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditItem(obj);
                  }}
                  aria-label={`Edit ${obj.name}`}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1em',
                    marginLeft: 8
                  }}
                >
                  ✏️
                </button>

                <button
                  onClick={(e) => {
                    onDelete(obj._id);
                  }}
                  aria-label={`Delete ${obj.name}`}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1em',
                    marginLeft: 8,
                    color: 'red'
                  }}
                >
                  🗑️
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (index > 0) {
                      setAllNameObjs(prevObjs => {
                        const updated = [...prevObjs];
                        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
                        return updated;
                      });
                    }
                  }}
                  disabled={index === 0}
                  aria-label={`Move ${obj.name} up`}
                  style={{ marginLeft: 8 }}
                >
                  ↑
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (index < allNameObjs.length - 1) {
                       setAllNameObjs(prevObjs => {
                        const updated = [...prevObjs];
                        [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
                        return updated;
                       });
                    }
                  }}
                  disabled={index === allNameObjs.length - 1}
                  aria-label={`Move ${obj.name} down`}
                  style={{ marginLeft: 4 }}
                >
                  ↓
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComboBox;