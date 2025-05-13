import { Router } from 'express';
import { createName, editName, deleteName, getAllNames ,addMappedValue,
  editMappedValue,
  deleteMappedValue,
  getMappedValues, 
  setGuiTypeAndSequence} from '../controllers/admin.controller.js';
const adminrouter = Router();

adminrouter.post('/add', async (req, res) => {
  try {
    const { master_work_types } = req.body;
    const created = await createName(master_work_types);
    res.status(201).json(
        {
            message: "Name created successfully",
            data: created
        }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


adminrouter.put('/edit/:oldName', async (req, res) => {
  const { oldName } = req.params;   
  const { master_work_types } = req.body;     
  
  try {
    const updated = await editName(oldName, master_work_types);
    if (!updated) {
      return res.status(404).json({ error: 'Name not found' });
    }
    res.json({ message: `Updated "${oldName}" to "${master_work_types}" successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


adminrouter.delete('/delete', async (req, res) => {
  try {
    const deleted = await deleteName(req.body.master_work_types);
    if (!deleted) return res.status(404).json({ error: 'Name not found' });
    res.json({ message: 'Name deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


adminrouter.get('/allNames', async (req, res) => {
  try {
    const names = await getAllNames();
    res.status(200).json(
        {
            message: "All names fetched successfully",
            data: names
        }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminrouter.post('/mapped/:master_work_types/add', async (req, res) => {
  const { master_work_types } = req.params;
  const { work_type_categories } = req.body;
  try {
    const updated = await addMappedValue(master_work_types, work_type_categories);
    if (!updated) return res.status(404).json({ error: 'Name not found' });
    res.json({ message: 'Mapped value added', data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**/
adminrouter.put('/mapped/:name/edit', async (req, res) => {
  const { name } = req.params;
  const { oldValue, newValue } = req.body;
  try {
    const updated = await editMappedValue(name, oldValue, newValue);
    if (!updated) return res.status(404).json({ error: 'Mapped value not found' });
    res.json({ message: `Mapped value "${oldValue}" updated to "${newValue}"`, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


adminrouter.delete('/mapped/:master_work_types/delete', async (req, res) => {
  const { master_work_types } = req.params;
  const { name } = req.body;
  try {
 
    const updated = await deleteMappedValue(master_work_types, name);
    if (!updated) return res.status(404).json({ error: 'Name not found' });
    res.json({ message: `Mapped value "${name}" deleted`, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


adminrouter.get('/mapped/:name', async (req, res) => {
  try {
    const values = await getMappedValues(req.params.name);
    res.json({ message: 'Mapped values fetched', data: values });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminrouter.post('/addGuiwithSequence', async (req, res) => {
  const { gui_type, master_work_types, sequences } = req.body;

  if (!gui_type || !Array.isArray(master_work_types) || !Array.isArray(sequences)) {
    return res.status(400).json({ error: 'Invalid payload structure' });
  }

  try {
    const results = [];

    for (let i = 0; i < master_work_types.length; i++) {
      const masterType = master_work_types[i];
      const sequence = sequences[i];

      const updated = await setGuiTypeAndSequence(masterType, gui_type, sequence);
      if (updated) results.push(updated);
    }

    res.json({ message: 'GUI types and sequences updated', data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default adminrouter;