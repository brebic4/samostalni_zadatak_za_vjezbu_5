# 🍕 Pizza Express – WA5 MongoDB aplikacija

---

### 1️⃣Preuzimanje

```bash
git clone https://github.com/brebic4/samostalni_zadatak_za_vjezbu_5.git
cd samostalni_zadatak_za_vjezbu_5
```

Dodaj .env datotetku (upute na Merlinu)


## ⚙️ Backend – pokretanje

```bash
cd pizza-express
npm install
```

```bash
node index.js
```

Backend je dostupan na:

```
http://localhost:3000
```

---

## 🎨 Frontend – pokretanje

```bash
cd pizza-vue
npm install
```

```bash
npm run dev
```

Frontend je dostupan na:

```
http://localhost:5173
```

---

## 🧠 MongoDB Atlas

- Koristi se **MongoDB Atlas cluster**
- Kolekcije (Pogledati datoteku screenshots):
  - `pizze`
  - `narudzbe`
- Indeks:

```js
db.pizze.createIndex({ naziv: 1 });
```

---

## ⚠️ Sigurnost

- MongoDB connection string **nije hardcodan**
- Pristup bazi ide kroz `.env` datoteku
