// src/views/ProductDetail.jsx - Detaljvy med rabatt och rollbaserad åtkomst
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box, Typography, Button, Rating, Chip, CircularProgress,
  Alert, Snackbar, Divider, Paper, Grid, TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { getProduct, addRating, deleteProduct, addToCart } from "../services/api";
import { CURRENT_USER_ID } from "../App";

export default function ProductDetail({ onAddToCart, role }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [amount, setAmount] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    getProduct(id)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Kunde inte hämta spelet."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRating = async (newValue) => {
    if (!newValue) return;
    try {
      await addRating(id, newValue);
      setUserRating(newValue);
      const res = await getProduct(id);
      setProduct(res.data);
      setSnackbar({ open: true, message: "Tack för ditt betyg! ⭐", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Kunde inte spara betyg.", severity: "error" });
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(CURRENT_USER_ID, id, amount);
      onAddToCart();
      setSnackbar({ open: true, message: `${product.title} lades till i varukorgen! 🛒`, severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Kunde inte lägga till i varukorg.", severity: "error" });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Är du säker på att du vill ta bort "${product.title}"?`)) return;
    try {
      await deleteProduct(id);
      setSnackbar({ open: true, message: "Spelet har tagits bort.", severity: "success" });
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setSnackbar({ open: true, message: "Kunde inte ta bort spelet.", severity: "error" });
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress color="secondary" /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!product) return null;

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} component={Link} to="/" sx={{ mb: 2 }}>
        Tillbaka
      </Button>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Box component="img"
            src={product.imageUrl || `https://picsum.photos/seed/${product.id}/600/400`}
            alt={product.title}
            sx={{ width: "100%", borderRadius: 2, boxShadow: 4 }}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
            {(product.platforms || []).map((p) => (
              <Chip key={p} label={p} color="primary" />
            ))}
            {product.genre && <Chip label={product.genre} variant="outlined" />}
          </Box>

          <Typography variant="h4" fontWeight="bold" gutterBottom>{product.title}</Typography>

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Rating value={product.avgRating} precision={0.5} readOnly />
            <Typography>({product.ratings.length} betyg)</Typography>
          </Box>

          {/* Prisvisning med rabatt */}
          {product.discountPercent > 0 ? (
            <Box mb={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h6" color="text.secondary"
                  sx={{ textDecoration: "line-through" }}>
                  {product.originalPrice} kr
                </Typography>
                <Chip label={`-${product.discountPercent}%`} color="error" />
              </Box>
              <Typography variant="h4" color="secondary.main" fontWeight="bold">
                {product.discountedPrice} kr
              </Typography>
              <Typography variant="body2" color="success.main">
                Du sparar {product.originalPrice - product.discountedPrice} kr!
              </Typography>
            </Box>
          ) : (
            <Typography variant="h4" color="secondary.main" fontWeight="bold" mb={2}>
              {product.originalPrice} kr
            </Typography>
          )}

          <Typography variant="body1" color="text.secondary" mb={3}>
            {product.description}
          </Typography>

          {/* Lägg i varukorg - BARA för kunder */}
          {role === "kund" && (
            <Box display="flex" gap={2} alignItems="center" mb={3}>
              <TextField
                label="Antal" type="number" value={amount}
                onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1 }} size="small" sx={{ width: 80 }}
              />
              <Button variant="contained" color="secondary" size="large"
                startIcon={<AddShoppingCartIcon />} onClick={handleAddToCart}>
                Lägg i varukorg
              </Button>
            </Box>
          )}

          <Divider sx={{ mb: 3 }} />

          {/* Betygsätt - BARA för kunder */}
          {role === "kund" && (
            <Paper sx={{ p: 2, bgcolor: "background.paper", mb: 3 }}>
              <Typography variant="h6" gutterBottom>Betygsätt detta spel</Typography>
              <Rating value={userRating} onChange={(e, val) => handleRating(val)} size="large" />
            </Paper>
          )}

          {/* Alla betyg */}
          {product.ratings.length > 0 && (
            <Paper sx={{ p: 2, bgcolor: "background.paper", mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Alla betyg ({product.ratings.length} st)
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {product.ratings.map((r) => (
                  <Chip key={r.id} label={`⭐ ${r.rating}`} variant="outlined" color="primary" />
                ))}
              </Box>
            </Paper>
          )}

          {/* Redigera/Ta bort - BARA för admin */}
          {role === "admin" && (
            <Box display="flex" gap={2}>
              <Button variant="outlined" color="primary" startIcon={<EditIcon />}
                component={Link} to={`/products/${id}/edit`}>
                Redigera
              </Button>
              <Button variant="outlined" color="error" startIcon={<DeleteIcon />}
                onClick={handleDelete}>
                Ta bort
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}