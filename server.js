express = require('express');
const fs = require('fs');
const cors = require('cors'); // ফ্রন্টএন্ড ও ব্যাকএন্ড সংযোগের জন্য
const app = express();

// মিডলওয়্যার কনফিগারেশন
app.use(cors()); 
app.use(express.json({ limit: '50mb' })); // বড় সাইজের স্ক্রিনশট ফাইল নেওয়ার জন্য

// যদি uploads ফোল্ডারটি না থাকে তবে এটি স্বয়ংক্রিয়ভাবে তৈরি হবে
if (!fs.existsSync('./uploads')){
    fs.mkdirSync('./uploads');
}

// ফ্রন্টএন্ড থেকে ডেটা রিসিভ করার এন্ডপয়েন্ট
app.post('/save-report', (req, res) => {
  const { screenshot, os, browser, url, timestamp } = req.body;

  // Base64 ইমেজ স্ট্রিং থেকে পিওর ইমেজ ডেটা আলাদা করা
  const base64Data = screenshot.replace(/^data:image\/png;base64,/, "");
  const fileName = `bug_report_${Date.now()}.png`;

  // 'uploads' ফোল্ডারের ভেতর ইমেজ ফাইল হিসেবে সেভ করা
  fs.writeFile(`./uploads/${fileName}`, base64Data, 'base64', (err) => {
    if (err) {
      console.error("ফাইল সেভ করতে সমস্যা হয়েছে:", err);
      return res.status(500).json({ status: 'error', message: 'স্ক্রিনশট সেভ করা যায়নি' });
    }

    // টার্মিনালে ব্যবহারকারীর ওএস এবং ব্রাউজারের নাম প্রিন্ট হবে
    console.log(`\n--- নতুন বাগ রিপোর্ট এসেছে ---`);
    console.log(`অপারেটিং সিস্টেম (OS): ${os}`);
    console.log(`ব্রাউজার (Browser): ${browser}`);
    console.log(`পেজ URL: ${url}`);
    console.log(`সময়: ${timestamp}`);
    console.log(`স্ক্রিনশট সেভ হয়েছে: /uploads/${fileName}`);

    res.status(200).json({ status: 'success', message: 'রিপোর্ট সফলভাবে জমা হয়েছে' });
  });
});

// সার্ভার চালু করা
app.listen(3000, () => console.
