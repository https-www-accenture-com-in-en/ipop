import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { TextField } from "@mui/material";

import { Button, Tab, TextField } from "@mui/material";

import { useState } from "react";

const EstimationTable = ({ initialRows }) => {
  const [rows, setRows] = useState(initialRows);

  const handleProjectTaskChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].projectTask = value;
    setRows(updatedRows);
    console.log(rows);
  };
  const handleDistributionChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].distribution = value;
    setRows(updatedRows);
    console.log(rows);
  };


  const validate = () => {
    const totalDistribution = rows.reduce(
      (acc, row) => acc + parseFloat(row.distribution || 0),
      0
    );
    if (totalDistribution !== 100) {
      alert("Total distribution must be 100%");
    }
  };


  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "purple" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Project Task</TableCell>
              <TableCell sx={{ color: "white" }}>% Distribution</TableCell>
              <TableCell sx={{ color: "white" }}>Estimated Effort</TableCell>
              <TableCell sx={{ color: "white" }}>Burnt Effort</TableCell>

              <TableCell sx={{ color: "white" }}>Delete</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    variant="standard"
                    fullWidth
                    value={row.projectTask}
                    onChange={(e) =>
                      handleProjectTaskChange(index, e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="standard"
                    fullWidth
                    type="number"
                    value={row.distribution}
                    onChange={(e) =>
                      handleDistributionChange(index, e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>{row.estimatedEffort}</TableCell>
                <TableCell>{row.burntEffort}</TableCell>
                <TableCell>🗑️</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        onClick={validate}
        variant="contained"
        sx={{
          mt: 2,
          px: 2,
          py: 1,
          fontSize: "14px",
          fontWeight: "bold",
          borderRadius: "6px",
          backgroundColor: "#eb7476",
          color: "white",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#f38b8d",
          },
        }}
      >
        Save
      </Button>
    </div>
  );
};

export default EstimationTable;
