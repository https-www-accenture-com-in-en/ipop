import { useState } from "react";
import {
  Button,
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

import VModelTable from "../components/VModelTable";

export default function Step_12() {
  const dummyData = [
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
  ];

  const [showTable, setShowTable] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState("");
  const [selectedSubProject, setSelectedSubProject] = useState("");

  const handleMasterChange = (event) => {
    setSelectedMaster(event.target.value);
    setSelectedSubProject("");
  };

  const handleSubProjectChange = (event) => {
    setSelectedSubProject(event.target.value);
  };

  const currentMaster = dummyData.find(
    (p) => p.masterProjectName === selectedMaster
  );

  return (
    <div style={{ marginTop: "20px" }}>
      <div
        style={{
          border: "1px solid #7500c0",
          borderRadius: "10px",
          paddingTop: "20px",
          paddingLeft: "60px",
          paddingRight: "60px",
          paddingBottom: "20px",
        }}
      >
        <label style={{ fontWeight: "bold", display: "block" }}>
          Select Master Project
        </label>
        <Box my={2} sx={{ width: 300 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Master Project</InputLabel>
            <Select
              value={selectedMaster}
              label="Master Project"
              onChange={handleMasterChange}
            >
              {dummyData.map((project) => (
                <MenuItem
                  key={project.masterProjectName}
                  value={project.masterProjectName}
                >
                  {project.masterProjectName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <label
          style={{
            fontWeight: "bold",
            display: "block",
          }}
        >
          Select Sub-Project
        </label>
        <Box my={2} sx={{ width: 300 }}>
          <FormControl fullWidth size="small" disabled={!selectedMaster}>
            <InputLabel>Sub Project</InputLabel>
            <Select
              value={selectedSubProject}
              label="Sub Project"
              onChange={handleSubProjectChange}
            >
              {currentMaster?.projectName.map((sub) => (
                <MenuItem key={sub} value={sub}>
                  {sub}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button
          onClick={() => setShowTable(true)}
          variant="contained"
          sx={{
            mt: 2,
            px: 2,
            py: 1,
            fontSize: "14px",
            fontWeight: "bold",
            borderRadius: "6px",
            backgroundColor: "#eb7476",
            color: "white",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#f38b8d",
            },
          }}
        >
          Create V-Model Project Tasks
        </Button>
      </div>
      <Box my={2}>
        {showTable && <VModelTable style={{ marginTop: "20px" }} />}
      </Box>
    </div>
  );
}
