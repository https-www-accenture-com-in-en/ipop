
import React, { useState } from "react";
import {
  MenuItem,
  TextField,
  Typography,
  FormControl,
  Box,
  Button
} from "@mui/material";
import Tb from "./tb";

const Step_3 = () => {
  const deliveryTypes = [
    "Application Maintenance",
    "Application Development",
    "Application Management Services",
    "Application Development Project",
    "System Integration Project"
  ];

  const [fields, setFields] = useState({
    deliveryType: "",
    screenFieldName: "",
    screenFieldSequence: ""
  });

  const [workTypeValue, setWorkTypeValue] = useState("");
  const [error, setError] = useState(""); // Error state to track validation

  const handleFieldChange = (key) => (event) => {
    const value = event.target.value;
    setFields((prev) => ({ ...prev, [key]: value }));

    // Check if user filled the Screen Field Sequence but Work Type Category is not selected
    if (key === "screenFieldSequence" && value !== "") {
      if (workTypeValue.trim() === "") {
        setError("Please select Work Type Category before filling the Sequence.");
      } else {
        setError(""); // Clear the error if Work Type Category is selected
      }
    }
  };

  const handleWorkTypeBlur = (e) => {
    const value = e.target.value?.trim();
    if (value) {
      setWorkTypeValue(value);
    }
  };

  const shouldShowFields =
    fields.deliveryType.trim() !== "" && workTypeValue.trim() !== "";

  const handleSave = () => {
    if (fields.screenFieldName.trim() !== "" && workTypeValue.trim() === "") {
      setError("Please select Work Type Category.");
      return;
    }
    setError(""); // Clear any previous errors

    // Simulate saving
    console.log("Saved values:", {
      ...fields,
      workTypeCategory: workTypeValue
    });
  };

  return (
    <FormControl sx={{ p: 4 }} fullWidth>
      <Typography variant="h6" gutterBottom>
        Create Master Work Types
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

      {/* 2. Work Type Category (Tb) */}
      <Box my={2} sx={{ width: 300 }}>
        <div onBlur={handleWorkTypeBlur}>
          <Tb label="Work Type Categories" />
        </div>
      </Box>

      {/* 3. Screen Field Name (conditional) */}
      {shouldShowFields && (
        <>
          <Box my={2} sx={{ width: 300 }}>
            <TextField
              label="Screen Field Name"
              fullWidth
              value={fields.screenFieldName}
              onChange={handleFieldChange("screenFieldName")}
            />
          </Box>

          {/* 4. Screen Field Sequence */}
          <Box my={2} sx={{ width: 300 }}>
            <TextField
              label="Screen Field Sequence"
              type="number"
              inputProps={{ min: 1 }}
              fullWidth
              value={fields.screenFieldSequence}
              onChange={handleFieldChange("screenFieldSequence")}
              error={error !== ""}  // If there's an error, show error styling
              helperText={error}  // Show the error message as helper text
              FormHelperTextProps={{
                style: { color: "red" }
              }}
            />
          </Box>
        </>
      )}

      {/* Save Button */}
      <Box my={2} sx={{ width: "30%" }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleSave}
          fullWidth
        >
          Save
        </Button>
      </Box>
    </FormControl>
  );
};

export default Step_3;