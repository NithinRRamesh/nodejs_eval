var express = require("express")
var bodyParser = require("body-parser")
var urlEncodedParser = bodyParser.urlencoded({
    extended: true
})
var mysql = require('mysql')
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'nithinramesh@18'
})

var app = express()

app.get('/', (req, res) => {
    res.sendFile("/media/nithin/E:/WT/node/nodejs eval/bank.html")
}).listen(3000)

app.get('/withdraw', (req, res) => {
    res.sendFile("/media/nithin/E:/WT/node/nodejs eval/withdraw.html")
})
app.get('/home', (req, res) => {
    res.sendFile("/media/nithin/E:/WT/node/nodejs eval/home.html")
})

app.post('/deposit-money', urlEncodedParser, (req, res) => {
    var accountNo = req.body.accountNo
    var amount = req.body.amount
    res = res;
    con.connect((err) => {

        con.query("use mydb", (err, result) => {
            console.log('mydb selected')
        })

        con.query("update accounts set amount=amount+" + amount + " where accountno=" + accountNo, (err, result) => {
            if(result.affectedRows==0) res.send("account not found");
            else{
            res.send("Amount Rs." + amount + " succesfully deposited to " + accountNo)
            }
        })
    })

})

app.post('/register', urlEncodedParser, (req, res) => {
    var accountNo = req.body.accountNo
    var name = req.body.name

    if(accountNo.length!=4){
        res.send('Invalid account no')
    }
    else{
        if(name==""||name==null){
            res.send('Invalid account no')
        }  
        else{
            con.connect((err) => {

                con.query("use mydb", (err, result) => {
                    console.log('mydb selected')
                })

                con.query("insert into accounts (name,accountno,dateAndTime,amount) values('" + name + "','" + accountNo + "','" + Date() + "','" + 500 + "')", (err, result) => {
                    if (err)
                        res.send("Duplicate accounts not allowed")
                    else
                        res.send("Account created");
                })
            })
        }
    }
})

app.post('/withdraw-money', urlEncodedParser, (req, res) => {
    var accountNo = req.body.accountNo
    var amount = req.body.amount
    res = res;

    con.connect((err) => {

        con.query("use mydb", (err, result) => {
            console.log('mydb selected')
        })

        con.query("select amount from accounts where accountno=" + accountNo, (err, result) => {
            
            if(!result){
                res.send("account no not found")
            }
            else{
            if (result[0].amount - amount < 500) {
                res.send("Insufficient balance (min balance should be RS.500)")
            } else {
                con.query("update accounts set amount=amount-" +amount+ " where accountno=" + accountNo, (err, result) => {
                    res.send("Amount Rs." + amount + " succesfully debited to " + accountNo)
                })
            }
            }
        })

    })

})