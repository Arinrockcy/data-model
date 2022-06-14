import mongoose  from "mongoose";
//const uri = "mongodb+srv://:<password>@cluster0.24asb.mongodb.net/?retryWrites=true&w=majority";
const connectionString = `mongodb+srv://data_model:data_model@cluster0.24asb.mongodb.net/data_model?retryWrites=true&w=majority`;
export  const DB = ()=> mongoose.createConnection(connectionString); 