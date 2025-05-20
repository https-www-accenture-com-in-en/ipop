import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemSecondaryAction,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

export default function ProjectManagerMUI() {
  const [projects, setProjects] = useState([
    {
      masterProjectName: "USA Rollout",
      projectName: ["USA Phase 1", "USA Phase 2", "USA QA"],
    },
    {
      masterProjectName: "Meneca Rollout",
      projectName: ["Meneca Frontend", "Meneca Backend"],
    },
    {
      masterProjectName: "Kazakstan Rollout",
      projectName: ["KZ Module A", "KZ Module B", "KZ Reports"],
    },
  ]);

  const [selectedIndex, setSelectedIndex] = useState("");
  const [newMasterName, setNewMasterName] = useState("");
  const [editMasterName, setEditMasterName] = useState("");
  const [newSubName, setNewSubName] = useState("");

  const handleAddMaster = () => {
    if (!newMasterName.trim()) return;
    setProjects([
      ...projects,
      { masterProjectName: newMasterName, projectName: [] },
    ]);
    setNewMasterName("");
  };

  const handleDeleteMaster = () => {
    if (selectedIndex === "") return;
    const updated = [...projects];
    updated.splice(selectedIndex, 1);
    setProjects(updated);
    setSelectedIndex("");
    setEditMasterName("");
  };

  const handleAddSub = () => {
    if (!newSubName.trim() || selectedIndex === "") return;
    const updated = [...projects];
    updated[selectedIndex].projectName.push(newSubName);
    setProjects(updated);
    setNewSubName("");
  };

  const handleDeleteSub = (subIdx) => {
    const updated = [...projects];
    updated[selectedIndex].projectName.splice(subIdx, 1);
    setProjects(updated);
  };

  const handleEditSub = (subIdx, newVal) => {
    const updated = [...projects];
    updated[selectedIndex].projectName[subIdx] = newVal;
    setProjects(updated);
  };

  const handleSaveMasterName = () => {
    if (!editMasterName.trim()) return;
    const updated = [...projects];
    updated[selectedIndex].masterProjectName = editMasterName;
    setProjects(updated);
  };

  return (
    <Box sx={{ my: 4 }}>
      {/* Add Master */}
      <label
        style={{
          fontWeight: "bold",
          display: "block",
        }}
      >
        Create Master Project
      </label>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="New Master Project"
          size="small"
          fullWidth
          style={{
            fontWeight: "bold",
            display: "block",
            marginTop: "20px",
          }}
          value={newMasterName}
          onChange={(e) => setNewMasterName(e.target.value)}
        />
        <button
          onClick={handleAddMaster}
          style={{
            padding: "8px 14px",
            fontSize: "12px",
            cursor: "pointer",
            border: "none",
            color: "white",
            fontWeight: "bold",
            borderRadius: "4px",
            marginTop: "20px",
            backgroundColor: "#eb7476",
          }}
        >
          Add
        </button>
      </Box>

      {/* Select Master */}
      <Select
        displayEmpty
        fullWidth
        size="small"
        value={selectedIndex}
        onChange={(e) => {
          setSelectedIndex(e.target.value);
          setEditMasterName(projects[e.target.value]?.masterProjectName || "");
        }}
        sx={{ mb: 2 }}
      >
        <MenuItem value="">
          <em>Select Master Project</em>
        </MenuItem>
        {projects.map((proj, idx) => (
          <MenuItem key={idx} value={idx}>
            {proj.masterProjectName}
          </MenuItem>
        ))}
      </Select>

      {/* Edit + Delete Master */}
      {selectedIndex !== "" && (
        <Box sx={{ mb: 2 }}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
            }}
          >
            Edit/Delete Master Project (or) Add New Sub Project
          </label>
          <TextField
            label="Edit Master Name"
            value={editMasterName}
            size="small"
            fullWidth
            style={{
              fontWeight: "bold",
              display: "block",
              marginTop: "20px",
            }}
            onChange={(e) => setEditMasterName(e.target.value)}
          />
          <button
            onClick={handleSaveMasterName}
            style={{
              padding: "8px 14px",
              fontSize: "12px",
              cursor: "pointer",
              border: "none",
              color: "white",
              fontWeight: "bold",
              borderRadius: "4px",
              marginTop: "20px",
              marginRight: "10px",
              backgroundColor: "#eb7476",
            }}
          >
            Save
          </button>
          <button
            onClick={handleDeleteMaster}
            style={{
              padding: "8px 14px",
              fontSize: "12px",
              cursor: "pointer",
              border: "none",
              color: "white",
              fontWeight: "bold",
              borderRadius: "4px",
              marginTop: "20px",
              backgroundColor: "#eb7476",
            }}
          >
            Delete
          </button>
        </Box>
      )}

      {selectedIndex !== "" && (
        <Box>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
            }}
          >
            Create Sub-Project for {projects[selectedIndex].masterProjectName}
          </label>
          <Box sx={{ display: "flex", gap: 2, mt: 2, mb: 2 }}>
            <TextField
              label="New Sub Project"
              value={newSubName}
              size="small"
              onChange={(e) => setNewSubName(e.target.value)}
              fullWidth
            />
            <button
              onClick={handleAddSub}
              style={{
                padding: "8px 14px",
                fontSize: "12px",
                cursor: "pointer",
                border: "none",
                color: "white",
                fontWeight: "bold",
                borderRadius: "4px",
                backgroundColor: "#eb7476",
              }}
            >
              Add
            </button>
          </Box>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
            }}
          >
            Edit/Delete Sub Project
          </label>
          <List>
            {projects[selectedIndex].projectName.map((sub, i) => (
              <ListItem key={i} disableGutters>
                <TextField
                  value={sub}
                  size="small"
                  style={{
                    fontWeight: "bold",
                    display: "block",
                  }}
                  onChange={(e) => handleEditSub(i, e.target.value)}
                  fullWidth
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleDeleteSub(i)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}
