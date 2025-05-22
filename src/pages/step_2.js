import React, { useEffect, useState } from "react";
import { Box, Button, MenuItem, TextField, IconButton } from "@mui/material";
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
import CustomButton from "../components/CustomButton.jsx";
import axios from "axios";

export default function Step_2() {
  const [blocks, setBlocks] = useState([
    { id: 0, masterWorkTypes: "", deliveryWorkTypes: [] },
  ]);

  // const handleAddBlock = (addedType) => {
  //   const nextId = Math.max(...blocks.map((b) => b.id)) + 1;
  //   setBlocks([
  //     ...blocks,
  //     { id: nextId, masterWorkTypes: "", deliveryWorkTypes: [] },
  //   ]);
  // };

  // const handleDeleteBlock = (id) => {
  //   setBlocks(blocks.filter((block) => block.id !== id));
  // };

  // const handleUpdateBlock = (id, masterWorkTypes, deliveryWorkTypes) => {
  //   setBlocks((prev) =>
  //     prev.map((block) =>
  //       block.id === id
  //         ? { ...block, masterWorkTypes, deliveryWorkTypes }
  //         : block
  //     )
  //   );
  // };

  const handleSave = () => {
    console.log(
      "Saved Data:",
      blocks.filter((b) => b.masterWorkTypes)
    );
  };

  const handleMultipleSave = () => {
    handleSave();
    setShowTable(true); // Show table
    setIsAssigned(true); // Hide Assign section
  };

  // const usedTypes = blocks.map((b) => b.masterWorkTypes).filter(Boolean);

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
  const [dwt, setDwt] = useState([]);

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

  const getDWT = async () => {
    const res = await axios.get(
      "http://localhost:5000/v1/api/admin/delivery-work-types"
    );
    if (res.status === 200) {
      const data = res.data.map((item) => item.deliveryWorkTypes);
      setDwt(data);
    } else {
      console.error("❌ Error fetching data:", res.status);
    }
  };

  useEffect(() => {
    getDWT();
  }, []);
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
        <div className="page-wrapper">
          <label
            htmlFor="deliveryWT"
            style={{ fontWeight: "bold", display: "block" }}
          >
            Select Delivery Work Types
          </label>
          <Box my={2}>
            <TextField
              label="Delivery Work Type"
              name="deliveryType"
              fullWidth
              size="small"
              select
              value={fields.deliveryType}
              onChange={handleFieldChange("deliveryType")}
            >
              {dwt.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <div style={{ marginTop: "20px" }}>
              <DropdownWithTextBox
                allNames={allNames}
                setAllNames={setAllNames}
                setUiType={setUiType}
                setSequence={setSequence}
                setSelectedName={setSelectedName}
                label={"Create Work Type Categories: "}
              />
            </div>
            <CustomButton
              handleClick={handleMultipleSave}
              innerContent="Assign Work Type Categories"
            />
          </Box>
        </div>
      </div>

      {showTable && (
        <div className="table-wrapper">
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
      <CustomButton handleClick={handleNext} innerContent="Save" />
    </>
  );
}
