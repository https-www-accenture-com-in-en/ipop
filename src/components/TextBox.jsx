import { TextField } from "@mui/material";

const TextBox = ({
  inputValue,
  setInputValue,
  InputLabel,
  InputInnerLabel,
}) => {
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
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
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
