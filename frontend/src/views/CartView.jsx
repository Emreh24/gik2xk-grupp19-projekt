// src/views/CartView.jsx - Varukorg med rabattkod GIK2XK (-10%)
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box, Typography, CircularProgress, Alert, Paper,
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, Divider, Chip, IconButton, TextField, InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { getCart, updateCartItem, removeCartItem } from "../services/api";
import { CURRENT_USER_ID } from "../App";

const DISCOUNT_CODE = "GIK2XK";
const DISCOUNT_PERCENT = 10;

export default function CartView({ onCartUpdate }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const [appliedCode, setAppliedCode] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [codeSuccess, setCodeSuccess] = useState("");

  const fetchCart = () => {
    setLoading(true);
    getCart(CURRENT_USER_ID)
      .then((res) => setCart(res.data))
      .catch(() => setError("Kunde inte hämta varukorgen."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCart(); }, []);

  const handleUpdateAmount = async (cartRowId, newAmount) => {
    try {
      await updateCartItem(cartRowId, newAmount);
      fetchCart();
      onCartUpdate();
    } catch {
      setError("Kunde inte uppdatera antal.");
    }
  };

  const handleRemove = async (cartRowId) => {
    try {
      await removeCartItem(cartRowId);
      fetchCart();
      onCartUpdate();
    } catch {
      setError("Kunde inte ta bort produkten.");
    }
  };

  const handleApplyCode = () => {
    if (codeInput.trim().toUpperCase() === DISCOUNT_CODE) {
      setAppliedCode(true);
      setCodeError("");
      setCodeSuccess(`✅ Rabattkod "${DISCOUNT_CODE}" tillagd! Du får ${DISCOUNT_PERCENT}% rabatt!`);
    } else {
      setCodeError("❌ Ogiltig rabattkod. Försök igen!");
      setCodeSuccess("");
    }
  };

  const handleRemoveCode = () => {
    setAppliedCode(false);
    setCodeInput("");
    setCodeError("");
    setCodeSuccess("");
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" mt={8}>
      <CircularProgress color="secondary" />
    </Box>
  );

  if (error) return <Alert severity="error">{error}</Alert>;

  if (!cart || cart.items.length === 0) return (
    <Box textAlign="center" mt={8}>
      <ShoppingCartIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Din varukorg är tom
      </Typography>
      <Button component={Link} to="/" variant="contained" color="primary">
        Hitta spel att köpa
      </Button>
    </Box>
  );

  // Beräkna totaler
  const subtotal = cart.total;
  const codeDiscount = appliedCode ? Math.round(subtotal * DISCOUNT_PERCENT / 100) : 0;
  const finalTotal = subtotal - codeDiscount;

  return (
    <Box maxWidth={900} mx="auto">
      <Typography variant="h4" fontWeight="bold" mb={3} color="secondary.main">
        🛒 Din Varukorg
      </Typography>

      <Paper sx={{ bgcolor: "rgba(30,30,46,0.85)", backdropFilter: "blur(10px)", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.dark" }}>
              <TableCell><Typography fontWeight="bold">Spel</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight="bold">Antal</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight="bold">Pris/st</Typography></TableCell>
              <TableCell align="right"><Typography fontWeight="bold">Summa</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight="bold">Ta bort</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.items.map((item) => (
              <TableRow key={item.cartRowId} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box component="img"
                      src={item.imageUrl || `https://picsum.photos/seed/${item.productId}/60/60`}
                      alt={item.title}
                      sx={{ width: 60, height: 60, objectFit: "cover", borderRadius: 1 }}
                    />
                    <Box>
                      <Typography component={Link} to={`/products/${item.productId}`}
                        sx={{ color: "secondary.main", textDecoration: "none", fontWeight: "bold" }}>
                        {item.title}
                      </Typography>
                      {item.discountPercent > 0 && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="caption" color="text.secondary"
                            sx={{ textDecoration: "line-through" }}>
                            {item.originalPrice} kr
                          </Typography>
                          <Chip label={`-${item.discountPercent}%`} color="error" size="small" />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </TableCell>

                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <Button size="small" variant="outlined"
                      onClick={() => handleUpdateAmount(item.cartRowId, item.amount - 1)}
                      sx={{ minWidth: 30, p: 0 }}>-</Button>
                    <Typography>{item.amount}</Typography>
                    <Button size="small" variant="outlined"
                      onClick={() => handleUpdateAmount(item.cartRowId, item.amount + 1)}
                      sx={{ minWidth: 30, p: 0 }}>+</Button>
                  </Box>
                </TableCell>

                <TableCell align="right">
                  <Typography>{item.discountedPrice} kr</Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography fontWeight="bold" color="secondary.main">
                    {item.subtotal.toFixed(2)} kr
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <IconButton color="error" onClick={() => handleRemove(item.cartRowId)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider />

        {/* Rabattkod */}
        <Box sx={{ p: 3, borderBottom: "1px solid #333" }}>
          <Typography variant="h6" mb={2} display="flex" alignItems="center" gap={1}>
            <LocalOfferIcon color="secondary" /> Rabattkod
          </Typography>

          {!appliedCode ? (
            <Box display="flex" gap={2} alignItems="flex-start">
              <TextField
                label="Ange rabattkod"
                value={codeInput}
                onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setCodeError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleApplyCode()}
                size="small"
                error={!!codeError}
                helperText={codeError}
                sx={{ minWidth: 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOfferIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant="contained" color="secondary" onClick={handleApplyCode}>
                Lägg till
              </Button>
            </Box>
          ) : (
            <Box display="flex" alignItems="center" gap={2}>
              <Chip
                label={`${DISCOUNT_CODE} (-${DISCOUNT_PERCENT}%)`}
                color="success"
                onDelete={handleRemoveCode}
              />
              <Typography variant="body2" color="success.main">{codeSuccess}</Typography>
            </Box>
          )}
        </Box>

        {/* Totalsummering */}
        <Box sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="text.secondary">Delsumma:</Typography>
            <Typography>{subtotal.toFixed(2)} kr</Typography>
          </Box>

          {appliedCode && (
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="success.main">
                Rabattkod ({DISCOUNT_CODE} -{DISCOUNT_PERCENT}%):
              </Typography>
              <Typography color="success.main" fontWeight="bold">
                -{codeDiscount.toFixed(2)} kr
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold">Totalt:</Typography>
            <Typography variant="h4" color="secondary.main" fontWeight="bold">
              {finalTotal.toFixed(2)} kr
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Button component={Link} to="/" sx={{ mt: 2 }}>← Fortsätt handla</Button>
    </Box>
  );
}