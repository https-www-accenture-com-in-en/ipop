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
import DropdownWithTextBox from './DropDown.js';

// Hardcoded list of Ticket Types
const hardcodedTicketTypes = [
  "Assistance",
"Correction",
"PMON",
"Habilitation",
"Evolution",
"RITM"
];


// Delivery Work Type -> Work Type Category mapping

const hardcodedTicketTypes = [
  "Assistance", "Correction", "PMON", "Habilitation", "Evolution", "RITM"
];

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
  const [selectedTicketType, setSelectedTicketType] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [selectedName, setSelectedName] = useState(null);
  const [uiType, setUiType] = useState('');
  const [sequence, setSequence] = useState('');


  const [allNames, setAllNames] = useState(["Ticket Number","Ticket description"]);
  const [implicitAttr, setImplicitAttr] = useState(["Estimated Effort" ,"Burnt Effort","Remaining Effort","Effort To Be Clocked","Additional Effort To Be Clocked"])
  const [allNames, setAllNames] = useState(["Ticket Number", "Ticket description", "Ticket Priority"]);
  const [implicitAttr, setImplicitAttr] = useState(["Estimated Effort", "Burnt Effort", "Remaining Effort", "Effort To Be Clocked", "Additional Effort To Be Clocked"]);
  const [mappings, setMappings] = useState([]);

  const handleAddMapping = () => {
    if (selectedTicketType && ticketNumber && selectedDelivery && selectedCategory) {
      setMappings([
        ...mappings,
        {
          ticketType: selectedTicketType,
          ticketNumber,
          deliveryWorkType: selectedDelivery,
          workTypeCategory: selectedCategory
        }
      ]);
      setTicketNumber("");
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

  return (
    <Box p={4} sx={{ maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5"
  gutterBottom
  sx={{
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    maxWidth: '60%'  // Optional: can also use '600px' or so if you want a narrower wrap
  }}>
        Define Meta Data (Ticket Attributes) for Ticket Types
      </Typography>

      <br></br>

      <label htmlFor="nameInput" style={{ display: 'block', marginBottom: 3, fontWeight: 'bold' }}>
        Ticket type
      </label>
      <FormControl margin="normal" sx={{ minWidth: 300 }}>
        <InputLabel>Select Ticket Type</InputLabel>
        <Select
          value={selectedTicketType}
          onChange={(e) => setSelectedTicketType(e.target.value)}
          label="Ticket Type"
        >
          {hardcodedTicketTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

{/* <label htmlFor="nameInput" style={{ display: 'block', marginBottom: 3, fontWeight: 'bold' }}>
        Ticket Number
      </label>
      <Box display="flex" alignItems="center" gap={2} mt={2}>
        <TextField
          label="Enter Ticket Number"
          value={ticketNumber}
          onChange={(e) => setTicketNumber(e.target.value)}
          fullWidth
        />
        
      </Box> */}

      <div style={{ marginTop: "20px" }}>
        <DropdownWithTextBox allNames={allNames} setAllNames={setAllNames} setUiType={setUiType} setSequence={setSequence} setSelectedName={setSelectedName} label={"Define Explicit Attributes"} />
        </div>

      <div style={{ marginTop: "20px" }}>
        <DropdownWithTextBox allNames={implicitAttr} setAllNames={setImplicitAttr} setUiType={setUiType} setSequence={setSequence} setSelectedName={setSelectedName} label={"Define Implicit Attributes"} />
        </div>

      <List sx={{ mt: 3 }}>
        {mappings.map((map, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleDelete(index)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`${map.ticketType} - ${map.ticketNumber}`}
              secondary={`Category: ${map.workTypeCategory}, Delivery: ${map.deliveryWorkType}`}
            />
          </ListItem>
        ))}
      </List>
    <Box sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <div
        style={{
          border: '1px solid #7500c0',
          borderRadius: '10px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            fontWeight: 'bold',
            fontSize: '18px',
          }}
        >
          Define Meta Data (Ticket Attributes)
        </Typography>

<label htmlFor="nameInput" style={{ display: 'block',  fontWeight: 'bold' }}>
        Ticket Type
      </label>
        <FormControl  fullWidth sx={{ maxWidth: '100%'}}>
          <InputLabel>Select Ticket Type</InputLabel>
          <Select
            value={selectedTicketType}
            onChange={(e) => setSelectedTicketType(e.target.value)}
            label="Ticket Type"
          >
            {hardcodedTicketTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DropdownWithTextBox
          allNames={allNames}
          setAllNames={setAllNames}
          setUiType={setUiType}
          setSequence={setSequence}
          setSelectedName={setSelectedName}
          label={"Define Explicit Attributes"}
        />

        <DropdownWithTextBox
          allNames={implicitAttr}
          setAllNames={setImplicitAttr}
          setUiType={setUiType}
          setSequence={setSequence}
          setSelectedName={setSelectedName}
          label={"Define Implicit Attributes"}
        />

        <List>
          {mappings.map((map, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${map.ticketType} - ${map.ticketNumber}`}
                secondary={`Category: ${map.workTypeCategory}, Delivery: ${map.deliveryWorkType}`}
              />
            </ListItem>
          ))}
        </List>

        <Button
                  onClick={handleSave}
                  variant="contained"
                  sx={{
                    mt: 0.5,
                    px: 0.5,
                    py: 0.5,
                    fontSize: '10px',
                    fontWeight: 'bold',
                    borderRadius: '6px',
                    backgroundColor: '#7500c0',
                    color: 'white',
                    width: '100%',
                    marginTop: '0px',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#7500c0',
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  Save
                </Button>
      </div>
    </Box>
  );
}
