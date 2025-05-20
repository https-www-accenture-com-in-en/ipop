import { useEffect, useState } from "react";
import { Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import VModelTable from "../components/VModelTable.jsx";
import TextBox from "../components/TextBox.jsx";

import axios from "axios";
import CustomButton from "../components/CustomButton.jsx";

export default function Step_10() {
  const [clusters, setClusters] = useState([]);
  const [adProject, setAdProject] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/v1/api/admin/clusters")
      .then((response) => {
        console.log("Clusters fetched successfully:", response.data);
        setClusters(response.data);
      })
      .catch((error) => {
        console.error("Error fetching clusters:", error);
      });
  }, []);

  const [showTable, setShowTable] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const handleClusterChange = (event) => {
    setSelectedCluster(event.target.value);
    setSelectedValue("");
  };

  const handleValueChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const currentCluster = clusters.find(
    (c) => c.clusterName === selectedCluster
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
          Select Cluster
        </label>
        <Box my={2} sx={{ width: 300 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Cluster</InputLabel>
            <Select
              value={selectedCluster}
              label="Cluster"
              onChange={handleClusterChange}
            >
              {clusters.map((cluster) => (
                <MenuItem key={cluster.clusterName} value={cluster.clusterName}>
                  {cluster.clusterName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <label
          style={{
            fontWeight: "bold",
            display: "block",
            marginTop: "20px",
          }}
        >
          Select Cluster Value
        </label>
        <Box my={2} sx={{ width: 300 }}>
          <FormControl fullWidth size="small" disabled={!selectedCluster}>
            <InputLabel>Cluster Value</InputLabel>
            <Select
              value={selectedValue}
              label="Cluster Value"
              onChange={handleValueChange}
            >
              {currentCluster?.clusterValues.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box my={2} sx={{ width: 300 }}>
          <TextBox
            inputValue={adProject}
            setInputValue={setAdProject}
            InputLabel="Create AD Project"
            InputInnerLabel="Enter Project Name"
          />
        </Box>
        <CustomButton
          handleClick={() => {
            setShowTable(true);
          }}
          innerContent="Create V-Model Project Tasks"
        />
      </div>
      <Box my={2}>
        {showTable && <VModelTable style={{ marginTop: "20px" }} />}
      </Box>
    </div>
  );
}
