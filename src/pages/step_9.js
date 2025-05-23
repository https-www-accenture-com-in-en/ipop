import { useEffect, useState } from "react";
import CustomButton from "../components/CustomButton.jsx";
import Dropdown from "../components/Dropdown";
import { apiGet } from "../utils/api.js";
import CrudDropdown from "../components/Dropdown";
import VModelTable from "../components/VModelTable.jsx";

const FieldRow = () => {
  const [selectedMasterProject, setSelectedMasterProject] = useState(null);
  const [selectedSubProject, setSelectedSubProject] = useState(null);
  const [masterprojects, setMasterProjects] = useState([]);
  const [subprojects, setSubProjects] = useState([]);
  const [showTable, setShowTable] = useState(false);

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
  useEffect(() => {
    const fetchSubProjects = async () => {
      if (!selectedMasterProject || !selectedMasterProject._id) {
        setSubProjects([]);
        setSelectedSubProject(null); // Also reset selected value
        return;
      }
      try {
        const data = await apiGet(`/sub-projects/${selectedMasterProject._id}`);
        setSubProjects(data || []);
      } catch (error) {
        console.error("Error fetching sub projects:", error);
        setSubProjects([]);
      }
    };
    fetchSubProjects();
  }, [selectedMasterProject]);
  // useEffect(() => {
  //   const loadSubProjects = async () => {
  //     const currentMaster = masterprojects.find(
  //       (p) => p._id === selectedMasterProject
  //     );
  //     setSubProjects(currentMaster ? currentMaster.subprojects : []);
  //   };
  //   loadSubProjects();
  // }, [selectedMasterProject]);
  console.log("selectedMasterProject", selectedMasterProject);

  const handleMasterProjectSelected = (masterProjectItem, index) => {
    if (selectedMasterProject?._id !== masterProjectItem?._id) {
      setSelectedMasterProject(masterProjectItem);
    }
  };

  const handleSubProjectSelected = (subProjectItem, index) => {
    setSelectedSubProject(subProjectItem);
  };

  const subProjectsAdditionalPayload = selectedMasterProject?._id
    ? { masterProject: selectedMasterProject._id }
    : {}; // If no master project selected, payload is empty (dropdown should be disabled anyway)

  return (
    <>
      <div className="page-wrapper">
        <CrudDropdown
          label="Create Master Project"
          items={masterprojects}
          onItemsChange={setMasterProjects}
          onItemSelected={handleMasterProjectSelected}
          endpoint="/master-projects"
          displayField="name"
          valueField="_id"
        />
        <CrudDropdown
          label={
            !selectedMasterProject || !selectedMasterProject._id
              ? "Create Sub-Project"
              : `Create Sub-Project for ${selectedMasterProject?.name}`
          }
          items={subprojects}
          onItemsChange={setSubProjects}
          onItemSelected={handleSubProjectSelected}
          endpoint="/sub-projects"
          additionalCreatePayload={subProjectsAdditionalPayload}
          displayField="name"
          valueField="_id"
          disabled={!selectedMasterProject || !selectedMasterProject._id}
          placeholder={
            !selectedMasterProject || !selectedMasterProject._id
              ? "Select a master project first"
              : "Type or select value"
          }
        />
        <CustomButton
          handleClick={() => {
            setShowTable(true);
          }}
          innerContent="Create V-Model Project Tasks"
        />
      </div>

      {showTable && <VModelTable style={{ marginTop: "20px" }} />}
    </>
  );
};
export default FieldRow;
