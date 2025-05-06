import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Typography,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const initialOptions = {
  Support: ["Application Maintainance", "Application Development", "Application Management Services","Cloud Management Services"],
  Project: ["Application Development Project", "System Integration Project"]
};

const DropdownBlock = ({
  id,
  typeOptions,
  usedTypes,
  onAdd,
  onDelete,
  onUpdate
}) => {
  const [selectedType, setSelectedType] = useState("");
  const [subOptions, setSubOptions] = useState([]);
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [newOption, setNewOption] = useState("");
  console.log(typeOptions,"typeOptions")
  const availableTypes = typeOptions.filter((opt) => !usedTypes.includes(opt));
  console.log(availableTypes,"vamsi")

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setSelectedType(newType);
    setSubOptions(initialOptions[newType] || []);
    setSelectedSubs([]);
    onUpdate(id, newType, []);
  };

  const handleSubChange = (event) => {
    const value = event.target.value;
    setSelectedSubs(value);
    onUpdate(id, selectedType, value);
  };

  const handleAddOption = () => {
    if (newOption && !subOptions.includes(newOption)) {
      const updated = [...subOptions, newOption];
      setSubOptions(updated);
      setNewOption("");
    }
  };

  return (
    <Box
      border={1}
      borderRadius={2}
      p={2}
      mb={2}
      position="relative"
    >
      <IconButton
        size="small"
        onClick={() => onDelete(id)}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <DeleteIcon />
      </IconButton>

      <FormControl fullWidth margin="normal">
        <InputLabel>Master Work Types</InputLabel>
        <Select
          value={selectedType}
          onChange={handleTypeChange}
          label="Master Work Types"
        >
          {availableTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedType && (
        <>
          <FormControl fullWidth margin="normal">
            <InputLabel>Delivery Work Types</InputLabel>
            <Select
              multiple
              value={selectedSubs}
              onChange={handleSubChange}
              input={<OutlinedInput label="Delivery Work Types" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {subOptions.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={selectedSubs.includes(name)} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box display="flex" gap={2} alignItems="center" mt={1}>
            <TextField
              label="Add Delivery Work Type"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              size="small"
            />
            <Button onClick={handleAddOption} variant="outlined">
              Add Delivery Work Types
            </Button>
          </Box>
        </>
      )}

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        disabled={!selectedType}
        onClick={() => onAdd(selectedType)}
      >
        Pending Master Work Type
      </Button>
    </Box>
  );
};

export default function Step_2() {
  const [blocks, setBlocks] = useState([{ id: 0, masterWorkTypes: "", deliveryWorkTypes: [] }]);

  const handleAddBlock = (addedType) => {
    const nextId = Math.max(...blocks.map((b) => b.id)) + 1;
    setBlocks([...blocks, { id: nextId, masterWorkTypes: "", deliveryWorkTypes: [] }]);
  };

  const handleDeleteBlock = (id) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  const handleUpdateBlock = (id, masterWorkTypes, deliveryWorkTypes) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, masterWorkTypes, deliveryWorkTypes } : block
      )
    );
  };

  const handleSave = () => {
    console.log("Saved Data:", blocks.filter((b) => b.masterWorkTypes));
  };

  const usedTypes = blocks.map((b) => b.masterWorkTypes).filter(Boolean);

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
       Delivery Work Type 
      </Typography>

      {blocks.map((block) => (
        <DropdownBlock
          key={block.id}
          id={block.id}
          typeOptions={["Support", "Project"]}
          usedTypes={usedTypes.filter((t) => t !== block.masterWorkTypes)}
          onAdd={handleAddBlock}
          onDelete={handleDeleteBlock}
          onUpdate={handleUpdateBlock}
        />
      ))}

      <Button variant="contained" color="success" onClick={handleSave}>
        Save
      </Button>
    </Box>
  );
}
