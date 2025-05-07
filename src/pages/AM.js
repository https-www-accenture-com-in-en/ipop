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

const sampleTickets = {
  101: {
    type: 'Bug',
    description: 'Fix login issue',
    category: 'Defect',
    Priority: 'High',
    Application: 'AppX',
    RealizationGroup: 'DevOps',
    FunctionalDomain: 'Login Services',
    ExternalRef1: 'EXT-001',
    State: 'Open',
    estTime: '3h',
    burnt: '1h',
    remaining: '2h',
  },
  202: {
    type: 'Feature',
    description: 'Add dark mode',
    category: 'Continuous improvement',
    Priority: 'Standard',
    Application: 'BS-MYWORX',
    RealizationGroup: 'SMC',
    FunctionalDomain: 'BS - DATALAKE RH',
    ExternalRef1: 'EXT-002',
    State: 'New',
    estTime: '6h',
    burnt: '2h',
    remaining: '4h',
  },
  303: {
    type: 'Enhancement',
    description: 'Optimize dashboard load time',
    category: 'Performance',
    Priority: 'Medium',
    Application: 'DashboardApp',
    RealizationGroup: 'Frontend',
    FunctionalDomain: 'Analytics',
    ExternalRef1: 'EXT-003',
    State: 'In Progress',
    estTime: '5h',
    burnt: '1h',
    remaining: '4h',
  },
};

function TicketForm({ title, canDelete, onDelete }) {
  const [ticketNo, setTicketNo] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [fields, setFields] = useState(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [toBook, setToBook] = useState('');
  const [comments, setComments] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [isApproved, setIsApproved] = useState(false);

  const handleGoClick = () => {
    if (!/^\d+$/.test(ticketNo)) {
      setError('Ticket number must be numeric.');
      setOpen(true);
      setFields(null);
      return;
    }

    const data = sampleTickets[parseInt(ticketNo)];

    if (data && data.type === ticketType) {
      setFields(data);
    } else {
      setError('Ticket not found or type mismatch.');
      setOpen(true);
      setFields(null);
    }
  };

  const handleApproveClick = () => {
    const remainingHours = parseInt(fields.remaining);
    const toBookHours = parseInt(toBook);

    if (toBookHours > remainingHours) {
      setIsApproved(true);
      setSaveMessage(`Approval Required Requested more hours of`);
    } else {
      setSaveMessage('Data Saved Successfully.');
      setIsApproved(false);
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
        minWidth: 300,
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

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
              select
              fullWidth
              size="small"
              variant="standard"
              label="Type"
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value=""></option>
              <option value="Bug">Bug</option>
              <option value="Feature">Feature</option>
              <option value="Enhancement">Enhancement</option>
            </TextField>
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

        {fields && (
          <>
            {[ 
              { label: 'Description', value: fields.description },
              { label: 'Category', value: fields.category },
              { label: 'Priority', value: fields.Priority },
              { label: 'Application', value: fields.Application },
              { label: 'Realization Group', value: fields.RealizationGroup },
              { label: 'Functional Domain', value: fields.FunctionalDomain },
              { label: 'External Ref', value: fields.ExternalRef1 },
              { label: 'State', value: fields.State },
              { label: 'Est. Time', value: fields.estTime },
              { label: 'Burnt', value: fields.burnt },
              { label: 'Remaining', value: fields.remaining },
            ].map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <TextField
                  fullWidth
                  size="small"
                  variant="standard"
                  label={field.label}
                  value={field.value}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            ))}

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
                label="Bussiness Reason"
                multiline
                minRows={1}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" size="small" fullWidth onClick={handleApproveClick}>
                {isApproved ? 'Approve' : 'Save'}
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

      {saveMessage && (
        <Snackbar
          open={!!saveMessage}
          autoHideDuration={3000}
          onClose={() => setSaveMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSaveMessage('')} severity="success" sx={{ width: '100%' }}>
            {saveMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}

const AM = () => {
  const [forms, setForms] = useState([{ id: 1 }, { id: 2 }, { id: 3 }]);

  const addForm = () => {
    setForms((prev) => [...prev, { id: prev.length + 1 }]);
  };

  const deleteForm = (id) => {
    setForms((prev) => prev.filter((form, index) => index < 3 || form.id !== id));
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" mb={2}>AM Ticket Delivery</Typography>

      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', p: 1 }}>
        {forms.map((form, index) => (
          <TicketForm
            key={form.id}
            title={``}
            canDelete={index >= 3}
            onDelete={() => deleteForm(form.id)}
          />
        ))}
      </Box>
      <Button variant="contained" size="small" onClick={addForm} sx={{ mb: 1 }}>
               Add Ticket
             </Button>
    </Box>
  );
};

export default AM;
