import express from "express";
import { connectToDatabase } from "../db.js";

const router = express.Router();
let db = await connectToDatabase();

// GET /pizze - Dohvaćanje svih pizza iz baze podataka
router.get("/", async (req, res) => {
  let pizze_collection = await db.collection("pizze");
  let naziv_query = req.query.naziv;
  let cijena_min_query = req.query.cijena_min;
  let cijena_max_query = req.query.cijena_max;
  let sort_query = req.query.sort;

  try {
    let pipeline = [];

    //pretrazivanje prema nazivu, QUERY NAZIV
    if (naziv_query) {
      pipeline.push({
        $match: {
          naziv: { $regex: naziv_query, $options: "i" },
        },
      });
    }

    let pizze = await pizze_collection.aggregate(pipeline).toArray();
    res.status(200).json(pizze);
  } catch (error) {
    console.error(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
});

// GET /pizze/:naziv - Dohvaćanje pizze prema nazivu iz baze podataka
router.get("/:naziv", async (req, res) => {
  let pizze_collection = await db.collection("pizze");
  const naziv_param = req.params.naziv;

  try {
    let pizza = await pizze_collection.findOne({ naziv: naziv_param });

    if (!pizza) {
      return res
        .status(400)
        .json({ message: `Pizza ${naziv_param} nije pronađena!` });
    }

    res.status(200).json(pizza);
  } catch (error) {
    console.error(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
});

//POST /pizze
router.post("/", async (req, res) => {
  let pizze_collection = await db.collection("pizze");
  const novaPizza = req.body;

  let obavezniKljucevi = ["naziv", "sastojci", "cijene", "slika_url"];
  let obavezniKljuceviVelicine = ["mala", "srednja", "jumbo"];

  let kljuceviPizza = Object.keys(novaPizza);
  let kljuceviVelicine = Object.keys(novaPizza.cijene);

  //provjera kljuceva pizze
  let validKljucevi = obavezniKljucevi.every((kljuc) =>
    kljuceviPizza.includes(kljuc)
  );
  if (!validKljucevi || kljuceviPizza.length != 4) {
    return res.status(400).json({ error: "Pogrešan unos podataka pizze" });
  }

  //provjera kljuceva velicina
  let validVelicine = obavezniKljuceviVelicine.every((kljuc) =>
    kljuceviVelicine.includes(kljuc)
  );
  if (!validVelicine || kljuceviVelicine.length != 3) {
    return res.status(400).json({ error: "Pogrešan unos veličina pizze!" });
  }

  //provjera podataka "cijena" i "sastojci"
  let validCijene = Object.values(novaPizza.cijene).every(
    (cijena) => typeof cijena === "number"
  );
  if (!validCijene) {
    return res.status(400).json({ error: "Cijena mora biti broj!" });
  }

  let validSastojci = Object.values(novaPizza.sastojci).every(
    (sastojak) => typeof sastojak === "string"
  );
  if (!validSastojci) {
    return res.status(400).json({ error: "Sastojci moraju biti string!" });
  }

  try {
    let result = await pizze_collection.insertOne(novaPizza);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
});

export default router;
