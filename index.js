const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 9999;
const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'wakdoyok',
    password: '12345',
    database: 'moviebertasbih',
    port: 3306
})

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('<h1>Haai</h1>')
})

// API untuk menampilkan movielist
app.get('/movielist', (req, res) => {
    var sql = `select * from movies`;
    conn.query(sql, (err, resulth) => {
        if (err) throw err;
        res.send(resulth);
    })
})

// API untuk menghapus list movie berdasarkan nama yang diketik di path
app.delete('/movie/:id', (req, res) => {
    var del = req.params.id;
    var sql = `delete from movies where id = '${del}';`
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send('data berhasil di hapus ');
    })
})

// API untuk insert data baru pada tabel movies via postman dan tanpa front end + sudah di proteksi

app.post('/movieinsert', (req, res) => {
    var data = req.body
    var sql = `SELECT * FROM movies WHERE nama = '${data.nama}'`;
    conn.query(sql, (err, results) => {
        if (err) throw err;
        if(results.length === 0) {
            var sql = 'INSERT INTO movies SET ?';
            conn.query(sql, data, (err, results) => {
                if(err) throw err
                res.send(results);
            });
        } else {
            res.send('Data yang anda masukan sudah ada.');
        }
    });
})

// API insert unutk menghubungkan yang di front end

app.post('/movieinsert', (req, res) => {
    var listoforders = {
        nama: req.body.nama,
        tahun: req.body.tahun,
        description: req.body.description,
    }

    var sql = `insert into movies set ? ;`
    conn.query(sql, listoforders, (err, result) => {
        if (err) throw err;
        res.send(result)

    })
})

// API delete via front end

app.delete('/delete/:id', (req, res) => {
    var deleted = req.params.id;
    var sql = `delete from movies where id = ${deleted};`;
    conn.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    })
})

// API untuk edit movies vis postman belum dilengkapi dengan proteksi
app.put('/movieedit/:id', (req, res) => {
    var par = req.params.id
    var name = req.body
    var sql = `UPDATE movies WHERE id = '${par}';`
    conn.query(sql, name, (err, resulth) => {
        if (err) throw err;
        res.send(resulth)
    })
})

// API edit movie yang digunkan untuk front end

app.put('/editcart/:id', (req, res) => {
    var isiId = req.params.id;
    var movedit = req.data
    var sql = `update movies set ? where id = ${isiId};`;
    conn.query(sql, movedit, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result)
    })
})

// API untuk menampilkan catgeory movie
app.get('/categories', (req, res) => {
    var sql = `select * from categories`;
    conn.query(sql, (err, resulth) => {
        if (err) throw err;
        res.send(resulth);
    })
})
// API untuk menghapus data category movie, hapusnya menggunkan parameter yang ditulis di path "http://localhost:9999/category/(id kategori"
app.delete('/category/:cat', (req, res) => {
    var catdel = req.params.cat;
    var sql = `delete from categories where nama = '${catdel}';`;
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.send(`data berhasil dihapus dari category`)
    })
})
// // API untuk insert data baru pada tabel movies via postman dan tanpa front end + sudah di proteksi
app.post('/categoryinsert', (req, res) => {
    var request = req.body
    var sql = `select * FROM categories where nama = '${request.nama}'`;
    conn.query(sql, (err, results) => {
        if (err) throw err;
        if(results.length === 0) {
            var sql = 'insert into categories set ?';
            conn.query(sql, request, (err, results) => {
                if(err) throw err
                res.send(results);
            });
        } else {
            res.send('Data yang anda masukan sudah ada.');
        }
    });
})

// API untuk insert data via front end tanpa proteksi

app.post('/categoryinsert', (req, res) => {
    var insertcat = {
        nama: req.body.nama,
    }

    var sql = `insert into categories set ? ;`
    conn.query(sql, insertcat, (err, result) => {
        if (err) throw err;
        res.send(result)

    })
})

// API untuk edit categori via postman cara aksesnya via params dengan menambahkan id nama kategori yang dimkasud untuk di edit

app.put('/editcat/:id', (req,res) => {
    var editcat = req.body;
    var sql = `select id FROM categories WHERE id = '${req.params.id}'`;
    conn.query(sql, (err, results) => {
        if (err) throw err;
        if(results.length > 0) {
            var sql = `update categories set ? where id = '${req.params.id}';`
            conn.query(sql, editcat, (err1, results1) => {
                if (err) throw err;
                res.send(results1);
            });
        } else {
            res.send(results);
        }
    });
});

// API untuk menampilkan data movie dan category dari hasil join antara tabel movies dan categoies
app.get('/movieandcategory', (req, res) => {
    var sql = `select z.nama as judulmovies,
                cz.nama as namacategories
                from movies z
                join movcat zcz 
                on z.id = zcz.idmovie
                join categories cz
                on zcz.idcategory = cz.id;`;
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

// API untuk delete data movies and caategory -> delete dengan cara menuliskan id movies yang terdapat dalam colom join, lebih lengkapnya dengan mengetikan "http://localhost:9999/delete/(berdasarkan id movies yang akan dihapus"

app.delete("/delete/:idmovie", (req, res) => {
    var deleting = req.params.idmovie;
    console.log(deleting)
    var sql = `DELETE movcat FROM movcat
                    JOIN categories ON movcat.idcategory = categories.id
                    JOIN movies ON movcat.idmovie = movies.id
                    WHERE movies.id = '${deleting};`
    conn.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results)
    })
})

app.listen(port, () => console.log('API berjalan pada port ' + port))