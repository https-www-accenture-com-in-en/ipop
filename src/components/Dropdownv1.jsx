import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { Delete, Edit, Add, Check, Cancel } from "@mui/icons-material";

export default function ProjectManager() {
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

  const [selectedMaster, setSelectedMaster] = useState(null);
  const [newMaster, setNewMaster] = useState("");
  const [newSubProject, setNewSubProject] = useState("");
  const [editMasterIndex, setEditMasterIndex] = useState(null);
  const [editMasterValue, setEditMasterValue] = useState("");
  const [editSubIndex, setEditSubIndex] = useState(null);
  const [editSubValue, setEditSubValue] = useState("");

  const handleAddMaster = () => {
    if (!newMaster.trim()) return;
    setProjects([
      ...projects,
      { masterProjectName: newMaster, projectName: [] },
    ]);
    setNewMaster("");
  };

  const handleAddSubProject = () => {
    if (!newSubProject.trim() || selectedMaster == null) return;
    setProjects((prev) =>
      prev.map((proj, index) =>
        index === selectedMaster
          ? { ...proj, projectName: [...proj.projectName, newSubProject] }
          : proj
      )
    );
    setNewSubProject("");
  };

  const handleDeleteMaster = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
    if (selectedMaster === index) setSelectedMaster(null);
  };

  const handleDeleteSub = (subIndex) => {
    setProjects((prev) =>
      prev.map((proj, index) =>
        index === selectedMaster
          ? {
              ...proj,
              projectName: proj.projectName.filter((_, i) => i !== subIndex),
            }
          : proj
      )
    );
  };

  const handleEditMaster = (index) => {
    setEditMasterIndex(index);
    setEditMasterValue(projects[index].masterProjectName);
  };

  const handleSaveMasterEdit = (index) => {
    setProjects((prev) =>
      prev.map((proj, i) =>
        i === index ? { ...proj, masterProjectName: editMasterValue } : proj
      )
    );
    setEditMasterIndex(null);
  };

  const handleEditSub = (index, name) => {
    setEditSubIndex(index);
    setEditSubValue(name);
  };

  const handleSaveSubEdit = (index) => {
    setProjects((prev) =>
      prev.map((proj, i) =>
        i === selectedMaster
          ? {
              ...proj,
              projectName: proj.projectName.map((name, j) =>
                j === index ? editSubValue : name
              ),
            }
          : proj
      )
    );
    setEditSubIndex(null);
  };

  return (
    <Box sx={{ my: 4 }}>
      <label
        style={{
          fontWeight: "bold",
          display: "block",
        }}
      >
        Create Master Project
      </label>
      <Box sx={{ display: "flex", gap: 2, my: 3 }}>
        <TextField
          label="New Master Project"
          value={newMaster}
          onChange={(e) => setNewMaster(e.target.value)}
          size="small"
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
        Edit/Delete/Select Master Project
      </label>

      {projects.map((proj, index) => (
        <Card sx={{ mt: 2 }} key={index}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 1 }}>
            {editMasterIndex === index ? (
              <>
                <TextField
                  value={editMasterValue}
                  onChange={(e) => setEditMasterValue(e.target.value)}
                  size="small"
                />
                <IconButton onClick={() => handleSaveMasterEdit(index)}>
                  <Check />
                </IconButton>
                <IconButton onClick={() => setEditMasterIndex(null)}>
                  <Cancel />
                </IconButton>
              </>
            ) : (
              <>
                <p>{proj.masterProjectName}</p>
                <button
                  onClick={() => setSelectedMaster(index)}
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
                  Select
                </button>
                <IconButton onClick={() => handleEditMaster(index)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteMaster(index)}>
                  <Delete />
                </IconButton>
              </>
            )}
          </Box>
        </Card>
      ))}

      {selectedMaster !== null && (
        <>
          <label
            style={{ fontWeight: "bold", display: "block", marginTop: "20px" }}
          >
            Subprojects for: {projects[selectedMaster].masterProjectName}
          </label>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              label="New Subproject"
              value={newSubProject}
              onChange={(e) => setNewSubProject(e.target.value)}
              size="small"
            />
            <button
              onClick={handleAddSubProject}
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
              Add Subproject
            </button>
          </Box>

          <List sx={{ mt: 2 }}>
            {projects[selectedMaster].projectName.map((sub, idx) => (
              <ListItem
                key={idx}
                secondaryAction={
                  <>
                    {editSubIndex === idx ? (
                      <>
                        <IconButton onClick={() => handleSaveSubEdit(idx)}>
                          <Check />
                        </IconButton>
                        <IconButton onClick={() => setEditSubIndex(null)}>
                          <Cancel />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => handleEditSub(idx, sub)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteSub(idx)}>
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </>
                }
              >
                {editSubIndex === idx ? (
                  <TextField
                    fullWidth
                    value={editSubValue}
                    onChange={(e) => setEditSubValue(e.target.value)}
                    size="small"
                  />
                ) : (
                  <ListItemText primary={sub} />
                )}
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
}
