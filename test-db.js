const mongoose = require('mongoose');

const uri = "mongodb+srv://user:user123@source.gwvspho.mongodb.net/renewable_energy?appName=source";

mongoose.connect(uri, { family: 4 })
  .then(() => {
    console.log("SUCCESSFULLY CONNECTED TO MONGODB ATLAS!");
    process.exit(0);
  })
  .catch(err => {
    console.error("MONGODB CONNECTION ERROR:");
    console.error(err);
    process.exit(1);
  });
