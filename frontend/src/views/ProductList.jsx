// Importerar React och hooks
import React, { useEffect, useState } from "react";

// Importerar Link för navigation
import { Link } from "react-router-dom";

// Importerar komponenter från Material UI
import {
  Grid, Card, CardContent, CardMedia, CardActions,
  Typography, Button, Rating, Chip, CircularProgress,
  Box, Alert, TextField, MenuItem, InputAdornment,
} from "@mui/material";

// Importerar sökikon
import SearchIcon from "@mui/icons-material/Search";

// Importerar funktion för att hämta produkter från API
import { getProducts } from "../services/api";

// CSS-effekt för korten när man hovrar
const glowStyle = `
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 10px #7c4dff, 0 0 20px #7c4dff, 0 0 40px #7c4dff44; }
    50% { box-shadow: 0 0 20px #00e676, 0 0 40px #00e676, 0 0 80px #00e67644; }
  }
  .game-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  }
  .game-card:hover {
    transform: translateY(-8px) scale(1.02) !important;
    animation: glowPulse 1.5s ease-in-out infinite !important;
  }
  .game-card:hover .card-title {
    color: #00e676 !important;
    text-shadow: 0 0 10px #00e676;
    transition: all 0.3s ease;
  }
`;

// Lista med alla genrer
const ALL_GENRES = [
  "Alla", "Action", "Äventyr", "RPG", "Sport", "Racing", "Strategi",
  "Skräck", "Pussel", "Fighting", "Simulation", "Shooter",
  "Battle Royale", "Multiplayer", "Öppen värld", "Plattform",
  "Musik", "Dans", "Familj"
];

// Lista med alla plattformar
const ALL_PLATFORMS = [
  "Alla", "PC", "PlayStation 4", "PlayStation 5",
  "Xbox Series X", "Xbox One", "Nintendo Switch"
];

// Alternativ för sortering
const SORT_OPTIONS = [
  { value: "default", label: "Standard" },
  { value: "name_asc", label: "Namn (A-Ö)" },
  { value: "name_desc", label: "Namn (Ö-A)" },
  { value: "price_asc", label: "Pris (Lägst först)" },
  { value: "price_desc", label: "Pris (Högst först)" },
  { value: "rating_desc", label: "Betyg (Högst först)" },
  { value: "rating_asc", label: "Betyg (Lägst först)" },
];

