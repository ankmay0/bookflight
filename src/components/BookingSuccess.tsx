import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Divider,
  Button,
  Chip,
  Container,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";

const BookingSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const confettiRef = useRef<HTMLDivElement>(null);
  const data = (location.state as any) ?? {};

  useEffect(() => {
    if (!data.orderId) {
      navigate("/");
      return;
    }

    // Custom confetti animation
    const confettiColors = ["#2c39e8", "#1f2ac4", "#10b981", "#e0f2f1", "#2563eb", "#fbbf24"];
    const confettiContainer = confettiRef.current;
    if (!confettiContainer) return;

    for (let i = 0; i < 40; i++) {
      const conf = document.createElement("div");
      conf.style.position = "absolute";
      conf.style.left = Math.random() * 100 + "vw";
      conf.style.width = "12px";
      conf.style.height = "12px";
      conf.style.background = confettiColors[i % confettiColors.length];
      conf.style.opacity = "0.88";
      conf.style.borderRadius = "2px";
      conf.style.top = "-40px";
      conf.style.transform = `rotate(${Math.random() * 50 - 25}deg)`;
      conf.style.animation = `fallConfetti 1.6s ${(Math.random() * 1.1).toFixed(2)}s cubic-bezier(.62,.63,0,1) forwards`;
      confettiContainer.appendChild(conf);
    }

    return () => {
      if (confettiContainer) confettiContainer.innerHTML = "";
    };
  }, [data.orderId, navigate]);

  if (!data.orderId) return null;

  const traveler = data.travelers[0];
  const flightOffer = data.flightOffer;
  const trip = flightOffer.trips[0];

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "rgba(0, 0, 0, 0.4)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        {/* Confetti Layer */}
        <Box
          ref={confettiRef}
          sx={{
            pointerEvents: "none",
            position: "fixed",
            inset: 0,
            zIndex: 50,
          }}
        />

        {/* Modal Content */}
        <Paper
          sx={{
            position: "relative",
            zIndex: 60,
            borderRadius: 4,
            p: 4,
            maxWidth: 600,
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            textAlign: "center",
            animation: "fadeInPop 0.5s cubic-bezier(.23,1.09,.59,.89) forwards",
          }}
        >
          {/* Animated Checkmark */}
          <Box sx={{ mb: 3 }}>
            <Box
              component="svg"
              width="90"
              height="90"
              viewBox="0 0 90 90"
              fill="none"
              sx={{
                mx: "auto",
                animation: "checkPop .58s cubic-bezier(.23,1.09,.59,.89) .11s both",
              }}
            >
              <circle cx="45" cy="45" r="45" fill="#10b981" opacity="0.18" />
              <circle
                cx="45"
                cy="45"
                r="38"
                stroke="#10b981"
                strokeWidth="4"
                fill="white"
              />
              <path
                d="M28 49L41 62L62 35"
                stroke="#10b981"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <animate
                  attributeName="stroke-dasharray"
                  from="0,40"
                  to="40,0"
                  dur="0.6s"
                  fill="freeze"
                />
              </path>
            </Box>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#10b981",
              mb: 1,
              animation: "titlePopIn .8s cubic-bezier(.23,1.09,.59,.89) .15s forwards",
              opacity: 0,
            }}
          >
            Flight Booked! ✈️
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your flight has been successfully booked. 🎉
          </Typography>

          {/* Order ID */}
          <Paper
            sx={{
              bgcolor: "#f5f7fa",
              border: "1px solid #e0f2f1",
              borderRadius: 2,
              p: 2,
              mb: 3,
              animation: "fadeInPop 0.5s cubic-bezier(.23,1.09,.59,.89) 0.3s forwards",
              opacity: 0,
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block">
              Your Booking Reference
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#2c39e8",
                letterSpacing: 1,
                wordBreak: "break-all",
              }}
            >
              {decodeURIComponent(data.orderId)}
            </Typography>
          </Paper>

          {/* Flight Details */}
          <Stack spacing={2} textAlign="left">
            {/* Traveler Info */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Passenger Details
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Name:</strong> {traveler.firstName} {traveler.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>DOB:</strong> {traveler.dateOfBirth}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Gender:</strong> {traveler.gender}
                  </Typography>
                </Grid>
                {traveler.phones[0] && (
                  <Grid item xs={12}>
                    <Typography>
                      <PhoneIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                      +{traveler.phones[0].countryCallingCode} {traveler.phones[0].number}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Flight Info */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                <FlightTakeoffIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Flight Information
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {trip.from} → {trip.to} • {trip.stops === 0 ? "Direct" : `${trip.stops} Stop${trip.stops > 1 ? "s" : ""}`}
              </Typography>

              <Stack spacing={1}>
                {trip.legs.map((leg: any, idx: number) => (
                  <Box key={idx}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={3}>
                        <Chip
                          label={`${leg.operatingCarrierCode} ${leg.flightNumber}`}
                          size="small"
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2">
                          <FlightTakeoffIcon sx={{ fontSize: 14, mr: 0.5 }} />
                          {new Date(leg.departureDateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} {leg.departureAirport}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2">
                          <FlightLandIcon sx={{ fontSize: 14, mr: 0.5 }} />
                          {new Date(leg.arrivalDateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} {leg.arrivalAirport}
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Typography variant="caption">{leg.duration}</Typography>
                      </Grid>
                    </Grid>
                    {leg.layoverAfter && (
                      <Typography variant="caption" color="text.secondary">
                        Layover: {leg.layoverAfter}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Price */}
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#e0f2f1",
                border: "1px solid #b2dfdb",
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={600}>
                  Total Paid
                </Typography>
                <Typography variant="h5" fontWeight={700} color="#10b981">
                  ₹{flightOffer.totalPrice}
                </Typography>
              </Stack>
            </Paper>
          </Stack>

          {/* Actions */}
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              sx={{ borderRadius: 2 }}
            >
              Book Another Flight
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* CSS Animations */}
      <style>
        {`
        @keyframes fallConfetti {
          to {
            top: 105vh;
            opacity: 0.05;
            transform: rotate(180deg);
          }
        }
        @keyframes fadeInPop {
          0% { opacity: 0; transform: scale(0.7);}
          100% { opacity: 1; transform: scale(1);}
        }
        @keyframes titlePopIn {
          from {opacity:0; transform: scale(0.85);}
          to {opacity:1; transform: scale(1);}
        }
        @keyframes checkPop {
          0% { opacity: 0; transform: scale(0.2);}
          70% { opacity: 1; transform: scale(1.12);}
          100% { opacity: 1; transform: scale(1);}
        }
        `}
      </style>
    </>
  );
};

export default BookingSuccess;
