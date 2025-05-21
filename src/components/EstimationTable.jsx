import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { Button, Tab, TextField } from "@mui/material";

import { useState } from "react";
import CustomButton from "./CustomButton";

const EstimationTable = ({ rows, setRows }) => {
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

  const handleDeleteRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleAddNewRow = () => {
    const newRow = {
      projectTask: "Enter Project Task",
      distribution: 0,
      estimatedEffort: 0,
      burntEffort: 0,
    };
    setRows([...rows, newRow]);
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
                    placeholder="Enter Project Task"
                    type="text"
                    value={row.projectTask}
                    onChange={(e) =>
                      handleProjectTaskChange(index, e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    placeholder="% Distribution"
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
                <TableCell>
                  <CustomButton
                    handleClick={() => handleDeleteRow(index)}
                    innerContent="Delete"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomButton handleClick={handleAddNewRow} innerContent="Add New Row" />
      <CustomButton handleClick={validate} innerContent="Save" />
    </div>
  );
};

export default EstimationTable;
