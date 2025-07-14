import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface CancellationPolicyProps {
  flight: any;
  currencySymbol?: string;
}

const CancellationPolicy: React.FC<CancellationPolicyProps> = ({
  flight,
  currencySymbol = "₹",
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const departureDateTime = flight.trips[0].legs[0].departureDateTime;
  const departureDate = new Date(departureDateTime);
  const cutOffDate = new Date(departureDate);
  cutOffDate.setDate(cutOffDate.getDate() - 1);

  const lowPenalty = 1015;
  const highPenalty = 23624;

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    }) +
    " " +
    date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  return (
    <>
      <Paper sx={{ p: 3, mb: 3, width: "100%", ml: 3 }} elevation={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Cancellation & Date Change Policy
          </Typography>
          <Link component="button" underline="hover" color="primary" onClick={handleOpen}>
            View Policy
          </Link>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Airline & Route */}
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <img src={flight.trips[0].airlineLogo} alt="Airline" style={{ height: 16 }} />
          <Typography variant="body2" fontWeight="bold">
            {flight.trips[0].from} - {flight.trips[flight.trips.length - 1].to}
          </Typography>
        </Stack>

        {/* Penalty Range */}
        <Box mt={2} position="relative">
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1" fontWeight="bold">
              {currencySymbol} {lowPenalty.toLocaleString()}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {currencySymbol} {highPenalty.toLocaleString()}
            </Typography>
          </Stack>

          <Box
            sx={{
              height: 8,
              borderRadius: 5,
              background: "linear-gradient(to right, #2e7d32, #ffa000, #c62828)",
              my: 1,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              {formatDate(cutOffDate)}
            </Typography>
            <Box
              sx={{
                width: 1,
                height: 20,
                backgroundColor: "#ccc",
                margin: "2px auto 0 auto",
              }}
            />
          </Box>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" mt={2}>
          <AccessTimeIcon fontSize="small" color="warning" />
          <Typography variant="body2" fontWeight="bold">
            The timings mentioned above are in Indian Standard Time (IST)
          </Typography>
        </Stack>
      </Paper>

      {/* MODAL */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Fare rules
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" fontWeight="bold" mb={2}>
            {flight.trips[0].from} - {flight.trips[flight.trips.length - 1].to}
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Time frame</strong>
                  <br />
                  (From Scheduled flight departure)
                </TableCell>
                <TableCell>
                  <strong>Airline Fee + MMT Fee + Fare difference</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>0 hours to 24 hours</TableCell>
                <TableCell>Non Changeable</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>24 hours to 365 days</TableCell>
                <TableCell>
                  {currencySymbol} 8,909 + {currencySymbol} 700 + Fare difference
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Box mt={2}>
            <Typography variant="caption" color="text.secondary">
              *From the Time of Departure
            </Typography>
          </Box>

          <Box mt={2} p={1} bgcolor="#fff8e1" borderRadius={1}>
            <Typography variant="body2" color="text.secondary">
              <strong>Important:</strong> The airline fee is indicative. We does not
              guarantee accuracy of this information. All fees mentioned are per passenger.
              Date change charges apply only when selecting the same airline on a new date.
              Fare differences between old and new bookings will be payable by the user.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CancellationPolicy;
