import UserData from '../models/userData.model.js';

const httpAddUserData = async (req, res) => {
    try {
      const { groupName, entries} = req.body;
  
      if (!groupName || !entries || !Array.isArray(entries)) {
        return res.status(400).json({ error: 'Invalid data' });
      }

      const data = {
        groupName,
        entries: entries.map(entry => ({
          fieldName: entry.fieldName,
          value: entry.value
        }))
      }

      const newUserData = new UserData(data);
      await newUserData.save();
      res.status(201).json({ message: 'Data added successfully', data: data });
    } catch (error) {
      console.error('Error in adding the data', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

export default httpAddUserData;