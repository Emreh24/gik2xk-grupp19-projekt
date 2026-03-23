// Importerar React och olika hooks
import React, { useState, useEffect, useRef } from "react";

// Importerar routing från react-router-dom
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

// Importerar komponenter från Material UI
import {
  AppBar, Toolbar, Typography, Button, IconButton,
  Badge, Container, Box, createTheme, ThemeProvider,
  CssBaseline, Chip,
} from "@mui/material";

// Importerar ikoner
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";

// Importerar egna views
import ProductList from "./views/ProductList";
import ProductDetail from "./views/ProductDetail";
import ProductForm from "./views/ProductForm";
import CartView from "./views/CartView";
import WelcomeScreen from "./views/WelcomeScreen";

// Importerar API-funktion för att hämta varukorg
import { getCart } from "./services/api";

// Lista med videor som används i bakgrunden
const VIDEOS = [
  "https://www.youtube.com/embed/pGT2HGue-Hc?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3",
  "https://www.youtube.com/embed/u5rWBgBjDsc?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3",
  "https://www.youtube.com/embed/nq1M_Wc4FIc?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3",
  "https://www.youtube.com/embed/hfJ4Km46A-0?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3",
];

// Skapar ett mörkt tema till appen
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#7c4dff" },
    secondary: { main: "#00e676" },
    background: { default: "#121212", paper: "#1e1e2e" },
  },
  typography: { fontFamily: "'Segoe UI', sans-serif" },
});

// Tillfällig användare
export const CURRENT_USER_ID = 1;

// Komponent för video i bakgrunden
function VideoBackground() {
  const iframeRef = useRef(null);
  const indexRef = useRef(Math.floor(Math.random() * VIDEOS.length));

  useEffect(() => {
    const el = iframeRef.current;

    // Startar med en slumpad video
    if (el) el.src = VIDEOS[indexRef.current];

    // Byter video varje minut
    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % VIDEOS.length;
      if (iframeRef.current) {
        iframeRef.current.src = VIDEOS[indexRef.current];
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Box sx={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "110vw", height: "110vh",
        zIndex: 0, pointerEvents: "none",
      }}>
        <iframe
          ref={iframeRef}
          style={{ width: "100%", height: "100%", border: "none" }}
          allow="autoplay; encrypted-media"
          title="bg-video"
        />
      </Box>

      {/* Mörk overlay ovanpå videon */}
      <Box sx={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        bgcolor: "rgba(0,0,0,0.75)",
        zIndex: 1, pointerEvents: "none",
      }} />
    </>
  );
}

// Navigationsmeny
function Navbar({ cartCount, role, onLogout }) {
  return (
    <AppBar position="sticky" sx={{ bgcolor: "rgba(30,30,46,0.85)", backdropFilter: "blur(10px)", borderBottom: "1px solid #333" }}>
      <Toolbar>
        <SportsEsportsIcon sx={{ color: "primary.main", mr: 1 }} />

        {/* Logga / titel */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "secondary.main", fontWeight: "bold" }}
        >
          Game19
        </Typography>

        {/* Visar om användaren är admin eller kund */}
        <Chip
          icon={role === "admin" ? <AdminPanelSettingsIcon /> : <PersonIcon />}
          label={role === "admin" ? "Admin" : "Kund"}
          color={role === "admin" ? "primary" : "default"}
          sx={{ mr: 2 }}
        />

        <Button color="inherit" component={Link} to="/">Spel</Button>

        {/* Admin kan lägga till spel */}
        {role === "admin" && (
          <Button color="secondary" component={Link} to="/products/new" variant="outlined" sx={{ mx: 1 }}>
            + Lägg till spel
          </Button>
        )}

        {/* Kund ser varukorgen */}
        {role === "kund" && (
          <IconButton color="inherit" component={Link} to="/cart">
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        )}

        <Button color="error" onClick={onLogout} sx={{ ml: 1 }}>
          Byt roll
        </Button>
      </Toolbar>
    </AppBar>
  );
}

// Huvudkomponenten för appen
export default function App() {
  const [role, setRole] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Hämtar antal produkter i varukorgen
  const refreshCartCount = () => {
    getCart(CURRENT_USER_ID)
      .then((res) => {
        const total = res.data.items.reduce((sum, item) => sum + item.amount, 0);
        setCartCount(total);
      })
      .catch(() => setCartCount(0));
  };

  // Uppdaterar varukorgen när rollen ändras
  useEffect(() => {
    if (role === "kund") refreshCartCount();
    if (role !== "kund") setCartCount(0);
  }, [role]);

  // Loggar ut / nollställer rollen
  const handleLogout = () => {
    setRole(null);
    setCartCount(0);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Video visas alltid i bakgrunden */}
      <VideoBackground />

      {!role ? (
        // Welcome screen visas innan man valt roll
        <Box position="relative" zIndex={2}>
          <WelcomeScreen onSelectRole={setRole} />
        </Box>
      ) : (
        // Resten av appen visas efter att en roll valts
        <BrowserRouter>
          <Box position="relative" zIndex={2}>
            <Navbar cartCount={cartCount} role={role} onLogout={handleLogout} />

            <Container maxWidth="xl" sx={{ py: 4 }}>
              <Routes>
                <Route path="/" element={<ProductList role={role} />} />

                <Route
                  path="/products/new"
                  element={role === "admin" ? <ProductForm /> : <Navigate to="/" />}
                />

                <Route
                  path="/products/:id/edit"
                  element={role === "admin" ? <ProductForm /> : <Navigate to="/" />}
                />

                <Route
                  path="/products/:id"
                  element={<ProductDetail role={role} onAddToCart={refreshCartCount} />}
                />

                <Route
                  path="/cart"
                  element={role === "kund" ? <CartView onCartUpdate={refreshCartCount} /> : <Navigate to="/" />}
                />
              </Routes>
            </Container>
          </Box>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
}