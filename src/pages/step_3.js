import { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";
import DropdownWithTextBox from "./DropDown.js";
import CustomButton from "../components/CustomButton.jsx";
import axios from "axios";

export default function Step_3() {
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [mappings, setMappings] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [uiType, setUiType] = useState("");
  const [workTypes, setWorkTypes] = useState("");
  const [sequence, setSequence] = useState("");
  const [taskType, setTaskType] = useState([]);
  const [allNames, setAllNames] = useState([]);
  const names = allNames.map((name, index) => ({
    name,
    sequence: index + 1,
  }));

  const handleAddMapping = () => {
    if (ticketType && selectedDelivery && selectedCategory) {
      setMappings([
        ...mappings,
        {
          ticketType,
          deliveryWorkType: selectedDelivery,
          workTypeCategory: selectedCategory,
        },
      ]);
      setTicketType("");
    }
  };

  const handleDelete = (index) => {
    const updated = [...mappings];
    updated.splice(index, 1);
    setMappings(updated);
  };

  const handleSave = () => {
    console.log("Final Mappings", mappings);
  };

  const handleDeliveryChange = (e) => {
    const value = e.target.value;
    setSelectedDelivery(value);
    setSelectedCategory(""); // Reset category when delivery changes
  };
  const handleNext = async () => {
    //    await axios.post(
    //   `http://localhost:5000/addGuiwithSequence/`,
    //   { gui_type: uiType,
    //     master_work_types: names.map((item) => item.name),
    //     sequences: names.map((item) => item.sequence),
    //   }
    // );
    console.log("data saved");
  };

  const getTaskTypes = async () => {
    const res = await axios.get(
      "http://localhost:5000/v1/api/admin/only-task-types"
    );
    if (res.status === 200) {
      const data = res.data.map((item) => ({
        taskType: item.taskType,
      }));
      setTaskType(data);
    } else {
      console.error("❌ Error fetching data:", res.status);
    }
  };

  useEffect(() => {
    getTaskTypes();
  }, []);

  return (
    <div style={{ marginTop: "20px" }}>
      <div className="page-wrapper">
        <Box>
          <label
            htmlFor="workType"
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: 15,
            }}
          >
            Work Type Category
          </label>
          <TextField
            id="workType"
            value="Ticket Delivery"
            size="small"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
          <label
            htmlFor="ticketTypes"
            style={{
              fontWeight: "bold",
              display: "block",
              marginTop: "20px",
              marginBottom: 15,
            }}
          >
            Select Task Type
          </label>

          <FormControl fullWidth size="small">
            <InputLabel>Select Task Type</InputLabel>
            <Select
              label="Select Task Type"
              value={selectedDelivery}
              onChange={handleDeliveryChange}
            >
              {taskType.map((type) => (
                <MenuItem key={type.id} value={type.taskType}>
                  {type.taskType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div style={{ marginTop: "20px" }}>
            <DropdownWithTextBox
              allNames={allNames}
              setAllNames={setAllNames}
              setUiType={setUiType}
              setSequence={setSequence}
              setSelectedName={setSelectedName}
              label={"Create Ticket Types: "}
            />
          </div>
        </Box>
      </div>
      <CustomButton handleClick={handleNext} innerContent="Save" />
    </div>
  );
}
