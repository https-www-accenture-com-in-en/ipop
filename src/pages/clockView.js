import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Stack,
  Card,
  CardContent,
  Typography,
  IconButton,
  Radio,
  RadioGroup,
  FormControl,
  FormGroup
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

// Import your components
import AM from "./AM";
import AD from "./AD";
import AMSNonTicketDelivery from "./NTD";
import NTNDPage from "./NTND";
import Timeoff from "./Timeoff";
import Adpd from "./Adpd";
import Adpnd from "./Adpnd";
import Sipd from "./Sipd";
import Sipnd from "./Sipnd";

// Button sets
const supportButtons = [
  "AM Ticket Delivery",
  "AD Ticket Delivery",
  "AMS Non Ticket Delivery",
  "AMS Non Ticket Non Delivery",
  "Time Off"
];
const projectButtons = [
  "AD Project Delivery",
  "AD Project Non Delivery",
  "SI Project Delivery",
  "SI Project Non Delivery",
  "Time Off"
];
const bothButtons = [...new Set([...supportButtons, ...projectButtons])];

// Helpers
function getMondayAndFriday(dateStr) {
  if (!dateStr) return { monday: "", friday: "" };
  const date = new Date(dateStr);
  const day = date.getDay();
  const diffToMonday = date.getDate() - ((day + 6) % 7);
  const monday = new Date(date.setDate(diffToMonday));
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  return {
    monday: monday.toISOString().split("T")[0],
    friday: friday.toISOString().split("T")[0],
  };
}

function formatOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatDate(date) {
  const d = new Date(date);
  const day = formatOrdinal(d.getDate());
  const month = d.toLocaleString("default", { month: "long" });
  const weekday = d.toLocaleString("default", { weekday: "long" });
  return `${day} ${month} (${weekday})`;
}

function getDatesInRange(start, end) {
  const dateArray = [];
  let currentDate = new Date(start);
  const endDate = new Date(end);
  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateArray;
}

export default function ClockView() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showOptions, setShowOptions] = useState({ support: false, project: false });
  const [selectedButton, setSelectedButton] = useState("");
  const [cards, setCards] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); // For radio selection
  const [selectedDates, setSelectedDates] = useState({}); // For checkbox selection

  useEffect(() => {
    if (startDate) {
      const { monday, friday } = getMondayAndFriday(startDate);
      setStartDate(monday);
      setEndDate(friday);
    }
  }, [startDate]);

  const handleCheckboxChange = (option) => {
    if (option === "Time Off") {
      setShowOptions({ support: false, project: false, timeoff: true });
      setCards([{ name: "Time Off", component: <Timeoff />, id: Date.now() }]);
    } else {
      setShowOptions((prev) => ({ ...prev, [option]: !prev[option], timeoff: false }));
      if (option !== "timeoff") {
        setCards((prev) => prev.filter((card) => card.name !== "Time Off"));
      }
    }
  };

  const handleButtonClick = (btn) => {
    setSelectedButton(btn);
    setCards((prevCards) => [
      ...prevCards,
      { name: btn, component: renderSelectedComponent(btn), id: Date.now() },
    ]);
  };

  const renderSelectedComponent = (btn) => {
    switch (btn) {
      case 'AM Ticket Delivery': return <AM />;
      case 'AD Ticket Delivery': return <AD />;
      case 'AMS Non Ticket Delivery': return <AMSNonTicketDelivery />;
      case 'AMS Non Ticket Non Delivery': return <NTNDPage />;
      case 'Time Off': return <Timeoff />;
      case 'AD Project Delivery': return <Adpd />;
      case 'SI Project Delivery': return <Sipd />;
      case 'AD Project Non Delivery': return <Adpnd />;
      case 'SI Project Non Delivery': return <Sipnd />;
      default: return null;
    }
  };

  const handleCardDelete = (id) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  const isSupport = showOptions.support;
  const isProjectOrTimeOff = showOptions.project || showOptions.timeoff;
  const allDates = startDate && endDate ? getDatesInRange(startDate, endDate) : [];

  return (
    <Box sx={{ padding: 4, overflowY: "auto" }}>
      <Stack direction="row" spacing={4} sx={{ marginTop: 4 }}>
        <TextField
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          disabled
        />
      </Stack>

      <Box sx={{ marginTop: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={showOptions.support} onChange={() => handleCheckboxChange("support")} />}
          label="Support"
        />
        <FormControlLabel
          control={<Checkbox checked={showOptions.project} onChange={() => handleCheckboxChange("project")} />}
          label="Project"
        />
        <FormControlLabel
          control={<Checkbox checked={showOptions.timeoff || false} onChange={() => handleCheckboxChange("Time Off")} />}
          label="Time Off"
        />
      </Box>

      {/* Date Selectors Row */}
      <Box sx={{ marginTop: 3, display: "flex", overflowX: "auto", gap: 4 }}>
        {allDates.map((date, index) => {
          const label = formatDate(date);
          return (
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isSupport ? (
                <Radio
                  checked={selectedDate === label}
                  onChange={() => setSelectedDate(label)}
                />
              ) : isProjectOrTimeOff ? (
                <Checkbox
                  checked={selectedDates[label] || false}
                  onChange={(e) =>
                    setSelectedDates((prev) => ({
                      ...prev,
                      [label]: e.target.checked,
                    }))
                  }
                />
              ) : null}
              <Typography variant="body2">{label}</Typography>
            </Box>
          );
        })}
      </Box>

      {/* Buttons */}
      <Stack direction="row" spacing={2} sx={{ marginTop: 4, flexWrap: "wrap" }}>
        {(showOptions.support && showOptions.project
          ? bothButtons
          : showOptions.support
          ? supportButtons
          : showOptions.project
          ? projectButtons
          : []
        ).map((btn) => (
          <Button
            key={btn}
            variant={selectedButton === btn ? "contained" : "outlined"}
            onClick={() => handleButtonClick(btn)}
          >
            {btn}
          </Button>
        ))}
      </Stack>

      {/* Cards Row */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          marginTop: 4,
          overflowX: "auto",
        }}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            sx={{
              width: 500,
              position: "relative",
              flexShrink: 0,
            }}
          >
            <CardContent>
              <Typography variant="h6">{card.name}</Typography>
              {card.component}
            </CardContent>
            <IconButton
              sx={{ position: "absolute", top: 8, right: 8 }}
              onClick={() => handleCardDelete(card.id)}
            >
              <CloseIcon />
            </IconButton>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
