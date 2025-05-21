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
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DropdownWithTextBox from "./DropDown.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const initialOptions = {
  Support: [
    "Application Maintainance",
    "Application Development",
    "Application Management Services",
    "Cloud Management Services",
  ],
  Project: ["Application Development Project", "System Integration Project"],
};

const DropdownBlock = ({
  id,
  typeOptions,
  usedTypes,
  onAdd,
  onDelete,
  onUpdate,
}) => {
  const [selectedType, setSelectedType] = useState("");
  const [subOptions, setSubOptions] = useState([]);
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [newOption, setNewOption] = useState("");
  console.log(typeOptions, "typeOptions");
  const availableTypes = typeOptions.filter((opt) => !usedTypes.includes(opt));
  console.log(availableTypes, "vamsi");

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
    <Box border={1} borderRadius={2} p={2} mb={2} position="relative">
      <IconButton
        size="small"
        onClick={() => onDelete(id)}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <DeleteIcon />
      </IconButton>

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
  const [blocks, setBlocks] = useState([
    { id: 0, masterWorkTypes: "", deliveryWorkTypes: [] },
  ]);

  const handleAddBlock = (addedType) => {
    const nextId = Math.max(...blocks.map((b) => b.id)) + 1;
    setBlocks([
      ...blocks,
      { id: nextId, masterWorkTypes: "", deliveryWorkTypes: [] },
    ]);
  };

  const handleDeleteBlock = (id) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  const handleUpdateBlock = (id, masterWorkTypes, deliveryWorkTypes) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id
          ? { ...block, masterWorkTypes, deliveryWorkTypes }
          : block
      )
    );
  };

  const handleSave = () => {
    console.log(
      "Saved Data:",
      blocks.filter((b) => b.masterWorkTypes)
    );
  };

  const usedTypes = blocks.map((b) => b.masterWorkTypes).filter(Boolean);
  const deliveryTypes = [
    "Application Maintenance",
    "Application Development",
    "Application Management Services",
    "Application Development Project",
    "System Integration Project",
  ];

  const [fields, setFields] = useState({
    deliveryType: "",
    screenFieldName: "",
    screenFieldSequence: "",
  });

  const [workTypeValue, setWorkTypeValue] = useState("");
  const [error, setError] = useState(""); // Error state to track validation

  const handleFieldChange = (key) => (event) => {
    const value = event.target.value;
    setFields((prev) => ({ ...prev, [key]: value }));

    // Check if user filled the Screen Field Sequence but Work Type Category is not selected
    if (key === "screenFieldSequence" && value !== "") {
      if (workTypeValue.trim() === "") {
        setError(
          "Please select Work Type Category before filling the Sequence."
        );
      } else {
        setError(""); // Clear the error if Work Type Category is selected
      }
    }
  };
  const [selectedName, setSelectedName] = useState(null);
  const [uiType, setUiType] = useState("");
  const [workTypes, setWorkTypes] = useState("");
  const [sequence, setSequence] = useState("");
  const [allNames, setAllNames] = useState([]);
  const [isAssigned, setIsAssigned] = useState(false);

  const names = allNames.map((name, index) => ({
    name,
    sequence: index + 1,
  }));

  const initialRows = [
    { sequence: 1, dwt: "AM", wtc: "Ticket Delivery", screenField: "" },
    { sequence: 2, dwt: "AM", wtc: "NTD", screenField: "" },
    { sequence: 3, dwt: "AM", wtc: "NTND", screenField: "" },
    { sequence: 4, dwt: "AD", wtc: "Ticket Delivery", screenField: "" },
    { sequence: 5, dwt: "AD", wtc: "NTD", screenField: "" },
    { sequence: 6, dwt: "AD", wtc: "NTND", screenField: "" },
    { sequence: 7, dwt: "AD Project", wtc: "Delivery", screenField: "" },
    { sequence: 8, dwt: "AD Project", wtc: "Non Delivery", screenField: "" },
    { sequence: 9, dwt: "SI Project", wtc: "Delivery", screenField: "" },
    { sequence: 10, dwt: "SI Project", wtc: "Non Delivery", screenField: "" },
  ];
  const [rows, setRows] = useState(initialRows);
  const [showTable, setShowTable] = useState(false); // Flag to show/hide table

  const handleChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].screenField = value;
    setRows(updatedRows);
  };

  const moveRow = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= rows.length) return;

    const updatedRows = [...rows];
    const temp = updatedRows[index];
    updatedRows[index] = updatedRows[newIndex];
    updatedRows[newIndex] = temp;

    // Reassign sequences
    const reSequenced = updatedRows.map((row, i) => ({
      ...row,
      sequence: i + 1,
    }));

    setRows(reSequenced);
  };

  const handleNext = async () => {
    //    await axios.post(
    //   `http://localhost:5000/addGuiwithSequence/`,
    //   { gui_type: uiType,
    //     master_work_types: names.map((item) => item.name),
    //     sequences: names.map((item) => item.sequence),
    //   }
    // );
    console.log("data saved");
  };

  return (
    <>
      <div style={{ marginTop: "20px" }}>
        <div
          style={{
            border: "1px solid #7500c0",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <label
            htmlFor="deliveryWT"
            style={{ fontWeight: "bold", display: "block" }}
          >
            Select Delivery Work Types
          </label>
          <Box my={2} sx={{ width: 300 }}>
            <TextField
              label="Delivery Work Type"
              name="deliveryType"
              fullWidth
              size="small"
              select
              value={fields.deliveryType}
              onChange={handleFieldChange("deliveryType")}
            >
              {deliveryTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <DropdownWithTextBox
            allNames={allNames}
            setAllNames={setAllNames}
            setUiType={setUiType}
            setSequence={setSequence}
            setSelectedName={setSelectedName}
            label={"Create Work Type Categories: "}
          />
          <Button
            onClick={() => {
              handleSave();
              setShowTable(true); // Show table
              setIsAssigned(true); // Hide Assign section
            }}
            variant="contained"
            sx={{
              mt: 1,
              px: 0.5,
              py: 0.5,
              fontSize: "10px",
              width: "100%",
              fontWeight: "bold",
              borderRadius: "6px",
              backgroundColor: "#7500c0",
              color: "white",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#7500c0",
                transform: "scale(1.05)",
              },
            }}
          >
            Assign Work Type Categories <ArrowForwardIcon />
          </Button>
        </div>
      </div>

      {showTable && (
        <div
          style={{
            border: "1px solid #7500c0",
            borderRadius: "10px",
            padding: "10px",
            marginTop: "20px",
          }}
        >
          <TableContainer
            component={Paper}
            sx={{ overflow: "hidden", borderRadius: "12px", mb: 2 }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#7500c0" }}>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      paddingY: "6px",
                      // '&:last-of-type': { }
                    }}
                  >
                    Sequence
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", paddingY: "6px" }}
                  >
                    DWT
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", paddingY: "6px" }}
                  >
                    WTC
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", paddingY: "6px" }}
                  >
                    Screen Field Name For Task Type
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      paddingY: "6px",
                    }}
                  >
                    Up/Down
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={row.sequence}>
                    <TableCell>{row.sequence}</TableCell>
                    <TableCell>{row.dwt}</TableCell>
                    <TableCell>{row.wtc}</TableCell>
                    <TableCell>
                      <TextField
                        variant="standard"
                        fullWidth
                        value={row.screenField}
                        onChange={(e) => handleChange(index, e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => moveRow(index, 1)}
                        disabled={index === rows.length - 1}
                      >
                        <ArrowDownwardIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => moveRow(index, -1)}
                        disabled={index === 0}
                      >
                        <ArrowUpwardIcon fontSize="inherit" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
      <Button
        onClick={handleNext}
        variant="contained"
        sx={{
          mt: 1,
          px: 0.5,
          py: 0.5,
          fontSize: "10px",
          width: "100%",
          fontWeight: "bold",
          borderRadius: "6px",
          backgroundColor: "#7500c0",
          color: "white",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#7500c0",
            transform: "scale(1.05)",
          },
        }}
      >
        Save
      </Button>
    </>
  );
}
