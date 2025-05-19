import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Tb from "./tb";
import DropdownWithTextBox from './DropDown.js';

// L1 -> L2 mapping
const workTypeCategoryMap = {
  "Application Maintainance": [
    "Correction", "Assistance", "PMON", "RITM", "Habilitation",
    "Incidents", "Scoping", "Study", "Prototyping"
  ],
  "Application Development": [
    "Category-1", "Category-2", "Category-3",
    "Category-4", "Category-5", "Category-6"
  ]
};

const deliveryWorkTypes = Object.keys(workTypeCategoryMap);

export default function Step_4() {
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [mappings, setMappings] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [uiType, setUiType] = useState('');
  const [workTypes, setWorkTypes] = useState('');
  const [sequence, setSequence] = useState('');
  const [allNames, setAllNames] = useState([]);
  const names = allNames.map((name, index) => ({
    name,
    sequence: index + 1
  }));

  const handleAddMapping = () => {
    if (ticketType && selectedDelivery && selectedCategory) {
      setMappings([
        ...mappings,
        {
          ticketType,
          deliveryWorkType: selectedDelivery,
          workTypeCategory: selectedCategory
        }
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
  return (
    <div style={{ border: "1px solid #7500c0", borderRadius: "10px", paddingTop: "20px", paddingLeft: "60px", paddingRight: "60px", paddingBottom: "20px" }}>
      <Box p={4}>
        <label htmlFor="ticketTypes" style={{ fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
          Create Ticket Types
        </label>

        <FormControl fullWidth margin="normal">
          <InputLabel>Select Delivery Work Type</InputLabel>
          <Select
            value={selectedDelivery}
            onChange={handleDeliveryChange}
            label="Delivery Work Type"
          >
            {deliveryWorkTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <label htmlFor="ticketDelivery" style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', marginTop: '8px' }}>
          Work Type Category
        </label>
        <TextField
          label="Ticket Delivery"
          value={ticketType}
          disabled={!selectedDelivery}
          onChange={(e) => setTicketType(e.target.value)}
          fullWidth
        />
        <div style={{ marginTop: "20px" }}>
        <DropdownWithTextBox allNames={allNames} setAllNames={setAllNames} setUiType={setUiType} setSequence={setSequence} setSelectedName={setSelectedName} label={"Create Ticket Types: "} />
        </div>
 <Button
      onClick={handleNext}
      variant="contained"
      sx={{
        mt: 2,
        px: 2,
        py: 1,
        fontSize: '14px',
        fontWeight: 'bold',
        borderRadius: '6px',
        backgroundColor: '#eb7476',
        color: 'white',
        textTransform: 'none',
        '&:hover': {
          backgroundColor: '#f38b8d',
        },
      }}
    >
      SAVE
    </Button>
      </Box>
    </div>
  );
}
