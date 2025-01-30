export const decalreFormEvent = (_doApi) => {
  let id_form = document.querySelector("#id_form");
  id_form.addEventListener("submit",(e) => {
    e.preventDefault();

    let dataBody = {
      name: document.querySelector("#id_name").value,
      cals: document.querySelector("#id_cals").value,
      price: document.querySelector("#id_price").value
    }

    console.log(dataBody);
    addNewCake(dataBody,_doApi);
  })
}


const addNewCake = async(_bodyData,_doApi) => {
  let myUrl = "http://localhost:5000/api/cakes"
  try{
    let resp = await axios({
      url:myUrl,
      // שיטת השיגור אם פוסט, פוט או דיליט
      method:"POST",
      // הבאדי שנרצה לשלוח
      data:JSON.stringify(_bodyData),
      // כדי שהשרת יבין שזה ג'ייסון
      headers:{
        'content-type': "application/json"
      }
    })  
    // אם הצלחנו אנחנו יודעים שנקבל איי די 
    if(resp.data._id){
      alert("Cake added");
      _doApi();
      // לקרוא מחדש לדו איי פי איי שנמצא בקובץ אפ
    }
    else{
      alert("there problem , try again")
    }
  }
  catch(err){
    console.log(err);
    alert("There problem, come back later")
  }
}