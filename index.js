const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/staffDuties', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema
const dutySchema = new mongoose.Schema({
    staffName: { type: String, required: true },
    clientName: { type: String, required: true },
    clientAddress: { type: String, required: true },
    dutyTime: { type: String, required: true },
    workingHour: { type: Number, required: true },
    dutyDate: { type: Date, required: true },
    location: { type: String, required: true },
    currentTime: { type: Date, default: Date.now }
});
const Duty = mongoose.model('Duty', dutySchema);

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint to serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/staff_duty_form.html');
});

// Endpoint to handle form submission
app.post('/submitDuty', async (req, res) => {
    const { staffName, clientName, clientAddress, dutyTime, workingHour, dutyDate, location } = req.body;

    try {
        const newDuty = new Duty({
            staffName: staffName,
            clientName: clientName,
            clientAddress: clientAddress,
            dutyTime: dutyTime,
            workingHour: workingHour,
            dutyDate: dutyDate,
            location: location
        });
        await newDuty.save();
        res.json({ message: 'Duty submitted successfully' });
    } catch (error) {
        console.error('Error saving duty:', error);
        res.status(500).json({ error: 'Error saving duty' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
