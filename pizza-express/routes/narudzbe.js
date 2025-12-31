import express from "express";
import { connectToDatabase } from "../db.js";

const router = express.Router();
let db = await connectToDatabase();

// POST /narudzbe - Izrada nove narudžbe pizza
router.post("/", async (req, res) => {
  console.log("Primljeni podaci narudžbe: ", req.body);

  let pizze_collection = await db.collection("pizze");
  let narudzbe_collection = await db.collection("narudzbe");
  let novaNarudzba = req.body;

  let obavezniKljuceviNarudzba = ["ime", "adresa", "telefon", "narucene_pizze"];
  let obavezniKljuceviPizze = ["naziv", "kolicina", "velicina"];

  let kljuceviNarudzba = Object.keys(novaNarudzba);

  //provjera kljuceva narudzbe
  let validKljuceviNarudzba = obavezniKljuceviNarudzba.every((kljuc) =>
    kljuceviNarudzba.includes(kljuc)
  );
  if (!validKljuceviNarudzba || kljuceviNarudzba.length != 4) {
    return res.status(400).json({ error: "Pogrešan unos podataka narudžbe" });
  }

  //provjera kljuceva pizze
  let validKljuceviPizze = obavezniKljuceviPizze.every((kljuc) =>
    novaNarudzba.narucene_pizze.every(
      (narucenaPizza) =>
        kljuc in narucenaPizza && Object.keys(narucenaPizza).length == 3
    )
  );
  if (!validKljuceviPizze) {
    return res.status(400).json({ error: "Pogrešan unos naručenih pizza!" });
  }

  //provjera podataka "telefon"
  if (typeof novaNarudzba.telefon !== "number") {
    const validanTelefonskiBroj = novaNarudzba.telefon
      .split("")
      .every((znak) => znak >= "0" && znak <= "9");

    if (!validanTelefonskiBroj) {
      return res
        .status(400)
        .json({ error: "Telefonski broj mora sadržavati samo brojeve!" });
    }
  }

  let ukupna_cijena = 0.0;
  for (let narucenaPizza of novaNarudzba.narucene_pizze) {
    let trazenaPizza = await pizze_collection.findOne({
      naziv: narucenaPizza.naziv,
    });

    let cijenaPizze = trazenaPizza.cijene[narucenaPizza.velicina.toLowerCase()];
    ukupna_cijena += cijenaPizze * narucenaPizza.kolicina;
  }

  novaNarudzba = { ...novaNarudzba, ukupna_cijena: ukupna_cijena };

  try {
    let result = await narudzbe_collection.insertOne(novaNarudzba);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
});

// GET /narudzbe - Provjera svih narudzbi
router.get("/", async (req, res) => {
  try {
    let narudzbe_collection = await db.collection("narudzbe");
    let narudzbe = await narudzbe_collection.find().toArray();
    res.status(200).json(narudzbe);
  } catch (error) {
    console.error(error.errorResponse);
    res.status(400).json({ error: error.errorResponse });
  }
});
export default router;