export default function ProductList({ role }) {
  // State för produkter, laddning, fel och filter
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Alla");
  const [selectedPlatform, setSelectedPlatform] = useState("Alla");
  const [sortBy, setSortBy] = useState("default");

  // Hämtar alla produkter när sidan laddas
  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setError("Kunde inte hämta spel. Är backenden igång?"))
      .finally(() => setLoading(false));
  }, []);

  // Filtrerar och sorterar produkterna
  const filteredProducts = products
    .filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchGenre = selectedGenre === "Alla" || p.genre === selectedGenre ||
        (p.genres || []).includes(selectedGenre);
      const matchPlatform = selectedPlatform === "Alla" ||
        (p.platforms || []).includes(selectedPlatform);

      return matchSearch && matchGenre && matchPlatform;
    })
    .sort((a, b) => {
      if (sortBy === "name_asc") return a.title.localeCompare(b.title);
      if (sortBy === "name_desc") return b.title.localeCompare(a.title);
      if (sortBy === "price_asc") return a.discountedPrice - b.discountedPrice;
      if (sortBy === "price_desc") return b.discountedPrice - a.discountedPrice;
      if (sortBy === "rating_desc") return b.avgRating - a.avgRating;
      if (sortBy === "rating_asc") return a.avgRating - b.avgRating;
      return 0;
    });

  // Återställer alla filter
  const clearFilters = () => {
    setSearch("");
    setSelectedGenre("Alla");
    setSelectedPlatform("Alla");
    setSortBy("default");
  };

  // Visar laddningsikon medan data hämtas
  if (loading) return (
    <Box display="flex" justifyContent="center" mt={8}>
      <CircularProgress color="secondary" />
    </Box>
  );

  // Visar felmeddelande om något gått fel
  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

  return (
    <Box>
      <style>{glowStyle}</style>

      <Typography variant="h4" fontWeight="bold" mb={3} color="secondary.main">
        🎮 Alla Spel
      </Typography>

      {/* Filter och sökfält */}
      <Box display="flex" gap={2} mb={4} flexWrap="wrap" alignItems="center">
        <TextField
          placeholder="Sök spel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          label="Genre"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          size="small"
          sx={{ minWidth: 160 }}
        >
          {ALL_GENRES.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
        </TextField>

        <TextField
          select
          label="Plattform"
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        >
          {ALL_PLATFORMS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
        </TextField>

        <TextField
          select
          label="Sortera"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          size="small"
          sx={{ minWidth: 190 }}
        >
          {SORT_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
        </TextField>

        <Typography variant="body2" color="text.secondary">
          {filteredProducts.length} spel
        </Typography>

        {(search || selectedGenre !== "Alla" || selectedPlatform !== "Alla" || sortBy !== "default") && (
          <Button onClick={clearFilters} size="small" color="error" variant="outlined">
            Rensa filter
          </Button>
        )}
      </Box>

      {/* Visas om inga spel matchar */}
      {filteredProducts.length === 0 && (
        <Box textAlign="center" mt={8}>
          <Typography variant="h5" color="text.secondary">
            Inga spel matchade din sökning.
          </Typography>
          <Button onClick={clearFilters} variant="outlined" color="secondary" sx={{ mt: 2 }}>
            Rensa filter
          </Button>
        </Box>
      )}

      {/* Visar alla spel som kort */}
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card
              className="game-card"
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "rgba(30,30,46,0.85)",
                backdropFilter: "blur(10px)",
                border: "1px solid #333",
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={product.imageUrl || `https://picsum.photos/seed/${product.id}/400/180`}
                alt={product.title}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                {/* Plattformar */}
                <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
                  {(product.platforms || []).map((p) => (
                    <Chip
                      key={p}
                      label={p}
                      size="small"
                      color="primary"
                      onClick={() => setSelectedPlatform(p)}
                      sx={{ cursor: "pointer" }}
                    />
                  ))}
                </Box>

                <Typography
                  className="card-title"
                  variant="h6"
                  fontWeight="bold"
                  sx={{ transition: "all 0.3s" }}
                >
                  {product.title}
                </Typography>

                {/* Genrer */}
                <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5} mb={0.5}>
                  {(product.genres && product.genres.length > 0
                    ? product.genres
                    : product.genre ? [product.genre] : []
                  ).map((g) => (
                    <Chip
                      key={g}
                      label={g}
                      size="small"
                      variant="outlined"
                      onClick={() => setSelectedGenre(g)}
                      sx={{ cursor: "pointer" }}
                    />
                  ))}
                </Box>

                {/* Betyg */}
                <Box display="flex" alignItems="center" gap={1} my={1}>
                  <Rating value={product.avgRating} precision={0.5} readOnly size="small" />
                  <Typography variant="caption">({product.ratings.length} betyg)</Typography>
                </Box>

                {/* Pris och eventuell rabatt */}
                {product.discountPercent > 0 ? (
                  <Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through" }}
                      >
                        {product.originalPrice} kr
                      </Typography>
                      <Chip label={`-${product.discountPercent}%`} color="error" size="small" />
                    </Box>

                    <Typography variant="h6" color="secondary.main" fontWeight="bold">
                      {product.discountedPrice} kr
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="h6" color="secondary.main" fontWeight="bold">
                    {product.originalPrice} kr
                  </Typography>
                )}
              </CardContent>

              <CardActions>
                <Button
                  component={Link}
                  to={`/products/${product.id}`}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Visa spel
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}