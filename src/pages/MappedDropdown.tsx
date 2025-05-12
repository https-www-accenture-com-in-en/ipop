import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const MappedDropdown = ({uiType,setWorkTypes,selectedName,workTypes,setSelectedName}) => {
  const [allNames, setAllNames] = useState([]);
  const [editingName, setEditingName] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Fetch all names
  const fetchNames = async () => {
    const res = await axios.get(`http://localhost:5000/mapped/${selectedName}`);
    setAllNames(res.data.data.map(n => n));
  };

  useEffect(() => { fetchNames(); }, [selectedName]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClickOutside = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const onInputChange = e => {
    setWorkTypes(e.target.value);
    setIsOpen(true);
  };

  const onCommit = async () => {
    const trimmed = workTypes.trim();
    if (!trimmed) {
      setWorkTypes('');
      setEditingName(null);
      setIsOpen(false);
      return;
    }

    if (editingName) {
      await axios.put(
  `http://localhost:5000/mapped/${encodeURIComponent(editingName)}/edit`,
  {
    oldValue: editingName,
    newValue: trimmed
  }
);
    } else {
      await axios.post(`http://localhost:5000/mapped/${selectedName}/add`, { work_type_categories: trimmed });
    }

    await fetchNames();
    setWorkTypes('');
    setEditingName(null);
    setIsOpen(false);
  };

  const onDelete = async nameToDelete => {
    const target = nameToDelete || editingName || workTypes.trim();
    if (!target) return;
    await axios.delete(`http://localhost:5000/mapped/${selectedName}/delete`, { data: { name: target } });
    await fetchNames();
    setWorkTypes('');
    setEditingName(null);
    setIsOpen(false);
  };

  // Select name from dropdown
  const onSelect = name => {
    setWorkTypes(name);
    setEditingName(null);
    setIsOpen(false);
  };

  const onKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onCommit();
    }
  };

  // Determine which icon to show:
  const isExisting = allNames.includes(workTypes.trim());
  const showSave = workTypes.trim().length > 0 && (editingName !== null || !isExisting);
  const showDeleteInput = editingName !== null;
  const showToggle = !showSave && !showDeleteInput;

  return (
    
    <div ref={wrapperRef} style={{ position: 'relative', width: 300 }}>
      <label htmlFor="nameInput" style={{ display: 'block', marginBottom: 6, marginTop:"-35px",fontWeight: 'bold' }}>
        Create Delivery Work Types Category:
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id="nameInput"
          style={{ width: '100%', padding: '8px 60px 8px 8px', boxSizing: 'border-box' }}
          value={workTypes}
          onChange={onInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Type or select a Delivery Work Types Category…"
        />

        {/* Save button */}
        {showSave && (
          <button
            onClick={onCommit}
            aria-label="Save"
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2em' }}
          >
            💾
          </button>
        )}

        {/* Delete button for input */}
        {showDeleteInput && (
          <button
            onClick={() => onDelete()}
            aria-label="Delete"
            style={{ position: 'absolute', right: showSave ? 40 : 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2em', color: 'red' }}
          >
            🗑️
          </button>
        )}

        {/* Toggle dropdown */}
        {showToggle && (
          <button
            onClick={() => setIsOpen(o => !o)}
            aria-label="Toggle"
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2em' }}
          >
            ▼
          </button>
        )}
      </div>

      {isOpen && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, border: '1px solid #ccc', maxHeight: 200, overflowY: 'auto', position: 'absolute', width: '100%', background: '#fff', zIndex: 10 }}>
          {allNames.map(name => (
            <li
              key={name}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', cursor: 'pointer' }}
              onClick={() => onSelect(name)}
            >
              <span>{name}</span>
              <div>
                {/* Edit button */}
                <button
                  onClick={e => { e.stopPropagation(); setWorkTypes(name); setEditingName(name); setIsOpen(false); }}
                  aria-label="Edit"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1em' }}
                >
                  ✏️
                </button>
                {/* Delete button */}
                <button
                  onClick={e => { e.stopPropagation(); onDelete(name); }}
                  aria-label="Delete"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1em', marginLeft: 8, color: 'red' }}
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MappedDropdown;
