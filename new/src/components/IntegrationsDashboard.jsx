// src/pages/IntegrationsDashboard.jsx
import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Stack,
  InputAdornment,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AppsIcon from '@mui/icons-material/Apps';
import ListIcon from '@mui/icons-material/List';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckIcon from '@mui/icons-material/Check';

// ─── Theme ────────────────────────────────────────────────────────────────────
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#000000', paper: '#0d0d0d' },
    text: { primary: '#ffffff', secondary: '#666666' },
    primary: { main: '#ffffff' },
    divider: '#1a1a1a',
  },
  typography: {
    fontFamily: "'Courier New', Courier, monospace",
    h4: { fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, letterSpacing: '-0.5px' },
    h5: { fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 700 },
    h6: { fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: '0.92rem' },
    body2: { fontSize: '0.78rem', lineHeight: 1.7 },
    caption: { fontSize: '0.65rem', letterSpacing: '0.1em' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#0a0a0a',
          border: '1px solid #1a1a1a',
          borderRadius: '10px',
          transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            borderColor: '#3a3a3a',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 24px rgba(255,255,255,0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': { borderColor: '#1f1f1f' },
            '&:hover fieldset': { borderColor: '#333' },
            '&.Mui-focused fieldset': { borderColor: '#555', borderWidth: '1px' },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1f1f1f' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#555', borderWidth: '1px' },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: '#0d0d0d',
          border: '1px solid #222',
          borderRadius: '8px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '7px',
          textTransform: 'none',
          fontSize: '0.8rem',
          fontFamily: "'Courier New', monospace",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          fontFamily: "'Courier New', monospace",
          fontSize: '0.62rem',
          letterSpacing: '0.07em',
          height: '22px',
        },
      },
    },
  },
});

// ─── Data ─────────────────────────────────────────────────────────────────────
const integrationsData = [
  {
    id: 'shopify',
    name: 'Shopify',
    category: 'E-commerce',
    info: 'Sync products, orders, and inventory with your Shopify storefront.',
    link: 'https://shopify.com',
    logoUrl: 'https://logo.clearbit.com/shopify.com',
    comingSoon: false,
  },
  {
    id: 'amazon',
    name: 'Amazon',
    category: 'Marketplace',
    info: 'Manage Amazon Seller Central listings and FBA inventory.',
    link: 'https://developer.amazon.com',
    logoUrl: 'https://logo.clearbit.com/amazon.com',
    comingSoon: false,
  },
  {
    id: 'walmart',
    name: 'Walmart',
    category: 'Marketplace',
    info: 'Connect your Walmart marketplace seller account.',
    link: 'https://developer.walmart.com',
    logoUrl: 'https://logo.clearbit.com/walmart.com',
    comingSoon: false,
  },
  {
    id: 'shipbob',
    name: 'ShipBob',
    category: 'Fulfillment',
    info: 'Global omnifulfillment — automate shipping across all channels.',
    link: 'https://shipbob.com',
    logoUrl: 'https://logo.clearbit.com/shipbob.com',
    comingSoon: false,
  },
  {
    id: 'xero',
    name: 'Xero',
    category: 'Accounting',
    info: 'Push invoices, bills, and reconciliations into your Xero books.',
    link: 'https://xero.com',
    logoUrl: 'https://logo.clearbit.com/xero.com',
    comingSoon: false,
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    category: 'Accounting',
    info: 'Automatically sync transactions and reports with QuickBooks Online.',
    link: 'https://quickbooks.intuit.com',
    logoUrl: 'https://logo.clearbit.com/intuit.com',
    comingSoon: false,
  },
  {
    id: 'cin7',
    name: 'Cin7',
    category: 'Inventory',
    info: 'Connected inventory platform linking warehouses, POS, and 3PLs.',
    link: 'https://cin7.com',
    logoUrl: 'https://logo.clearbit.com/cin7.com',
    comingSoon: false,
  },
  {
    id: 'googlesheets',
    name: 'Google Sheets',
    category: 'Productivity',
    info: 'Import and export tabular data directly to Google Sheets.',
    link: 'https://sheets.google.com',
    logoUrl: 'https://logo.clearbit.com/google.com',
    comingSoon: false,
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    category: 'E-commerce',
    info: 'Sync store data from your self-hosted WooCommerce site.',
    link: 'https://woocommerce.com',
    logoUrl: 'https://logo.clearbit.com/woocommerce.com',
    comingSoon: true,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'Payments',
    info: 'Pull payment events, disputes, and revenue data from Stripe.',
    link: 'https://stripe.com',
    logoUrl: 'https://logo.clearbit.com/stripe.com',
    comingSoon: true,
  },
  {
    id: 'manual',
    name: 'Manual Upload',
    category: 'Custom',
    info: 'Upload CSV, Excel, or JSON files for one-time or batch imports.',
    link: '#',
    isManual: true,
    comingSoon: false,
  },
];

