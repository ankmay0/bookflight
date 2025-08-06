import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Paper, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ManageReservation: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [departing, setDeparting] = useState<string>('');
  const [arriving, setArriving] = useState<string>('');
  const [travelDate, setTravelDate] = useState<string>('');

  const handleSearch = () => {
    console.log({
      searchText,
      departing,
      arriving,
      travelDate,
    });
    // Add navigation logic or API call here
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(to bottom right, #f0f7ff, #e0e0ff)',
        padding: 3,
      }}
    >
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Check Flight Status
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" maxWidth="600px" mb={4}>
        With our flight tracker, you can now track the live status of domestic and international flights.
        Enter details like PNR number, flight number, travel date and get the status.
      </Typography>

      <Paper elevation={3} sx={{ padding: 4, borderRadius: 4, width: '100%', maxWidth: 600 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by flight number or by PNR"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Departing"
              value={departing}
              onChange={(e) => setDeparting(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Arriving"
              value={arriving}
              onChange={(e) => setArriving(e.target.value)}
            />
          </Grid>

          <Grid item xs={8}>
            <TextField
              fullWidth
              type="date"
              variant="outlined"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleSearch}
              sx={{ height: '100%' }}
            >
              Search Flight
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ManageReservation;
