import React, { useState } from "react";
import {
  Select,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  Box,
  Button
} from "@mui/material";
import Tb from "./tb";
 
const Step_8 = () => {
  const deliveryTypes = [
    "Application Maintenance",
    "Application Development",
    "Application Management Services",
    "Application Development Project",
    "System Integration Project"
  ];
 
 
  const [fields, setFields] = useState({
    deliveryType: "",
    type: ""
  });
 
  const handleFieldChange = (key) => (event) => {
    const value = event.target.value;
    setFields((prev) => ({ ...prev, [key]: value }));
  };
 
  return (
    <FormControl sx={{ p: 4 }} fullWidth>
      <Typography variant="h6" gutterBottom>
      Non Ticket Non Delivery
      </Typography>
 
      {/* 1. Delivery Work Type */}
      <Box my={2} sx={{ width: 300 }}>
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
 
      {/* 2. Work Type Category - Static Default */}
      <Box my={2} sx={{ width: 300 }}>
        <TextField
          label="Work Type Category"
          value="Non Ticket Non Delivery"
          fullWidth
          InputProps={{
            readOnly: true
          }}
        />
      </Box>
      <Box my={2} sx={{ width: 300 }}>
       
        <Tb label="Create Non Ticket Non Delivery Work Category" />
      </Box>
      <Box my={2} sx={{ width: 300 }}>
       
        <Tb label="Create Non Ticket Non Delivery Work Sub-Category" />
      </Box>
      <Box my={2} sx={{ width: 300 }}>
       
        <Tb label="Create Non Ticket Non Delivery Work Item" />
      </Box>
 
      {/* Save Button */}
      <Box my={2} sx={{ width: "30%" }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            console.log("Saved values:", fields);
          }}
          fullWidth
        >
          Save
        </Button>
      </Box>
    </FormControl>
  );
};
 
export default Step_8;