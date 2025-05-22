import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import VModelTable from "../components/VModelTable.jsx";
import TextBox from "../components/TextBox.jsx";
import CrudDropdown from "../components/Dropdown";
import CustomButton from "../components/CustomButton.jsx";
import { apiGet } from "../utils/api";

export default function Step_10() {
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(null); // full cluster object

  const [clusterValues, setClusterValues] = useState([]);
  const [selectedClusterValue, setSelectedClusterValue] = useState(null);

  const [adProject, setAdProject] = useState("");
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const data = await apiGet("/clusters");
        setClusters(data || []);
      } catch (error) {
        console.error("Error fetching clusters:", error);
      }
    };
    fetchClusters();
  }, []);

  useEffect(() => {
    const fetchClusterValues = async () => {
      if (!selectedCluster || !selectedCluster._id) {
        setClusterValues([]);
        setSelectedClusterValue(null); // Also reset selected value
        return;
      }
      try {
        const data = await apiGet(`/clustervalues/${selectedCluster._id}`);
        setClusterValues(data || []);
      } catch (error) {
        console.error("Error fetching cluster values:", error);
        setClusterValues([]);
      }
    };
    fetchClusterValues();
  }, [selectedCluster]);

  const handleClusterSelected = (clusterItem, index) => {
    if (selectedCluster?._id !== clusterItem?._id) {
      setSelectedCluster(clusterItem);
    }
  };

  const handleClusterValueSelected = (valueItem, index) => {
    setSelectedClusterValue(valueItem);
  };

  const clusterValueAdditionalPayload = selectedCluster?._id
    ? { cluster: selectedCluster._id }
    : {}; // If no cluster selected, payload is empty (dropdown should be disabled anyway)

  const handleCreateVModelTasks = () => {
    if (selectedCluster && selectedClusterValue && adProject.trim()) {
      setShowTable(true);
    } else {
      alert("Please select a cluster, a value, and enter a project name.");
    }
  };

  return (
    <div className="page-wrapper" style={{ marginTop: "20px", padding: "20px" }}>
      <div>
        <Box my={2} sx={{ maxWidth: 400 }}>
          <CrudDropdown
            label="Select or Manage Cluster"
            items={clusters}
            onItemsChange={setClusters}
            onItemSelected={handleClusterSelected}
            endpoint="/clusters"
            displayField="name"
            valueField="_id"
          />
        </Box>

        <Box my={2} sx={{ maxWidth: 400 }}>
          <CrudDropdown
            label="Select or Manage Cluster Value"
            items={clusterValues}
            onItemsChange={setClusterValues}
            onItemSelected={handleClusterValueSelected}
            endpoint="/clustervalues"
            additionalCreatePayload={clusterValueAdditionalPayload}
            displayField="name"
            valueField="_id"
            disabled={!selectedCluster || !selectedCluster._id}
            placeholder={!selectedCluster || !selectedCluster._id ? "Select a cluster first" : "Type or select value"}
          />
        </Box>

        <Box my={2} sx={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextBox
            inputValue={adProject}
            setInputValue={setAdProject}
            InputLabel="AD Project Name"
            InputInnerLabel="Enter Project Name"
          />
          <CustomButton
            handleClick={handleCreateVModelTasks}
            innerContent="Create V-Model Project Tasks"
            disabled={!selectedCluster || !selectedClusterValue || !adProject.trim()}
          />
        </Box>
      </div>

      {showTable && <VModelTable style={{ marginTop: "20px" }} />}
    </div>
  );
}