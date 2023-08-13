const express =require('express')
const mongoose=require('mongoose')
const Razorpay=require('razorpay')
const app= express()
const cors = require('cors');
const Product=require('./models/Signin')
const Bill=require('./models/payment')
const port=8000
const PDFDocument = require('pdfkit');
const fs = require('fs');
const qr=require('qrcode')

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:'false'}))

app.get('/',(req,res) => {
    res.send("Hello NODE dreama API")
})

//login
app.post('/signin/:username',async(req,res)=>{
    try {
        const {username}=req.params
        const signin=await Product.find({username});
        if(!signin){
            return res.status(404).json({message:'Cannot Find account with username ${username}'})
            }
        res.status(200).json(signin)
    } catch (error) {
        res.status(500).json({message: error.message}) 
    }
})
//Signin
app.post('/signin',async(req,res)=>{
    try {
        const signin=await Product.create(req.body)
        res.status(200).json(signin);
        
    } catch (error) {
       console.log(error.message);
       res.status(500).json({message: error.message}) 
    }
})

//bill
app.post('/bill',async(req,res)=>{
    try {
        const bill=await Bill.create(req.body)
        res.status(200).json(bill);
        
    } catch (error) {
       console.log(error.message);
       res.status(500).json({message: error.message}) 
    }
})

//admin
app.get('/bill', async (req, res) => {
    try {
      const bill = await Bill.find();
      res.json(bill);
    } catch (error) {
      console.error('Error fetching bills:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//past passes
app.post('/bill/:name',async(req,res)=>{
    try {
        const {name}=req.params
        const getbill=await Bill.find({name});
        if(!getbill){
            return res.status(404).json({message:'Cannot Find account with name ${name}'})
            }
        res.status(200).json(getbill)
    } catch (error) {
        res.status(500).json({message: error.message}) 
    }
})

//bill
app.get('/bill/:name',async(req,res)=>{
    try {
        const {name}=req.params
        const getbill=await Bill.find({name});
        if(!getbill){
            return res.status(404).json({message:'Cannot Find account with name ${name}'})
            }
        res.status(200).json(getbill)
    } catch (error) {
        res.status(500).json({message: error.message}) 
    }
})
app.get('/bill/:billId/pdf', async (req, res) => {
    try {
      const { billId } = req.params;
      const bill = await Bill.findById(billId);
  
      if (!bill) {
        return res.status(404).json({ message: 'Bill not found' });
      }
  
      const doc = new PDFDocument();
      const filePath = `./bill_${billId}.pdf`;
      const stream = fs.createWriteStream(filePath);
  
      doc.pipe(stream);
      const qrCodeData = 'http://localhost:3000/userhomepage';
      qr.toDataURL(qrCodeData, { type: 'pdf' });
      doc.image('./models/Public/Images/Getpass logo.png', {fit: [90, 90],align:'left',continued:true} );
      doc.fontSize(20).text('GETPASS PURCHASE BILL', { align: 'right',lineGap: 10, });
      doc.fontSize(10).text('____________________________________________________________________________________',{lineGap:30})
      doc.fontSize(14).text(`Bill No. : ${bill.bill_no}`, { continued:true});
      doc.fontSize(14).text(`                                                                  NAME: ${bill.name}`, { left:'100px',lineGap: 50 });
      doc.fontSize(14).text(`BOARDING POINT : ${bill.boarding_point}`, { lineGap: 20 });
      doc.fontSize(14).text(`DESTINATION POINT : ${bill.destination_point}`, { lineGap: 50 });
      doc.fontSize(14).text(`Bus No. : ${bill.bus_no}`, { lineGap: 20 });
      doc.fontSize(14).text(`Number of tickets : ${bill.No_of_tickets}`, { lineGap: 50 });
      doc.fontSize(14).text(`AMOUNT : Rs.${bill.price}`, { lineGap: 230,align:'right' });
      doc.fontSize(10).text('____________________________________________________________________________________')
      doc.fontSize(10).text('Page 1                                                                                                                                        GetPass', { lineGap: 10 });    
   
      doc.end();
  
      stream.on('finish', () => {
        res.download(filePath, `bill_${billId}.pdf`, () => {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Error deleting PDF file:', err);
            }
          });
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });


mongoose.connect('mongodb+srv://GetPass:getpass@getpass.wlzryhy.mongodb.net/')
.then(() =>{
    app.listen(port,()=>{
        console.log('Connected to MongoDB')
        console.log('Node API is running.')
    }) 
})
.catch(()=>{
    console.error('Didnt connect to Mongo DB')
})

const razorpay = new Razorpay({
    key_id: 'rzp_test_dsqpBlsd93gkpG',
    key_secret: 'TELsj1NBPn6xmgqtFqyM9tAn',
  });

  app.post('/create-order', async (req, res) => {
    try {
      const options = {
        amount: 5000, 
        currency: 'INR',
        
      };
  
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create payment order' });
    }
  });


  app.listen(3001, () => {
    console.log('Server running on port 3001');
  });
