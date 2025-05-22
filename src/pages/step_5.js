import React, { useState } from "react";
import DropdownWithTextBox from "./DropDown.js";
import {
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  TextField,
} from "@mui/material";
import TextBox from "../components/TextBox.jsx";

const FieldRow = () => {
  const [workTypeCategory, setWorkTypeCategory] = useState([
    "Non Ticket Delivery",
  ]);
  const [workCategory, setWorkCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [workItem, setWorkItem] = useState([]);
  const [selectedTaskType, setSelectedTaskType] = useState();
  const [uiType, setUiType] = useState("");
  const [sequence, setSequence] = useState("");

  const savedData = {
    workTypeCategory,
    selectedTaskType,
    workCategory,
    subCategory,
    workItem,
  };

  const taskTypeOptions = [
    "AM Non Ticket Delivery",
    "AD Non Ticket Delivery",
    "CM Non Ticket Delivery",
    "CBS Non Ticket Delivery",
  ];

  const handleNext = () => {
    console.log("UI Type:", savedData.uiType);
  };

  const handleSave = () => {
    console.log("Data saved locally:");
    console.log(savedData);
  };

  return (
    <div className="page-wrapper">
      <TextBox
        inputValue={workTypeCategory}
        setInputValue={setWorkTypeCategory}
        InputLabel="WorkTypeCategory"
        InputInnerLabel="Enter WorkTypeCategory"
      />

      <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
        Task Type
      </label>
      <FormControl fullWidth size="small">
        <InputLabel>Select Task Type</InputLabel>
        <Select
          value={selectedTaskType}
          onChange={(e) => setSelectedTaskType(e.target.value)}
          label="Select Task Type"
        >
          {taskTypeOptions.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box my={2}>
        <DropdownWithTextBox
          allNames={workCategory}
          setAllNames={setWorkCategory}
          setUiType={setUiType}
          setSequence={setSequence}
          setSelectedName={setSelectedName}
          label={"Create Non Ticket Delivery Work Category: "}
        />
      </Box>
      <DropdownWithTextBox
        allNames={subCategory}
        setAllNames={setSubCategory}
        setUiType={setUiType}
        setSequence={setSequence}
        setSelectedName={() => {}}
        label={"Create Non Ticket Delivery Work Sub-Category: "}
        disabled={!selectedName}
      />

      <Box my={2}>
        <DropdownWithTextBox
          allNames={workItem}
          setAllNames={setWorkItem}
          setUiType={setUiType}
          setSequence={setSequence}
          setSelectedName={() => {}}
          label={"Create Non Ticket Delivery Work Item: "}
          disabled={!selectedName}
        />
      </Box>
      <Button
        onClick={handleNext}
        variant="contained"
        sx={{
          mt: 0.5,
          px: 0.5,
          py: 0.5,
          fontSize: "10px",
          fontWeight: "bold",
          borderRadius: "6px",
          backgroundColor: "#7500c0",
          color: "white",
          width: "100%",
          marginTop: "10px",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#7500c0",
            transform: "scale(1.05)",
          },
        }}
      >
        Save
      </Button>
    </div>
  );
};

export default FieldRow;
