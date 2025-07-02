import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

const navItems = [
  "Search Flight",
  "Hotel Search",
  "Car Rental",
  "Packages",
  "Support",
];

const Navbar: React.FC = () => {
  const [selected, setSelected] = React.useState<string>("Search Flight");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isMobile = useMediaQuery("(max-width:1000px)");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <Typography
        variant="h6"
        sx={{
          my: 2,
          textAlign: "center",
          fontWeight: "bold",
          color: "#1976d2",
        }}
      >
        BookFlight
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton onClick={() => setSelected(item)}>
              <ListItemText
                primary={item}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: selected === item ? 600 : 400,
                      color: selected === item ? "black" : "gray",
                    },
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Stack spacing={1} sx={{ p: 2 }}>
        <Button
          variant="text"
          sx={{
            color: "black",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          Sign In
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 500,
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#115293",
            },
          }}
        >
          Sign Up
        </Button>
      </Stack>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          px: 3,
        }}
      >
        <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left: Logo and Title */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton edge="start" color="inherit" sx={{ mr: 1 }}>
              <FlightTakeoffIcon sx={{ color: "#1976d2", fontSize: 30 }} />
            </IconButton>
            <Typography
              variant="h5"
              sx={{
                color: "black",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              BookFlight
            </Typography>
          </Box>

          {/* Center / Mobile toggle */}
          {isMobile ? (
            <IconButton onClick={handleDrawerToggle} color="inherit">
              <MenuIcon sx={{ color: "#1976d2", fontSize: 28 }} />
            </IconButton>
          ) : (
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
              <Stack direction="row" spacing={4}>
                {navItems.map((item) => (
                  <Button
                    key={item}
                    onClick={() => setSelected(item)}
                    disableRipple
                    sx={{
                      color: selected === item ? "black" : "gray",
                      fontWeight: selected === item ? 600 : 400,
                      textTransform: "none",
                      fontSize: "16px",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        display: "block",
                        width: selected === item ? "100%" : "0",
                        height: "2px",
                        background: "#1976d2",
                        transition: "width 0.3s",
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                      },
                      "&:hover": {
                        color: "black",
                        "&::after": {
                          width: "100%",
                        },
                      },
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}

          {/* Right: Sign In & Sign Up Buttons (hidden in mobile) */}
          {!isMobile && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="text"
                sx={{
                  color: "black",
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: 500,
                  borderRadius: "8px",
                  px: 2.5,
                  "&:hover": {
                    backgroundColor: "#115293",
                  },
                }}
              >
                Sign Up
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
