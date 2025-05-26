import { useEffect, useState } from "react";
import {
  Button,
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import axios from "axios";

import VModelTable from "../components/VModelTable";
import CustomButton from "../components/CustomButton.jsx";
import { apiGet } from "../utils/api.js";

export default function Step_12() {
  const [masterProjects, setMasterProjects] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState("");
  const [selectedSubProject, setSelectedSubProject] = useState("");

  useEffect(() => {
    const loadMasterProjects = async () => {
      try {
        const data = await apiGet("/master-projects");
        console.log("Master Projects:", data);
        setMasterProjects(data);
      } catch (err) {
        console.error("Error loading master projects:", err);
      }
    };
    loadMasterProjects();
  }, []);

  const handleMasterChange = (event) => {
    setSelectedMaster(event.target.value);
    setSelectedSubProject("");
  };

  const handleSubProjectChange = (event) => {
    setSelectedSubProject(event.target.value);
  };

  const currentMaster = masterProjects.find((p) => p.name === selectedMaster);

  return (
    <div>
      <div className="page-wrapper">
        <Box>
          <label
            style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
          >
            Select Master Project
          </label>
          <FormControl fullWidth size="small">
            <InputLabel>Master Project</InputLabel>
            <Select
              value={selectedMaster}
              label="Master Project"
              onChange={handleMasterChange}
            >
              {masterProjects.map((project) => (
                <MenuItem key={project.id} value={project.name}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box my={2}>
          <label
            style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
          >
            Select Sub-Project
          </label>
          <FormControl fullWidth size="small" disabled={!selectedMaster}>
            <InputLabel>Sub Project</InputLabel>
            <Select
              value={selectedSubProject}
              label="Sub Project"
              onChange={handleSubProjectChange}
            >
              {currentMaster?.subprojects.map((sub) => (
                <MenuItem key={sub._id} value={sub.name}>
                  {sub.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <CustomButton
          handleClick={() => {
            setShowTable(true);
          }}
          innerContent="Create V-Model Project Tasks"
        />
      </div>
      {showTable && <VModelTable style={{ marginTop: "20px" }} />}
    </div>
  );
}
