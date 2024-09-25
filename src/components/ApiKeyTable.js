import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ApiKeyTable({ apiKeys, onEdit, onDelete }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="API keys table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Key</TableCell>
            <TableCell>Limit</TableCell>
            <TableCell>Usage</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {apiKeys.map((apiKey) => (
            <TableRow key={apiKey.id}>
              <TableCell component="th" scope="row">
                {apiKey.name}
              </TableCell>
              <TableCell>{apiKey.key}</TableCell>
              <TableCell>{apiKey.limit}</TableCell>
              <TableCell>{apiKey.usage}</TableCell>
              <TableCell align="right">
                <Button startIcon={<EditIcon />} onClick={() => onEdit(apiKey)}>
                  Edit
                </Button>
                <Button startIcon={<DeleteIcon />} onClick={() => onDelete(apiKey.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ApiKeyTable;