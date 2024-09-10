const mysql=require('mysql');
const con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'node_project'
});
// con.connect((err)=>{
// if(err){
//     console.log("connection not proper");
// }else{
//     console.log("connected");
// }
// });
module.exports = con;