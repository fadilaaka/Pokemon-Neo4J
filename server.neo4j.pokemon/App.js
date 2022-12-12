const neo4j = require("neo4j-driver");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const Pool = require("pg").Pool;
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const pool = new Pool({
  host: "194.233.91.96",
  port: "5050",
  user: "admin",
  password: "adminpassword",
  database: "paw",
});

const driver = new neo4j.driver( //pemanggilan neo4j
  "neo4j://localhost:7687",
  neo4j.auth.basic("neo4j", "admin123") //autentifikasi akun neo4j
);
const session = driver.session(); // menjalani query chipper

const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server has been starting  at port " + PORT);
});
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: "./public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("file");

// CREATE data pokemon
app.post("/pokemon", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(408).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    session
      .run(
        `CREATE (n:pokemon {nama: "${req.body.nama}", deskripsi: "${req.body.deskripsi}", path: "/images/${req.file.filename}"})`
      )
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
    // pool.query(
    //   "insert into app.pokemon (nama,deskripsi,path) values($1,$2,$3)",
    //   [req.body.nama, req.body.deskripsi, "/images/" + req.file.filename],
    //   (err, result) => {
    //     if (err) {
    //       return res.status(500).json(err);
    //     }
    //     pool.query("select * from app.pokemon", (err, result) => {
    //       if (err) {
    //         return res.status(500).json(err);
    //       }
    //       return res.status(200).json(result.rows);
    //     });
    //   }
    // );
  });
});

// READ data pokemon
app.get("/pokemon", (req, res) => {
  session
    .run("MATCH (n:pokemon) RETURN properties(n)")
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });

  // pool.query("select * from app.pokemon", (err, result) => {
  //   if (err) {
  //     return res.status(500).json(err);
  //   }
  //   return res.status(200).json(result.rows);
  // });
});

// UPDATE data pokemon
app.put("/pokemon/:name", (req, res) => {
  const { name } = req.params;
  const { nama, deskripsi } = req.body;
  session
    .run(
      `MATCH (n:pokemon {nama: "${name}"}) SET n.nama="${nama}", n.deskripsi="${deskripsi}" RETURN n`
    )
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
  // pool.query(
  //   "insert into app.pokemon (nama,deskripsi,path) values($1,$2,$3)",
  //   [req.body.nama, req.body.deskripsi, "/images/" + req.file.filename],
  //   (err, result) => {
  //     if (err) {
  //       return res.status(500).json(err);
  //     }
  //     pool.query("select * from app.pokemon", (err, result) => {
  //       if (err) {
  //         return res.status(500).json(err);
  //       }
  //       return res.status(200).json(result.rows);
  //     });
  //   }
  // );
});

// DELETE data pokemon
app.delete("/pokemon/delete/:name", (req, res) => {
  const { name } = req.params;
  session
    .run(`MATCH (n:pokemon{nama:'${name}'}) DELETE n`)
    .then((result) => {
      console.log(result) 
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });

  // pool.query(
  //   `SELECT path FROM app.pokemon WHERE nama='${name}'`,
  //   (err, result) => {
  //     if (err) {
  //       return res.status(500).json(err);
  //     }
  //     console.log("ini result : ", result.rows[0].path);
  //     fs.unlink(path.join(`public${result.rows[0].path}`), (callback) => {});
  //   }
  // );
  // pool.query(`DELETE FROM app.pokemon WHERE nama=$1`, [name], (err, result) => {
  //   if (err) {
  //     return res.status(500).json(err);
  //   }
  //   return res.status(200).json(result.rows);
  // });
});

app.get("/", function (req, res) {
  res.json({ message: "WELCOME" });
});

// docker run --name postgresql-PAW -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=adminpassword -p 5050:5432 -d postgres
