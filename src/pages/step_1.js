
import React, { useState } from "react";
import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  TextField,
  Button,
  ListSubheader,
  FormControl,
  InputLabel,
  Box,
  Menu,
  Grid,
  Typography,
} from "@mui/material";
import Tb from "./tb";


const MultiSelectWithAdd = () => {
  const [options, setOptions] = useState([]);
  const fieldTypes = ["checkbox", "radio", "dropdown", "textField", "button"];
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [fields,setFields] = useState({type:""})

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOptions(typeof value === "string" ? value.split(",") : value);
  };

  const handleAddOption = () => {
    const trimmed = newOption.trim();
    if (trimmed && !options.includes(trimmed)) {
      setOptions((prev) => [...prev, trimmed]);
      setNewOption("");
    }
  };
  const handleFieldTypeChange = (event) => {
    const { value } = event.target;
    setFields({ type: value });
  };
  return (
  
    <FormControl  padding={4} spacing={2} >
      <Typography>Create master work types</Typography>
      <Tb />
      <Typography>Select Field Type</Typography>
      <Select
        value={fields.type || ""}
        onChange={ handleFieldTypeChange}
        label="Select Field Type"
      >
        <br></br>
        <br></br>
        <br></br>
        <br></br>
                {" "}
        {fieldTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelectWithAdd;

