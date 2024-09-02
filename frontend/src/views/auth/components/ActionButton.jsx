import { Button } from "@mui/material";

const ActionButton = ({ children, sx, ...rest }) => {
  return (
    <Button variant="contained" {...rest} sx={{ borderRadius: "15px", ...sx }}>
      {children}
    </Button>
  );
};

export default ActionButton;
