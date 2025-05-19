import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TextField } from "@mui/material";
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default EstimationTable;
