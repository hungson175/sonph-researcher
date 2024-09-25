import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';

export function ApiKeyModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [keyName, setKeyName] = useState(initialData?.name || "");
  const [keyLimit, setKeyLimit] = useState(initialData?.limit || "");
  const [keyUsage, setKeyUsage] = useState(initialData?.usage || "");

  useEffect(() => {
    if (initialData) {
      setKeyName(initialData.name || '');
      setKeyLimit(initialData.limit || '');
      setKeyUsage(initialData.usage || '');
    } else {
      setKeyName('');
      setKeyLimit('');
      setKeyUsage('');
    }
  }, [initialData]);

  function handleSave() {
    onSubmit({ name: keyName, limit: keyLimit, usage: keyUsage });
    onClose();
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{initialData ? "Edit API key" : "Add new API key"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter a name, limit, and current usage for the API key.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
        />
        <TextField
          margin="dense"
          id="limit"
          label="Limit"
          type="number"
          fullWidth
          variant="standard"
          value={keyLimit}
          onChange={(e) => setKeyLimit(e.target.value)}
        />
        <TextField
          margin="dense"
          id="usage"
          label="Usage"
          type="number"
          fullWidth
          variant="standard"
          value={keyUsage}
          onChange={(e) => setKeyUsage(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}