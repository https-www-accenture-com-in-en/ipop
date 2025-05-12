import React, { useState } from "react";
import {
  Select,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Box
} from "@mui/material";
import Tb from "./tb";
 
const Step_3 = () => {
  // Updated deliveryTypes with the values you requested
  const deliveryTypes = [
    "Application Maintenance",
    "Application Development",
    "Application Management Services",
    "Application Development Project",
    "System Integration Project"
  ];
 
  const fieldTypes = ["checkbox", "radio", "dropdown", "textField", "button"];
 
  const [fields, setFields] = useState({
    deliveryType: "",
    type: "",
    screenFieldName: "",
    screenFieldSequence: ""
  });
 
  const handleFieldChange = (key) => (event) => {
    const value = event.target.value;
    setFields((prev) => ({ ...prev, [key]: value }));
  };
 
  return (
    <FormControl sx={{ p: 4 }} fullWidth>
      <Typography variant="h6" gutterBottom>
        Create Master Work Types
      </Typography>
 
      {/* 1. Delivery Work Type */}
      <Box my={2} sx={{ width: "30%" }}>
        <TextField
          label="Delivery Work Type"
          name="deliveryType"
          fullWidth
          margin="dense"
          size="small"
          select
          value={fields.deliveryType}
          onChange={handleFieldChange("deliveryType")}
        >
          <MenuItem value="">
            <em>Select</em>
          </MenuItem>
          {deliveryTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
      </Box>
 
      {/* 2. Create Work Type Categories */}
      <Box my={2} sx={{ width: "30%" }}>
        {/* <Typography variant="subtitle1">Create Work Type Categories</Typography> */}
        <Tb />
      </Box>
 
      {/* 3. Screen Field Name */}
      <Box my={2} sx={{ width: "30%" }}>
        <TextField
          label="Screen Field Name"
          fullWidth
          value={fields.screenFieldName}
          onChange={handleFieldChange("screenFieldName")}
        />
      </Box>
 
      {/* 4. Screen Field Sequence */}
      <Box my={2} sx={{ width: "30%" }}>
        <TextField
          label="Screen Field Sequence"
          type="number"
          fullWidth
          value={fields.screenFieldSequence}
          onChange={handleFieldChange("screenFieldSequence")}
        />
      </Box>
 
      {/* 5. Select Field Type
      <Box my={2} sx={{ width: "100%" }}>
        <Typography variant="subtitle1">Select Field Type</Typography>
        <Select
          value={fields.type}
          onChange={handleFieldChange("type")}
          fullWidth
          sx={{ width: "100%" }}
        >
          {fieldTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </Box> */}
    </FormControl>
  );
};
 
export default Step_3;