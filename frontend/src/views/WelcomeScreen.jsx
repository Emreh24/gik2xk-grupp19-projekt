// Importerar React och useState
import React, { useState } from "react";

// Importerar komponenter från Material UI
import { Box, Typography, Button, TextField, Alert } from "@mui/material";

// Importerar ikoner
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";

// CSS för flip-kortet
const flipStyle = `
  .flip-container {
    perspective: 1000px;
    width: 300px;
    height: 400px;
  }
  .flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }
  .flip-inner.flipped {
    transform: rotateY(180deg);
  }
  .flip-front, .flip-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 32px;
    box-sizing: border-box;
    text-align: center;
  }
  .flip-front {
    background: rgba(0,0,0,0.6);
    border: 1px solid rgba(0,230,118,0.4);
    backdrop-filter: blur(20px);
  }
  .flip-back {
    background: rgba(0,0,0,0.6);
    border: 1px solid rgba(124,77,255,0.4);
    backdrop-filter: blur(20px);
    transform: rotateY(180deg);
  }
`;

export default function WelcomeScreen({ onSelectRole }) {
  // State för att vända kortet
  const [flipped, setFlipped] = useState(false);

  // State för lösenordet
  const [password, setPassword] = useState("");

  // State för felmeddelande vid fel lösenord
  const [passwordError, setPasswordError] = useState(false);

  // Kollar om admin-lösenordet är rätt
  const handleAdminLogin = () => {
    if (password === "admin123") {
      onSelectRole("admin");
    } else {
      setPasswordError(true);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ position: "relative" }}
    >
      {/* Lägger in CSS för flip-effekten */}
      <style>{flipStyle}</style>

      <Box position="relative" zIndex={1} display="flex" flexDirection="column" alignItems="center">
        {/* Logga */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <SportsEsportsIcon sx={{ fontSize: 60, color: "#7c4dff" }} />
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{ color: "#fff", textShadow: "0 0 20px #7c4dff, 0 0 60px #7c4dff44", letterSpacing: 3 }}
          >
            Game19
          </Typography>
        </Box>

        {/* Kort text under loggan */}
        <Typography
          variant="h6"
          mb={4}
          sx={{ color: "rgba(255,255,255,0.6)", letterSpacing: 2 }}
        >
          Din ultimata gaming-butik 🎮
        </Typography>

        {/* Flip-kortet */}
        <div className="flip-container">
          <div className={`flip-inner ${flipped ? "flipped" : ""}`}>

            {/* Framsida - kund */}
            <div className="flip-front">
              <Box>
                <PersonIcon sx={{ fontSize: 70, color: "#00e676", mb: 1 }} />
                <Typography variant="h5" fontWeight="bold" color="white" gutterBottom>
                  Kund
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.6)" mb={2}>
                  Bläddra bland spel, lägg till i varukorgen och betygsätt spel.
                </Typography>
              </Box>

              <Box width="100%" display="flex" flexDirection="column" gap={1}>
                {/* Går vidare som kund */}
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  size="large"
                  onClick={() => onSelectRole("kund")}
                >
                  Fortsätt som kund
                </Button>

                {/* Vänder kortet till adminsidan */}
                <Button
                  variant="text"
                  fullWidth
                  startIcon={<FlipCameraAndroidIcon />}
                  onClick={() => {
                    setFlipped(true);
                    setPasswordError(false);
                    setPassword("");
                  }}
                  sx={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}
                >
                  Är du admin?
                </Button>
              </Box>
            </div>

            {/* Baksida - admin */}
            <div className="flip-back">
              <Box width="100%">
                <AdminPanelSettingsIcon sx={{ fontSize: 70, color: "#7c4dff", mb: 1 }} />
                <Typography variant="h5" fontWeight="bold" color="white" gutterBottom>
                  Admin
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.6)" mb={2}>
                  Ange lösenord för att komma in som admin.
                </Typography>

                {/* Fält för admin-lösenord */}
                <TextField
                  label="Lösenord"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                  error={passwordError}
                  size="small"
                  sx={{
                    mb: 1,
                    "& .MuiOutlinedInput-root": { color: "white" },
                    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(124,77,255,0.5)" },
                  }}
                />

                {/* Visas om lösenordet är fel */}
                {passwordError && (
                  <Alert severity="error" sx={{ mb: 1, py: 0 }}>
                    Fel lösenord!
                  </Alert>
                )}
              </Box>

              <Box width="100%" display="flex" flexDirection="column" gap={1}>
                {/* Loggar in som admin */}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleAdminLogin}
                >
                  Logga in som admin
                </Button>

                {/* Vänder tillbaka till kundsidan */}
                <Button
                  variant="text"
                  fullWidth
                  startIcon={<FlipCameraAndroidIcon />}
                  onClick={() => {
                    setFlipped(false);
                    setPasswordError(false);
                    setPassword("");
                  }}
                  sx={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}
                >
                  Tillbaka till kund
                </Button>
              </Box>
            </div>

          </div>
        </div>
      </Box>
    </Box>
  );
}