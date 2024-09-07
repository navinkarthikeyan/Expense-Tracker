import React from 'react';
import { Typography } from '@mui/material';

const ExpenseSummary = ({ expenses }) => {
  const totalAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

  return (
    <Typography
      variant="h6"
      sx={{
        marginTop: '20px',
        marginBottom: '20px',
        textAlign: 'center',
        color: 'white',
      }}
    >
      Total Amount: ${totalAmount.toFixed(2)}
    </Typography>
  );
};

export default ExpenseSummary;
