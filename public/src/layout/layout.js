import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  Button,
} from "@mui/material";
import { Menu as MenuIcon, Home, ContactMail } from "@mui/icons-material";
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import { NavLink, Outlet } from "react-router-dom";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const drawerWidth = 240;

const HeaderSidebarLayout = () => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: "Clock-view", icon: <HistoryToggleOffIcon />, path: "/clock-view" },
    { text: "Admin", icon: <SupervisorAccountIcon />, path: "/admin"},
    // { text: "About", path: "/about" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            IPOP
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" href="/logout">
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
       variant="permanent" // Instead of "persistent"
       sx={{
         width: open ? drawerWidth : 60,
         flexShrink: 0,
         whiteSpace: "nowrap",
         boxSizing: "border-box",
         "& .MuiDrawer-paper": {
           width: open ? drawerWidth : 60,
           backgroundColor: "#444e76",
           color: "#fff",
           transition: "width 0.3s",
         },
       }}
      >
        <Toolbar />
        <List>
          {menuItems.map(({ text, icon, path }) => (
            <ListItem  button
            key={text}
            component={NavLink}
            to={path}
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#556cd6" : "transparent", // Change color when active
              color: "#fff",
              borderRadius: "8px",
              marginBottom: "8px",
              justifyContent: open ? "initial" : "center", // Center icons when closed
              paddingLeft: open ? "16px" : "12px", // Adjust padding
              paddingRight: open ? "16px" : "12px",
            })}>
            <ListItemIcon sx={{ color: "#fff", minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center" }}>
        {icon}
      </ListItemIcon>
      {open && 
      <ListItemText primary={text} />}
          </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "margin 0.3s",
          marginLeft: open ? `${drawerWidth}px` : 0,
        }}
      >
        <Toolbar />
        {/* This will render the page here */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default HeaderSidebarLayout;
