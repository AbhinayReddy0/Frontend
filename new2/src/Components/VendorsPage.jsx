import { useState } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputBase,
  Button,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarIcon from "@mui/icons-material/Star";

import theme from "../Theme";
import { vendors } from "../data/vendors";
import VendorDialog from "./VendorDialog";

const metricColor = (value, type) => {
  if (type === "onTime") {
    return value >= 90
      ? "#22c55e"
      : value >= 70
      ? "#f59e0b"
      : "#ef4444";
  }

  if (type === "accuracy") {
    return value >= 95
      ? "#22c55e"
      : value >= 85
      ? "#f59e0b"
      : "#ef4444";
  }

  return "#ffffff";
};

export default function VendorsPage() {
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [search, setSearch] = useState("");

  const [categoryAnchor, setCategoryAnchor] = useState(null);

  const [performanceAnchor, setPerformanceAnchor] =
    useState(null);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [selectedPerformance, setSelectedPerformance] =
    useState("All");

  // Dynamic categories from vendors data
  const categories = [
    "All",
    ...new Set(vendors.map((vendor) => vendor.sub)),
  ];

  // Filter logic
  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      vendor.sub
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      vendor.sub === selectedCategory;

    const matchesPerformance =
      selectedPerformance === "All" ||
      (selectedPerformance === "High" &&
        vendor.onTime >= 90) ||
      (selectedPerformance === "Medium" &&
        vendor.onTime >= 70 &&
        vendor.onTime < 90) ||
      (selectedPerformance === "Low" &&
        vendor.onTime < 70);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPerformance
    );
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          backgroundColor: "#000",
          color: "#fff",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            pt: 3,
            pb: 2,
            borderBottom: "1px solid #111",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              Vendors
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                color: "#666",
                mt: 0.5,
              }}
            >
              {vendors.length} active vendors
            </Typography>
          </Box>

          <Button
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#0d2a18",
              border: "1px solid #166534",
              color: "#22c55e",
              borderRadius: 2,
              textTransform: "none",
              fontSize: 12,
              px: 2,
              py: 0.8,

              "&:hover": {
                backgroundColor: "#103520",
              },
            }}
          >
            Add Vendor
          </Button>
        </Box>

        {/* Search + Filters */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderBottom: "1px solid #111",
          }}
        >
          {/* Search */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "#050505",
              border: "1px solid #1a1a1a",
              borderRadius: 2,
              px: 1.5,
              py: 0.7,

              "&:focus-within": {
                border: "1px solid #333",
              },
            }}
          >
            <SearchIcon
              sx={{
                fontSize: 15,
                color: "#555",
              }}
            />

            <InputBase
              placeholder="Search vendors..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              sx={{
                color: "#ddd",
                fontSize: 13,
                width: 240,
              }}
            />
          </Box>

          {/* Category Filter */}
          <Button
            endIcon={<KeyboardArrowDownIcon />}
            onClick={(e) =>
              setCategoryAnchor(e.currentTarget)
            }
            sx={{
              backgroundColor: "#0a0a0a",
              border: "1px solid #1a1a1a",
              color: "#888",
              borderRadius: 2,
              textTransform: "none",
              fontSize: 11,
              px: 1.5,
              py: 0.7,

              "&:hover": {
                backgroundColor: "#111",
                color: "#fff",
              },
            }}
          >
            Category: {selectedCategory}
          </Button>

          <Menu
            anchorEl={categoryAnchor}
            open={Boolean(categoryAnchor)}
            onClose={() =>
              setCategoryAnchor(null)
            }
            PaperProps={{
              sx: {
                background: "#0a0a0a",
                border: "1px solid #1a1a1a",
                color: "#fff",
              },
            }}
          >
            {categories.map((category) => (
              <MenuItem
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCategoryAnchor(null);
                }}
              >
                {category}
              </MenuItem>
            ))}
          </Menu>

          {/* Performance Filter */}
          <Button
            endIcon={<KeyboardArrowDownIcon />}
            onClick={(e) =>
              setPerformanceAnchor(
                e.currentTarget
              )
            }
            sx={{
              backgroundColor: "#0a0a0a",
              border: "1px solid #1a1a1a",
              color: "#888",
              borderRadius: 2,
              textTransform: "none",
              fontSize: 11,
              px: 1.5,
              py: 0.7,

              "&:hover": {
                backgroundColor: "#111",
                color: "#fff",
              },
            }}
          >
            Performance: {selectedPerformance}
          </Button>

          <Menu
            anchorEl={performanceAnchor}
            open={Boolean(performanceAnchor)}
            onClose={() =>
              setPerformanceAnchor(null)
            }
            PaperProps={{
              sx: {
                background: "#0a0a0a",
                border: "1px solid #1a1a1a",
                color: "#fff",
              },
            }}
          >
            {[
              "All",
              "High",
              "Medium",
              "Low",
            ].map((performance) => (
              <MenuItem
                key={performance}
                onClick={() => {
                  setSelectedPerformance(
                    performance
                  );

                  setPerformanceAnchor(null);
                }}
              >
                {performance}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Vendors Table */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    background:
                      "#000 !important",
                  }}
                />

                <TableCell
                  sx={{
                    background:
                      "#000 !important",
                  }}
                >
                  Vendor
                </TableCell>

                <TableCell
                  sx={{
                    background:
                      "#000 !important",
                  }}
                >
                  Category
                </TableCell>

                <TableCell
                  sx={{
                    background:
                      "#000 !important",
                  }}
                >
                  On-Time
                </TableCell>

                <TableCell
                  sx={{
                    background:
                      "#000 !important",
                  }}
                >
                  Accuracy
                </TableCell>

                <TableCell
                  sx={{
                    background:
                      "#000 !important",
                  }}
                >
                  Rank
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow
                  key={vendor.id}
                  onClick={() =>
                    setSelectedVendor(vendor)
                  }
                  sx={{
                    cursor: "pointer",

                    "&:hover": {
                      backgroundColor:
                        "#0b0b0b",
                    },
                  }}
                >
                  {/* Avatar */}
                  <TableCell>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        backgroundColor:
                          vendor.avatarBg,
                        color:
                          vendor.avatarColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "center",
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      {vendor.label}
                    </Box>
                  </TableCell>

                  {/* Name */}
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#f1f1f1",
                      }}
                    >
                      {vendor.name}
                    </Typography>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <Typography
                      sx={{
                        color: "#888",
                        fontSize: 12,
                      }}
                    >
                      {vendor.sub}
                    </Typography>
                  </TableCell>

                  {/* On-Time */}
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color:
                            metricColor(
                              vendor.onTime,
                              "onTime"
                            ),
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {vendor.onTime}%
                      </Typography>

                      {vendor.id === "VB" && (
                        <Tooltip title="Declining trend">
                          <WarningAmberIcon
                            sx={{
                              fontSize: 14,
                              color:
                                "#ef4444",
                            }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>

                  {/* Accuracy */}
                  <TableCell
                    sx={{
                      color: metricColor(
                        vendor.accuracy,
                        "accuracy"
                      ),
                      fontWeight: 700,
                    }}
                  >
                    {vendor.accuracy}%
                  </TableCell>

                  {/* Rank */}
                  <TableCell>
                    {vendor.rank === 1 ? (
                      <Box
                        sx={{
                          display:
                            "inline-flex",
                          alignItems:
                            "center",
                          gap: 0.5,
                          backgroundColor:
                            "#0d2a18",
                          border:
                            "1px solid #166534",
                          color: "#22c55e",
                          borderRadius: 1,
                          px: 1,
                          py: 0.4,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        <StarIcon
                          sx={{
                            fontSize: 12,
                          }}
                        />

                        {vendor.rank}
                      </Box>
                    ) : (
                      <Typography
                        sx={{
                          color: "#888",
                          fontSize: 13,
                        }}
                      >
                        {vendor.rank}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* Vendor Dialog */}
        <VendorDialog
          vendor={selectedVendor}
          onClose={() =>
            setSelectedVendor(null)
          }
        />
      </Box>
    </ThemeProvider>
  );
}