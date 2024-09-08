import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '../sidebar/Sidebar';
import Footer from './components/Footer';
import ExpenseDialog from './components/ExpenseDialog';
import ExpenseFilters from './components/ExpenseFilters';
import ExpenseTable from './components/ExpenseTable';
import useExpenses from '../../api/useExpenses'; // Import hook

const Home = () => {
  const { expenses, error, handleDeleteExpense, handleUpdateExpense } = useExpenses();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [updatedExpense, setUpdatedExpense] = useState({
    id: '',
    category: '',
    amount: '',
    date: '',
  });

  const [searchCategory, setSearchCategory] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const handleOpenUpdateDialog = (expense) => {
    setSelectedExpense(expense);
    setUpdatedExpense(expense);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setSelectedExpense(null);
  };

  const handleUpdateClick = () => {
    handleUpdateExpense(updatedExpense);
    handleCloseUpdateDialog();
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory = expense.category.toLowerCase().includes(searchCategory.toLowerCase());
    const matchesDate = expense.date.includes(searchDate);
    return matchesCategory && matchesDate;
  });

  const homeMenuItems = [
    { label: 'View Expenses', path: '/home' },
    { label: 'Log Expense', path: '/home/log-expense' },
    { label: 'View Budget', path: '/home/view-budget' },
  ];

  return (
    <Box
      sx={{
        background: 'black',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Sidebar menuItems={homeMenuItems} />
      <Box
        className="dashboard"
        sx={{
          flexGrow: 1,
          padding: '20px',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          Expense List
        </Typography>
        {error && <Typography color="error">{error}</Typography>}

        <ExpenseFilters
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
          searchDate={searchDate}
          setSearchDate={setSearchDate}
        />

        <ExpenseTable
          expenses={filteredExpenses}
          handleDeleteExpense={handleDeleteExpense}
          handleOpenUpdateDialog={handleOpenUpdateDialog}
        />

        <ExpenseDialog
          open={openUpdateDialog}
          handleClose={handleCloseUpdateDialog}
          updatedExpense={updatedExpense}
          setUpdatedExpense={setUpdatedExpense}
          handleUpdateClick={handleUpdateClick}
        />
      </Box>
      <Footer />
    </Box>
  );
};

export default Home;
