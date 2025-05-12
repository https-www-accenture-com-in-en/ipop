import React, { useState, useRef } from 'react';
import {
  TextField,
  Paper,
  ClickAwayListener,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Popper,
  Box
} from '@mui/material';
import { Save, Edit, Delete, ArrowDropDown } from '@mui/icons-material';

const Tb = () => {
  const [values, setValues] = useState([]);
  const [input, setInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const anchorRef = useRef(null);

  const handleSave = () => {
    if (!input.trim()) return;
    const newValues = input
      .split(',')
      .map(v => v.trim())
      .filter(v => v && !values.includes(v));
    if (newValues.length > 0) {
      setValues(prev => [...prev, ...newValues]);
    }
    setInput('');
    setShowDropdown(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  const handleDelete = (index) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setInput(values[index]);
    handleDelete(index);
    setShowDropdown(false);
  };

  const filtered = values.filter(v =>
    v.toLowerCase().includes(input.toLowerCase())
  );

  const handleFocus = () => {
    setShowDropdown(true);
  };

  const handleClickAway = () => {
    setShowDropdown(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ width: 300}}>
        <Box display="flex" alignItems="start" ref={anchorRef}>
          <TextField
            fullWidth
            label="Type and Save"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowDropdown(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            InputProps={{
              endAdornment: (
                <>
                  {/* Always show the Save button if the input has a value */}
                  {input && (
                    <IconButton onClick={handleSave} size="small">
                      <Save fontSize="small" />
                    </IconButton>
                  )}
                  {/* Show ArrowDropDown icon if there are saved values */}
                  {values.length > 0 && !input && (
                    <IconButton onClick={() => setShowDropdown(prev => !prev)} size="small">
                      <ArrowDropDown />
                    </IconButton>
                  )}
                </>
              ),
            }}
          />
        </Box>

        <Popper
          open={showDropdown && filtered.length > 0}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ zIndex: 10, width: anchorRef.current?.offsetWidth }}
        >
          <Paper style={{ maxHeight: 200, overflowY: 'auto' }}>
            <List dense>
              {filtered.map((item, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <>
                      <IconButton onClick={() => handleEdit(index)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(index)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default Tb;
