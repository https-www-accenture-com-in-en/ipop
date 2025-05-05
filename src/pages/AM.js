import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Sample ticket data
const sampleTickets = {
  101: {
    type: 'Bug',
    description: 'Fix login issue',
    estTime: '3h',
    burntEffort: '1h',
    remTime: '2h',
  },
  202: {
    type: 'Feature',
    description: 'Add dark mode',
    estTime: '6h',
    burntEffort: '2h',
    remTime: '4h',
  },
  303: {
    type: 'Enhancement',
    description: 'Optimize dashboard load time',
    estTime: '5h',
    burntEffort: '1h',
    remTime: '4h',
  },
};

function TicketForm({ title, canDelete, onDelete }) {
  const [ticketNo, setTicketNo] = useState('');
  const [fields, setFields] = useState({});
  const [showFields, setShowFields] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [toBook, setToBook] = useState('');
  const [comments, setComments] = useState('');

  const handleGoClick = () => {
    if (!/^\d+$/.test(ticketNo)) {
      setError('Ticket number must be numeric.');
      setOpen(true);
      setShowFields(false);
      return;
    }

    const ticketData = sampleTickets[parseInt(ticketNo)];
    if (ticketData) {
      setFields(ticketData);
      setShowFields(true);
    } else {
      setError('Ticket not found.');
      setOpen(true);
      setShowFields(false);
    }
  };

  return (
    <Box
      sx={{
        p: 1,
        border: '1px solid #ccc',
        borderRadius: 1,
        boxShadow: 1,
        flex: '0 0 30%',
        minWidth: 220,
        position: 'relative',
      }}
    >
      {canDelete && (
        <IconButton
          onClick={onDelete}
          size="small"
          sx={{ position: 'absolute', top: 4, right: 4 }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}

      <Typography variant="body2" sx={{ mb: 1 }}>
        {title}
      </Typography>

      <Grid container spacing={0.5}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              variant="standard"
              label="Ticket No"
              value={ticketNo}
              onChange={(e) => setTicketNo(e.target.value)}
            />
            <Button
              variant="contained"
              size="small"
              sx={{ whiteSpace: 'nowrap' }}
              onClick={handleGoClick}
            >
              Go
            </Button>
          </Box>
        </Grid>

        {showFields && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                label="Type"
                value={fields.type}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                label="Description"
                value={fields.description}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                label="Est. Time"
                value={fields.estTime}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                label="Burnt"
                value={fields.burntEffort}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                label="Remaining"
                value={fields.remTime}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                label="To Book"
                value={toBook}
                onChange={(e) => setToBook(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                label="Comments"
                multiline
                minRows={1}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" size="small" fullWidth>
                Approve
              </Button>
            </Grid>
          </>
        )}
      </Grid>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpen(false)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const AM = () =>  {
  const [forms, setForms] = useState([{ id: 1 }, { id: 2 }, { id: 3 }]);

  const addForm = () => {
    setForms((prev) => [...prev, { id: prev.length + 1 }]);
  };

  const deleteForm = (id) => {
    setForms((prev) => prev.filter((_, index) => index < 3 || _.id !== id));
  };

  return (
    <Box sx={{ p: 1 }}>
      <Button variant="contained" size="small" onClick={addForm} sx={{ mb: 1 }}>
        Add Ticket
      </Button>

      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', p: 1 }}>
        {forms.map((form, index) => (
          <TicketForm
            key={form.id}
            title={`AM ${form.id}`}
            canDelete={index >= 3}
            onDelete={() => deleteForm(form.id)}
          />
        ))}
      </Box>
    </Box>
  );
}

export default AM;
