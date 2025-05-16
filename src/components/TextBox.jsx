import { TextField } from "@mui/material";

const TextBox = ({ InputLabel, InputInnerLabel }) => {
  return (
    <div>
      <label
        style={{ fontWeight: "bold", display: "block", marginTop: "20px" }}
      >
        {InputLabel}
      </label>
      <TextField
        label={InputInnerLabel}
        variant="outlined"
        size="small"
        fullWidth
        style={{
          fontWeight: "bold",
          display: "block",
          marginTop: "20px",
        }}
      />
    </div>
  );
};

export default TextBox;