const CATEGORIES = [
  'All', 'E-commerce', 'Marketplace', 'Accounting',
  'Fulfillment', 'Inventory', 'Productivity', 'Payments', 'Custom',
];

// ─── Logo Box ─────────────────────────────────────────────────────────────────
function LogoBox({ item }) {
  const [errored, setErrored] = useState(false);

  if (item.isManual) {
    return (
      <Box sx={{
        width: 40, height: 40, borderRadius: '8px',
        background: '#1a1a1a', border: '1px solid #2a2a2a',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <UploadFileIcon sx={{ fontSize: 20, color: '#fff' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      width: 40, height: 40, borderRadius: '8px', background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, overflow: 'hidden', p: '5px',
    }}>
      {!errored ? (
        <img
          src={item.logoUrl}
          alt={item.name}
          onError={() => setErrored(true)}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <Typography sx={{ fontWeight: 900, color: '#000', fontSize: '0.7rem' }}>
          {item.name.slice(0, 2).toUpperCase()}
        </Typography>
      )}
    </Box>
  );
}

// ─── Integration Card ─────────────────────────────────────────────────────────
function IntegrationCard({ item, onManualClick }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', opacity: item.comingSoon ? 0.55 : 1 }}>
      <CardContent sx={{ flexGrow: 1, p: '18px !important' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <LogoBox item={item} />
          <Stack direction="row" spacing={0.5}>
            <Chip
              label={item.category.toUpperCase()}
              sx={{ background: '#111', color: '#555', border: '1px solid #222' }}
            />
            {item.comingSoon && (
              <Chip
                label="SOON"
                sx={{ background: '#0f0f00', color: '#666633', border: '1px solid #2a2a00' }}
              />
            )}
          </Stack>
        </Stack>

        <Typography variant="h6" sx={{ color: '#fff', mb: 0.75 }}>
          {item.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {item.info}
        </Typography>

        {!item.isManual && !item.comingSoon && (
          <Box
            component="a"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: '3px',
              color: '#444', fontSize: '0.68rem', fontFamily: "'Courier New', monospace",
              letterSpacing: '0.06em', textDecoration: 'none',
              transition: 'color 0.15s',
              '&:hover': { color: '#fff' },
            }}
          >
            DOCS <OpenInNewIcon sx={{ fontSize: 11 }} />
          </Box>
        )}
      </CardContent>

      <Divider sx={{ borderColor: '#141414' }} />

      <CardActions sx={{ p: '12px 18px' }}>
        <Button
          fullWidth
          variant="outlined"
          disabled={item.comingSoon}
          onClick={() => item.isManual && onManualClick()}
          sx={{
            color: '#fff',
            borderColor: '#252525',
            py: '6px',
            '&:hover:not(:disabled)': { background: '#fff', color: '#000', borderColor: '#fff' },
            '&.Mui-disabled': { color: '#2a2a2a', borderColor: '#161616' },
          }}
        >
          {item.comingSoon ? 'Coming Soon' : item.isManual ? 'Upload Files' : 'Connect'}
        </Button>
      </CardActions>
    </Card>
  );
}

// ─── Manual Upload View ───────────────────────────────────────────────────────
function ManualUploadView({ onBack }) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);

  const addFiles = (newFiles) => setFiles((prev) => [...prev, ...Array.from(newFiles)]);

  return (
    <Box sx={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{
            color: '#444', mb: 5,
            '&:hover': { color: '#fff', background: 'transparent' },
          }}
        >
          Back to Integrations
        </Button>

        <Typography variant="h4" sx={{ mb: 1 }}>Manual Upload</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 6 }}>
          CSV, XLSX, JSON supported · Max 50 MB · Batch imports allowed
        </Typography>

        {/* Drop zone */}
        <Box
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
          sx={{
            border: `1.5px dashed ${dragging ? '#555' : '#1f1f1f'}`,
            borderRadius: '14px',
            background: dragging ? '#080808' : 'transparent',
            p: '64px 32px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            mb: 3,
            '&:hover': { borderColor: '#333', background: '#050505' },
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 44, color: '#2a2a2a', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>Drag & drop files here</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            or click to browse from your computer
          </Typography>
          <Button
            variant="outlined"
            component="label"
            sx={{
              color: '#fff', borderColor: '#252525', px: 4,
              '&:hover': { background: '#fff', color: '#000', borderColor: '#fff' },
            }}
          >
            Browse Files
            <input type="file" hidden multiple onChange={(e) => addFiles(e.target.files)} />
          </Button>
        </Box>

        {/* File list */}
        {files.length > 0 && (
          <Box sx={{ border: '1px solid #1a1a1a', borderRadius: '10px', overflow: 'hidden', mb: 3 }}>
            {files.map((f, i) => (
              <Stack
                key={i}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  px: 3, py: 1.75,
                  borderBottom: i < files.length - 1 ? '1px solid #111' : 'none',
                  background: '#080808',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CheckIcon sx={{ fontSize: 14, color: '#444' }} />
                  <Typography variant="body2" sx={{ color: '#bbb' }}>{f.name}</Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {(f.size / 1024).toFixed(1)} KB
                </Typography>
              </Stack>
            ))}
            <Box sx={{ p: 2, background: '#060606', borderTop: '1px solid #111' }}>
              <Button
                fullWidth
                sx={{
                  color: '#fff', border: '1px solid #222', background: '#0d0d0d',
                  '&:hover': { background: '#fff', color: '#000' },
                }}
              >
                Upload {files.length} file{files.length > 1 ? 's' : ''}
              </Button>
            </Box>
          </Box>
        )}

        {/* Format chips */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['CSV', 'XLSX', 'XLS', 'JSON'].map((fmt) => (
            <Chip
              key={fmt}
              label={fmt}
              sx={{ background: '#0d0d0d', color: '#444', border: '1px solid #1a1a1a' }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function IntegrationsDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentView, setCurrentView] = useState('dashboard');
  const [viewMode, setViewMode] = useState('grid');

  const filtered = integrationsData.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  if (currentView === 'manualUpload') {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ManualUploadView onBack={() => setCurrentView('dashboard')} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', background: '#000' }}>
        <Container maxWidth="xl" sx={{ py: 7 }}>

          {/* Header */}
          <Box mb={6}>
            <Typography
              variant="caption"
              sx={{ color: '#333', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', mb: 1.5 }}
            >
              Workspace · Integrations
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
              <Typography variant="h4">Connect your stack</Typography>
              <Typography variant="caption" sx={{ color: '#333', letterSpacing: '0.1em' }}>
                {integrationsData.filter((i) => !i.comingSoon).length} AVAILABLE
              </Typography>
            </Stack>
            <Divider sx={{ mt: 3, borderColor: '#111' }} />
          </Box>

          {/* Search + filter row */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" mb={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#333', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: 170, flexShrink: 0 }}>
              <InputLabel sx={{ color: '#444', fontSize: '0.8rem' }}>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat} sx={{ fontSize: '0.8rem' }}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* View toggle */}
            <Stack
              direction="row"
              sx={{ border: '1px solid #1a1a1a', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}
            >
              <IconButton
                size="small"
                onClick={() => setViewMode('grid')}
                sx={{
                  borderRadius: 0, px: 1.25,
                  color: viewMode === 'grid' ? '#fff' : '#333',
                  background: viewMode === 'grid' ? '#141414' : 'transparent',
                }}
              >
                <AppsIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setViewMode('list')}
                sx={{
                  borderRadius: 0, px: 1.25,
                  color: viewMode === 'list' ? '#fff' : '#333',
                  background: viewMode === 'list' ? '#141414' : 'transparent',
                }}
              >
                <ListIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>
          </Stack>

          {/* Category pills */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 5 }}>
            {CATEGORIES.map((cat) => {
              const active = categoryFilter === cat;
              return (
                <Chip
                  key={cat}
                  label={cat.toUpperCase()}
                  onClick={() => setCategoryFilter(cat)}
                  sx={{
                    cursor: 'pointer',
                    background: active ? '#fff' : '#0a0a0a',
                    color: active ? '#000' : '#444',
                    border: `1px solid ${active ? '#fff' : '#1a1a1a'}`,
                    transition: 'all 0.15s',
                    '&:hover': { background: active ? '#e8e8e8' : '#141414', color: active ? '#000' : '#aaa' },
                  }}
                />
              );
            })}
          </Box>

          {/* Grid / List */}
          {filtered.length > 0 ? (
            <Grid container spacing={viewMode === 'grid' ? 2 : 1.5}>
              {filtered.map((item) =>
                viewMode === 'list' ? (
                  <Grid item xs={12} key={item.id}>
                    <Box
                      sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        px: 3, py: 2, border: '1px solid #141414', borderRadius: '9px',
                        background: '#080808', transition: 'border-color 0.15s',
                        '&:hover': { borderColor: '#2a2a2a' },
                      }}
                    >
                      <Stack direction="row" spacing={2.5} alignItems="center" sx={{ flexGrow: 1, minWidth: 0 }}>
                        <LogoBox item={item} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="h6" sx={{ color: '#fff' }}>{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>{item.info}</Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ flexShrink: 0, ml: 3 }}>
                        <Chip
                          label={item.category.toUpperCase()}
                          sx={{ background: '#0d0d0d', color: '#444', border: '1px solid #1a1a1a', display: { xs: 'none', md: 'flex' } }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          disabled={item.comingSoon}
                          onClick={() => item.isManual && setCurrentView('manualUpload')}
                          sx={{
                            color: '#fff', borderColor: '#222', minWidth: 105,
                            '&:hover:not(:disabled)': { background: '#fff', color: '#000', borderColor: '#fff' },
                            '&.Mui-disabled': { color: '#2a2a2a', borderColor: '#141414' },
                          }}
                        >
                          {item.comingSoon ? 'Coming Soon' : item.isManual ? 'Upload' : 'Connect'}
                        </Button>
                      </Stack>
                    </Box>
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                    <IntegrationCard item={item} onManualClick={() => setCurrentView('manualUpload')} />
                  </Grid>
                )
              )}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 14 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>No results for</Typography>
              <Typography variant="h5" sx={{ color: '#222' }}>"{searchTerm}"</Typography>
            </Box>
          )}

          {/* Footer */}
          <Box mt={8} textAlign="center">
            <Typography variant="caption" sx={{ color: '#222', letterSpacing: '0.1em' }}>
              {filtered.length} OF {integrationsData.length} INTEGRATIONS
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}