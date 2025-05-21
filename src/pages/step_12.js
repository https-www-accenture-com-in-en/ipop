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

export default function Step_12() {
  const [dummyData, setDummyData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/v1/api/admin/masterprojects")
      .then((response) => {
        console.log("Master projects fetched successfully:", response.data);
        setDummyData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching master projects:", error);
      });
  }, []);
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
              {currentMaster?.subProjectNames.map((sub) => (
                <MenuItem key={sub} value={sub}>
                  {sub}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <CustomButton
            handleClick={() => {
              setShowTable(true);
            }}
            innerContent="Create V-Model Project Tasks"
          />
        </Box>
      </div>
      {showTable && <VModelTable style={{ marginTop: "20px" }} />}
    </div>
  );
}
