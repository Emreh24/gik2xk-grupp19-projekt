// src/views/ProductForm.jsx - Admin formulär med rabatt min 1% max 100%
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box, Typography, TextField, Button, Alert,
  CircularProgress, Paper, Snackbar, MenuItem,
  Select, InputLabel, FormControl, OutlinedInput, Chip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createProduct, getProduct, updateProduct } from "../services/api";

const ALL_PLATFORMS = [
  "PC", "PlayStation 4", "PlayStation 5",
  "Xbox Series X", "Xbox One", "Nintendo Switch"
];

const ALL_GENRES = [
  "Action", "Äventyr", "RPG", "Sport", "Racing", "Strategi",
  "Skräck", "Pussel", "Fighting", "Simulation", "Shooter",
  "Battle Royale", "Multiplayer", "Öppen värld", "Plattform",
  "Musik", "Dans", "Familj"
];

const emptyForm = {
  title: "", description: "", price: "",
  discountPercent: 0, imageUrl: "", genres: [], platforms: [],
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    if (!isEditing) return;
    getProduct(id)
      .then((res) => {
        const p = res.data;
        const genres = Array.isArray(p.genres) ? p.genres :
          (p.genre ? [p.genre] : []);
        setForm({
          title: p.title || "",
          description: p.description || "",
          price: p.originalPrice || "",
          discountPercent: p.discountPercent || 0,
          imageUrl: p.imageUrl || "",
          genres,
          platforms: p.platforms || [],
        });
      })
      .catch(() => setError("Kunde inte hämta produkten."))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.description) {
      setError("Titel, beskrivning och pris är obligatoriska.");
      return;
    }
    if (parseFloat(form.price) < 0) {
      setError("Priset kan inte vara negativt.");
      return;
    }
    if (form.discountPercent !== 0 && (form.discountPercent < 1 || form.discountPercent > 100)) {
      setError("Rabatten måste vara 0 (ingen rabatt) eller mellan 1-100%.");
      return;
    }
    if (form.genres.length === 0) {
      setError("Välj minst en genre.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        discountPercent: form.discountPercent,
        genre: form.genres[0],
        genres: JSON.stringify(form.genres),
        platforms: form.platforms,
      };
      if (isEditing) {
        await updateProduct(id, data);
        setSnackbar({ open: true, message: "Spelet har uppdaterats! ✅" });
        setTimeout(() => navigate(`/products/${id}`), 1500);
      } else {
        const res = await createProduct(data);
        setSnackbar({ open: true, message: "Spelet har lagts till! 🎮" });
        setTimeout(() => navigate(`/products/${res.data.id}`), 1500);
      }
    } catch {
      setError("Något gick fel vid sparning.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress color="secondary" /></Box>;

  return (
    <Box maxWidth={700} mx="auto">
      <Button startIcon={<ArrowBackIcon />} component={Link} to="/" sx={{ mb: 2 }}>Tillbaka</Button>
      <Paper sx={{ p: 4, bgcolor: "background.paper" }}>
        <Typography variant="h5" fontWeight="bold" mb={3} color="secondary.main">
          {isEditing ? "✏️ Redigera spel" : "🎮 Lägg till nytt spel"}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box display="flex" flexDirection="column" gap={2}>

          <TextField label="Speltitel *" name="title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} fullWidth />

          <TextField label="Beskrivning *" name="description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            fullWidth multiline rows={4} />

          {/* Pris - tomt fält, minsta 0 */}
          <TextField
            label="Pris (kr) *"
            type="number"
            value={form.price === 0 ? "" : form.price}
            placeholder="0"
            onChange={(e) => {
              if (e.target.value === "") {
                setForm({ ...form, price: 0 });
                return;
              }
              const val = Math.max(0, parseFloat(e.target.value) || 0);
              setForm({ ...form, price: val });
            }}
            fullWidth
            inputProps={{ min: 0 }}
            helperText="Minsta pris är 0 kr"
          />

          {/* Rabatt - 0 = ingen, 1-100 = rabatt */}
          <TextField
            label="Rabatt (%)"
            type="number"
            value={form.discountPercent === 0 ? "" : form.discountPercent}
            placeholder="0"
            onChange={(e) => {
              if (e.target.value === "") {
                setForm({ ...form, discountPercent: 0 });
                return;
              }
              const num = parseInt(e.target.value) || 0;
              const val = num === 0 ? 0 : Math.min(100, Math.max(1, num));
              setForm({ ...form, discountPercent: val });
            }}
            fullWidth
            inputProps={{ min: 0, max: 100 }}
            helperText={
              form.discountPercent > 0 && form.price
                ? `Rabatterat pris: ${Math.round(form.price * (1 - form.discountPercent / 100))} kr`
                : "Lämna tomt eller 0 = ingen rabatt | 1–100% = rabatt"
            }
          />

          <TextField label="Bild-URL" value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            fullWidth placeholder="https://..." />

          {/* Genrer */}
          <FormControl fullWidth>
            <InputLabel>Genrer * (välj en eller flera)</InputLabel>
            <Select
              multiple value={form.genres}
              onChange={(e) => setForm({ ...form, genres: e.target.value })}
              input={<OutlinedInput label="Genrer * (välj en eller flera)" />}
              renderValue={(selected) => (
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {selected.map((g) => <Chip key={g} label={g} size="small" color="secondary" />)}
                </Box>
              )}
            >
              {ALL_GENRES.map((g) => (
                <MenuItem key={g} value={g}>
                  {form.genres.includes(g) ? <strong>{g} ✓</strong> : g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Plattformar */}
          <FormControl fullWidth>
            <InputLabel>Plattformar (välj en eller flera)</InputLabel>
            <Select
              multiple value={form.platforms}
              onChange={(e) => setForm({ ...form, platforms: e.target.value })}
              input={<OutlinedInput label="Plattformar (välj en eller flera)" />}
              renderValue={(selected) => (
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {selected.map((p) => <Chip key={p} label={p} size="small" color="primary" />)}
                </Box>
              )}
            >
              {ALL_PLATFORMS.map((p) => (
                <MenuItem key={p} value={p}>
                  {form.platforms.includes(p) ? <strong>{p} ✓</strong> : p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" color="secondary" size="large"
            startIcon={<SaveIcon />} onClick={handleSubmit} disabled={saving}>
            {saving ? "Sparar..." : (isEditing ? "Spara ändringar" : "Skapa spel")}
          </Button>
        </Box>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}