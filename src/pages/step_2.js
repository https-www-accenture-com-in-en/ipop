// Replace the current Step_2 code with this:
import React, { useEffect, useState } from "react";
import { Box, MenuItem, TextField, IconButton, Paper } from "@mui/material";
import DropdownWithTextBox from "./DropDown.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CustomButton from "../components/CustomButton.jsx";
import axios from "axios";

export default function Step_2() {
  const [fields, setFields] = useState({
    deliveryType: "",
  });
  const [allNames, setAllNames] = useState([]);
  const [uiType, setUiType] = useState("");
  const [sequence, setSequence] = useState("");
  const [selectedName, setSelectedName] = useState(null);
  const [dwt, setDwt] = useState([]);
  const [groupedData, setGroupedData] = useState([]); // [{ deliveryType, workTypeCategories }]
  const [rows, setRows] = useState([]);
  const [showTable, setShowTable] = useState(false);

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

  // When switching DWT, save current allNames and load new one
  const handleDeliveryTypeChange = (event) => {
    const newDWT = event.target.value;

    // Save current WTCs for previously selected DWT
    if (fields.deliveryType) {
      const prevDWT = fields.deliveryType;
      const existingIndex = groupedData.findIndex(
        (g) => g.deliveryType === prevDWT
      );
      const updatedGrouped = [...groupedData];
      if (existingIndex > -1) {
        updatedGrouped[existingIndex].workTypeCategories = allNames;
      } else {
        updatedGrouped.push({
          deliveryType: prevDWT,
          workTypeCategories: allNames,
        });
      }
      setGroupedData(updatedGrouped);
    }

    // Load WTCs for selected DWT if they exist
    const found = groupedData.find((g) => g.deliveryType === newDWT);
    setAllNames(found ? found.workTypeCategories : []);

    setFields((prev) => ({
      ...prev,
      deliveryType: newDWT,
    }));
  };

  // Final "Create Task Types" – flattens groupedData to table rows
  const handleCreateTaskTypes = () => {
    const currentDWT = fields.deliveryType;
    const updatedGrouped = [...groupedData];

    if (currentDWT) {
      const existingIndex = updatedGrouped.findIndex(
        (g) => g.deliveryType === currentDWT
      );

      if (existingIndex > -1) {
        updatedGrouped[existingIndex].workTypeCategories = allNames;
      } else {
        updatedGrouped.push({
          deliveryType: currentDWT,
          workTypeCategories: allNames,
        });
      }
    }

    // ✅ NOW generate rows using the freshly updatedGrouped
    const newRows = updatedGrouped.flatMap((group) =>
      group.workTypeCategories.map((name, idx) => ({
        dwt: group.deliveryType,
        wtc: name,
        sequence: idx + 1,
        screenField: "",
      }))
    );

    setGroupedData(updatedGrouped);
    setRows(newRows);
    setShowTable(true);
  };

  const handleChange = (index, value) => {
    const updated = [...rows];
    updated[index].screenField = value;
    setRows(updated);
  };

  const moveRow = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= rows.length) return;

    const updated = [...rows];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    updated.forEach((row, i) => {
      row.sequence = i + 1;
    });

    setRows(updated);
  };

  const handleSave = async () => {
    const payload = rows.map((row) => ({
      deliveryWorkTypes: row.dwt,
      workTypeCategory: row.wtc,
      taskType: row.screenField,
      sequence: row.sequence,
    }));

    try {
      const response = await axios.post(
        "http://localhost:5000/v1/api/admin/delivery-work-type-category",
        payload
      );

      if (response.status === 200 || response.status === 201) {
        console.log("✅ Task types submitted successfully:", response.data);
      } else {
        console.error("❌ Submission failed with status:", response.status);
      }
    } catch (error) {
      console.error("❌ Error submitting task types:", error);
    }
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
              onChange={handleDeliveryTypeChange}
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
                disabled={!fields.deliveryType}
              />
            </div>

            <div style={{ marginTop: "20px" }}>
              <CustomButton
                handleClick={handleCreateTaskTypes}
                innerContent="Create Task Types"
              />
            </div>
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
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Sequence
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Delivery Work Type
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Work Type Category
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Screen Field Name
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Up/Down
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
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

      <CustomButton handleClick={handleSave} innerContent="Save" />
    </>
  );
}
