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
  const [masterWorkType, setMasterWorkType] = useState([]);
  const [dwt, setDwt] = useState([]);
  const [groupedData, setGroupedData] = useState([]); // [{ deliveryType, workTypeCategories }]
  const [rows, setRows] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [masterData, setMasterData] = useState([]);
  const [selectedMaster, setSelectedMaster] = useState("");

  const getMWTandDWT = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/v1/api/admin/task-types-with-mwt-dwt"
      );
      if (res.status === 200) {
        setMasterData(res.data);
        setMasterWorkType(res.data.map((item) => item.masterWorkTypes));
      } else {
        console.error("❌ Error fetching data:", res.status);
      }
    } catch (err) {
      console.error("❌ Fetch Error:", err);
    }
  };

  useEffect(() => {
    getMWTandDWT();
  }, []);

  // When switching DWT, save current allNames and load new one
  const handleDeliveryTypeChange = (event) => {
    const newDWT = event.target.value;

    // Save current allNames to groupedData
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

    // Find selected DWT object under selected MWT
    const master = masterData.find(
      (item) => item.masterWorkTypes === selectedMaster
    );
    const delivery = master?.deliveryWorkTypes.find(
      (d) => d.deliveryWorkTypes === newDWT
    );

    // Extract WTCs from taskTypes
    const taskTypes = delivery?.taskTypes || [];
    const workTypeCategories = taskTypes.map((task) => task.workTypeCategory);

    setAllNames(workTypeCategories);

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

    const newRows = updatedGrouped.flatMap((group) => {
      let foundDelivery = null;

      for (const master of masterData) {
        const delivery = master.deliveryWorkTypes.find(
          (d) => d.deliveryWorkTypes === group.deliveryType
        );
        if (delivery) {
          foundDelivery = delivery;
          break;
        }
      }

      return group.workTypeCategories.map((wtc, idx) => {
        const task = foundDelivery?.taskTypes.find(
          (t) => t.workTypeCategory === wtc
        );

        return {
          dwt: group.deliveryType,
          wtc,
          sequence: idx + 1,
          screenField: task?.taskType || "",
        };
      });
    });

    // ✅ You were missing this:
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
        console.log("✅ Task types submitted successfully:", payload);
        setShowTable(false);
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
          <Box my={2}>
            <label
              htmlFor="SelectMasterWorkType"
              style={{ fontWeight: "bold", display: "block", marginBottom: 15 }}
            >
              Select Master Work Type
            </label>
            <TextField
              id="SelectMasterWorkType"
              label="Select Master Work Type"
              variant="outlined"
              select
              value={selectedMaster}
              onChange={(e) => {
                const selected = e.target.value;
                setSelectedMaster(selected);
                const found = masterData.find(
                  (item) => item.masterWorkTypes === selected
                );
                setDwt(
                  found
                    ? found.deliveryWorkTypes.map((d) => d.deliveryWorkTypes)
                    : []
                );
                setFields((prev) => ({ ...prev, deliveryType: "" }));
                setAllNames([]); // reset WTCs when changing MWT
              }}
              style={{
                width: "100%",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
              size="small"
            >
              {masterWorkType.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <div style={{ marginTop: "20px" }}>
              <label
                htmlFor="deliveryWT"
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: 15,
                }}
              >
                Select Delivery Work Types
              </label>

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
            </div>
            <div style={{ marginTop: "20px" }}>
              <DropdownWithTextBox
                allNames={allNames}
                setAllNames={setAllNames}
                setUiType={setUiType}
                setSequence={setSequence}
                setSelectedName={setSelectedName}
                label={"Manage Work Type Categories: "}
                disabled={!fields.deliveryType}
              />
            </div>

            <div style={{ marginTop: "20px" }}>
              <CustomButton
                handleClick={handleCreateTaskTypes}
                innerContent="Manage Task Types"
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
                    Screen Field Name For Task Type
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
