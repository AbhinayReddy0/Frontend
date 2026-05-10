import {
  Box, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, Chip,
} from "@mui/material";

const statusConfig = {
  confirmed: { label: "confirmed", bg: "#0d2a18", color: "#22c55e" },
  pending:   { label: "pending",   bg: "#1a1200", color: "#f59e0b" },
  delayed:   { label: "delayed",   bg: "#1a0a0a", color: "#ef4444" },
};

export default function TabPOs({ v }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 10, color: "#555", letterSpacing: "1px", px: 2, pt: 1.5, pb: 0.5 }}>
        OPEN PURCHASE ORDERS
      </Typography>

      <Table size="small" sx={{ "& td, & th": { fontFamily: "'Courier New', monospace" } }}>
        <TableHead>
          <TableRow>
            {["PO ID", "SKU", "QTY", "VALUE", "ETA", "STATUS"].map((h) => (
              <TableCell key={h}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {v.pos.map((po) => {
            const sc = statusConfig[po.status] || statusConfig.pending;
            return (
              <TableRow key={po.id} sx={{ "&:hover": { background: "#0d0d0d" } }}>
                <TableCell sx={{ color: v.accentColor, fontWeight: 700 }}>{po.id}</TableCell>
                <TableCell sx={{ color: "#ccc" }}>{po.sku}</TableCell>
                <TableCell sx={{ color: "#ccc" }}>{po.qty}</TableCell>
                <TableCell sx={{ color: "#ccc" }}>{po.val}</TableCell>
                <TableCell sx={{ color: "#ccc" }}>{po.eta}</TableCell>
                <TableCell>
                  <Box sx={{
                    display: "inline-block", px: "7px", py: "2px",
                    borderRadius: "4px", fontSize: 10, fontWeight: 600,
                    background: sc.bg, color: sc.color,
                  }}>
                    {sc.label}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Typography sx={{ fontSize: 11, color: "#555", px: 2, py: 1.5 }}>
        {v.openPOs} open POs · {v.openVal} total · Lifetime: {v.lifetime}
      </Typography>
    </Box>
  );
}
