import React from 'react';
import { Typography } from '@mui/material';

const Header = ({ title, subtitle }) => {
  return (
    <>
      <Typography variant="h5">{title}</Typography>
      <Typography variant="h6" sx={{ marginBottom: "16px" }}>
        {subtitle}
      </Typography>
    </>
  );
};

export default Header;
