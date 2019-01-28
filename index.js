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

app.get('/', (reqq, res) => {
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
// API untuk insert data baru pada tabel movies, tapi masih bingung pakekya req.body. apa makanya langsung tembak pake string.
app.post('/movieinsert', (req, res) => {
    var ins = {
        // nama: "slenderman",
        // tahun: 1990,
        // description: "best horor in the world"
        nama: req.body.nama,
        taun: req.body.tahun,
        description: req.body.description,
    }
    var sql = `insert into movies set ?`;
    conn.query(sql, ins, (err, resulth) => {
        if (err) throw err;
        res.send(resulth)
    })
})
// API untuk edit movies 
app.put('/movieedit/:id', (req, res) => {
    var par = req.params.id
    var nama = req.body.nama;
    var tahun = req.body.tahun;
    var description = req.body.description
    var sql = `update movies set nama = ${nama} and tahun =${tahun} and description = ${description} where id = ${par};`;
    conn.query(sql, ins, (err, resulth) => {
        if (err) throw err;
        res.send(resulth)
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
// API untuk insert kategory movies problemya masih sama lupa properti yang ada di req.body itu apa
app.post('/categoryinsert/:cate', (req, res) => {
    // var cat = {
    //     // nama: 'Fantasi',
        // nama: req.body,
    // }
    var cat = req.body.nama
    var sql = `insert into categories set ?`;
    conn.query(sql, cat, (err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

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

// app.get('/productbycategory/', (req, res) => {
//     var namaCat = req.query.getcategory;
//     console.log(namaCat)
//     var namaPro = req.query.productname;
//     console.log(namaPro)
//     var sql = `select z.id as idZara, z.nama as namaZara,
//                 harga, description, cz.id as idCategory,
//                 cz.nama as namaCategory
//                 from zara z
//                 join zaracatzara zcz 
//                 on z.id = zcz.idzara
//                 join catzara cz
//                 on zcz.idcatzara = cz.id
//                 where cz.nama = '${namaCat}' and z.nama = '${namaPro}';`

//     conn.query(sql, (err, results) => {
//         if (err) throw err;
//         res.send(results)
//     })
// })

// app.get('/product', (req, res) => {
//     var sql = `select z.id as idZara, z.nama as namaZara,
//                 harga, description, cz.id as idCategory,
//                 cz.nama as namaCategory
//                 from zara z
//                 join zaracatzara zcz 
//                 on z.id = zcz.idzara
//                 join catzara cz
//                 on zcz.idcatzara = cz.id;`

//     conn.query(sql, (err, results) => {
//         if (err) throw err;
//         res.send(results)
//     })
// })

// app.get("/delete/:idzara", (req, res) => {
//     var deleting = req.params.idzara;
//     console.log(deleting)
//     var sql = `DELETE zaracatzara FROM zaracatzara
//                 JOIN catzara ON zaracatzara.idcatzara = catzara.id
//                 JOIN zara ON zaracatzara.idzara = zara.id
//                 WHERE zara.id = '${deleting}';`
//     conn.query(sql, (err, results) => {
//         if (err) throw err;
//         res.send(results)
//     })
// })

// app.get('/productbynama/:nama', (req, res) => {
//     var namaZara = req.params.nama
//     var sql = `select z.id as idZara, z.nama as namaZara,
//     harga, description, cz.id as idCategory,
//     cz.nama as namaCategory
//     from zara z
//     join zaracatzara zcz 
//     on z.id = zcz.idzara
//     join catzara cz
//     on zcz.idcarzara = cz.id
//     where z.nama = '${namaZara}';`

//     conn.query(sql, (err, result) => {
//         if (err) throw err;
//         res.send(result)
//     })
// })

app.listen(port, () => console.log('API berjalan pada port ' + port))