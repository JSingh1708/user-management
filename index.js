const path = require('path');
const con = require('./connection');
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/userlist', (req, res) => {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 3;
    let offset = (page - 1) * limit;

    con.query(`SELECT * FROM students LIMIT ${limit} OFFSET ${offset}`, (err, result) => {
        if (err) {
            throw err;
        } else {
            con.query('SELECT COUNT(*) as count FROM students', (err, countResult) => {
                if (err) {
                    throw err;
                } else {
                    let totalItems = countResult[0].count;
                    let totalPages = Math.ceil(totalItems / limit);
                    res.json({
                        items: result,
                        totalPages: totalPages,
                        currentPage: page,
                        totalItems: totalItems,
                    });
                }
            });
        }
    });
    
});

app.post('/adduser', (req, res) => {
    const data = req.body;
    con.query("INSERT INTO students SET ?", data, (err, result) => {
        if (err) {
            throw err;
        } else {
            res.send(result);
        }
    });
});

app.put('/updateuser:id', (req, res) => {
    const data = [req.body.name, req.body.email, req.body.phone, req.params.id];
    con.query("UPDATE students SET name = ?, email = ?, phone = ? WHERE id = ?", data, (err, result) => {
        if (err) {
            throw err;
        } else {
            res.send(result);
        }
    });
});

app.delete('/deleteuser:id', (req, res) => {
    let student_id = req.params.id;
    con.query("DELETE FROM students WHERE id = " + student_id, (err, result) => {
        if (err) {
            throw err;
        } else {
            res.send(result);
        }
    });
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(4200, () => {
    console.log('Server is running on port 4200');
});