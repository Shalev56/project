const express = require("express");
const { auth } = require("../middlewares/auth");
const { cake, validateCake } = require("../models/cake")
const router = express.Router();


router.get("/", async (req, res) => {
  // Math.min -> המספר המקסימלי יהיה 20 כדי שהאקר לא ינסה
  // להוציא יותר אם אין צורך בזה מבחינת הלקוח
  let perPage = Math.min(req.query.perPage, 10) || 4;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  // מחליט אם הסורט מהקטן לגדול 1 או גדול לקטן 1- מינוס 
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let data = await cake
      .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }

})
//  הוספת איי די של יוצר הרשומה דרך הטוקן ששמור לנו מהלוג אין  
router.post("/", auth, async (req, res) => {
  let valdiateBody = validateCake(req.body);
  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details)
  }
  try {
    let cake = new cake(req.body);
    // הוספת מאפיין האיי די של המשתמש
    // בהמשך יעזור לנו לזהות שירצה למחוק או לערוך רשומה
    //  tokenData._id; -> מגיע מפונקציית האוט מהטוקן ומכיל את 
    // האיי די של המשתמש
    cake.user_id = req.tokenData._id;
    await cake.save();
    res.status(201).json(cake)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

router.put("/:idEdit", async (req, res) => {
  let valdiateBody = validateCake(req.body);
  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details)
  }
  try {
    let idEdit = req.params.idEdit
    let data = await cake.updateOne({ _id: idEdit }, req.body)
    // modfiedCount:1 - אם יש הצלחה
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

router.delete("/:idDel", auth, async (req, res) => {
  try {
    let idDel = req.params.idDel
    // כדי שמשתמש יוכל למחוק רשומה הוא חייב 
    // שלרשומה יהיה את האיי די ביוזר איי די שלו
    let data = await cake.deleteOne({ _id: idDel, user_id: req.tokenData._id })
    // "deletedCount": 1 -  אם יש הצלחה של מחיקה
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

module.exports = router;