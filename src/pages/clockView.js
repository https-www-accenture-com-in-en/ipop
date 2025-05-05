import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Stack,
  FormControl,
  FormLabel,
  FormGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AM from "./AM";
import AD from "./AD";
import NTD from "./NTD";
import NTNDPage from "./NTND";

// Button sets for support and project
const supportButtons = ["AM", "AD", "NTD", "NTND", "VACATION"];
const projectButtons = ["NTD", "NTND", "PROJECTS", "VACATION"];
const bothButtons = ["AM", "AD", "NTD", "NTND", "PROJECTS", "VACATION"];

// Calculate Friday based on start date
function getFriday(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = date.getDay();
  // Calculate Monday of this week
  const diffToMonday = date.getDate() - ((day + 6) % 7);
  const monday = new Date(date.setDate(diffToMonday));
  // Friday is 4 days after Monday
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  return friday.toISOString().split("T")[0];
}

// Calculate Monday based on start date
function getMonday(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDay();
  const diff = date.getDate() - ((day + 6) % 7);
  return new Date(date.setDate(diff));
}

// Format date for display in checkbox/radio labels
function formatDate(date) {
  const day = date.toLocaleDateString("en-US", { weekday: "short" });
  const d = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  return `${day} (${d} ${month})`;
}

export default function ClockView() {
  // Store the selected start date
  const [startDate, setStartDate] = useState("");
  // Flags to show support and/or project checkboxes
  const [showOptions, setShowOptions] = useState({
    support: false,
    project: false,
  });
  // Store the selected days as an array of date strings
  const [selectedDays, setSelectedDays] = useState([]);
  // Store the selected task button (AM, AD, etc.)
  const [selectedButton, setSelectedButton] = useState("");
  // Control dialog visibility for JSON popup
  const [openDialog, setOpenDialog] = useState(false);

  // Calculate Friday date based on startDate
  const fridayOfWeek = getFriday(startDate);

  // Toggle support/project checkboxes
  const handleCheckboxChange = (type) => {
    setShowOptions((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
    setSelectedButton(""); // Reset selected task when toggling
    setSelectedDays([]); // Reset selected days as well
  };

  // Calculate all weekdays (Monday to Friday) from startDate
  const mondayDate = startDate ? getMonday(startDate) : null;
  const weekDates = mondayDate
    ? [...Array(5)].map((_, i) => {
        const d = new Date(mondayDate);
        d.setDate(d.getDate() + i);
        return d;
      })
    : [];

  // Determine which buttons to show based on support/project selection
  let buttonsToShow = [];
  if (showOptions.support && showOptions.project) {
    buttonsToShow = bothButtons;
  } else if (showOptions.support) {
    buttonsToShow = supportButtons;
  } else if (showOptions.project) {
    buttonsToShow = projectButtons;
  }

  // Handle clicking on a task button (AM, AD, etc.)
  const handleButtonClick = (btn) => {
    setSelectedButton(btn);
    setSelectedDays([]); // clear previous days selection when task changes
  };

  const renderSelectedComponent = () => {
    switch (selectedButton) {
      case 'AM':
        return <AM />;
      case 'AD':
        return <AD/>;
      case 'NTD':
        return <NTD />;
      case 'NTND':
        return <NTNDPage />;
      default:
        return null;
    }
  };

  // Check if selectedButton is AD or VACATION (use checkboxes for days)
  const daysUseCheckboxes = selectedButton === "PROJECTS" || selectedButton === "VACATION";

  // Day selection handler
  const handleDayChange = (dateStr) => {
    if (daysUseCheckboxes) {
      // multiple selection (checkboxes)
      if (selectedDays.includes(dateStr)) {
        setSelectedDays(selectedDays.filter((d) => d !== dateStr));
      } else {
        setSelectedDays([...selectedDays, dateStr]);
      }
    } else {
      // single selection (radio buttons)
      setSelectedDays([dateStr]);
    }
  };

  // Handle form submission: show the selected data as JSON in a popup
  const handleSubmit = () => {
    setOpenDialog(true);
  };

  // Handle start date change to adjust to Monday of the week
  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;
    const mondayDate = getMonday(selectedDate);
    const formattedMondayDate = mondayDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    setStartDate(formattedMondayDate);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Stack direction="row" spacing={4} sx={{ marginTop: 4 }}>
        <TextField
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={handleStartDateChange}
        />
        <TextField
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={fridayOfWeek}
          disabled
        />
      </Stack>

      {/* Support and Project checkboxes */}
      <Box sx={{ marginTop: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={showOptions.support}
              onChange={() => handleCheckboxChange("support")}
            />
          }
          label="Support"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showOptions.project}
              onChange={() => handleCheckboxChange("project")}
            />
          }
          label="Project"
        />
      </Box>

      {/* Task buttons */}
      {(showOptions.support || showOptions.project) && (
        <>
          <Stack direction="row" spacing={2} sx={{ marginTop: 2, flexWrap: "wrap" }}>
            {buttonsToShow.map((btn) => (
              <Button
                key={btn}
                variant={selectedButton === btn ? "contained" : "outlined"}
                color={selectedButton === btn ? "primary" : "inherit"}
                onClick={() => handleButtonClick(btn)}
              >
                {btn}
              </Button>
            ))}
          </Stack>

          {/* Days selection: checkboxes or radio based on selectedButton */}
          {weekDates.length > 0 && selectedButton != false && (
            <FormControl component="fieldset" sx={{ marginTop: 4 }}>
              <FormLabel component="legend">Select Days</FormLabel>
              <FormGroup row>
                {weekDates.map((date, i) => {
                  const dateStr = date.toDateString();
                  const isChecked = selectedDays.includes(dateStr);

                  return (
                    <FormControlLabel
                      key={i}
                      control={
                        daysUseCheckboxes ? (
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleDayChange(dateStr)}
                          />
                        ) : (
                          <input
                            type="radio"
                            name="dayRadio"
                            checked={isChecked}
                            onChange={() => handleDayChange(dateStr)}
                            style={{ marginRight: 8 }}
                          />
                        )
                      }
                      label={formatDate(date)}
                    />
                  );
                })}
              </FormGroup>
            </FormControl>
          )}

          {/* Submit button */}
          {/* <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 4 }}>
            Submit
          </Button> */}
        </>
      )}

      {/* Dialog popup to show JSON of selected data */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Selected Data
          <Button
            onClick={() => setOpenDialog(false)}
            color="primary"
            variant="text"
            sx={{ minWidth: "auto", padding: 0 }}
          >
            X
          </Button>
        </DialogTitle>
        <DialogContent dividers>
          <pre>
            {JSON.stringify(
              {
                startDate,
                endDate: fridayOfWeek,
                supportSelected: showOptions.support,
                projectSelected: showOptions.project,
                selectedTask: selectedButton || null,
                selectedDays,
              },
              null,
              2
            )}
          </pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {renderSelectedComponent()}
    </Box>
  );
}
