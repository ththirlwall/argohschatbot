const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const events = JSON.parse(fs.readFileSync('events.json'));
const faqs = JSON.parse(fs.readFileSync('faqs.json'));

app.post('/chat', (req, res) => {
  const userQuestion = req.body.question.toLowerCase();

  let response = 'Sorry, I do not have an answer for that.';

  // Check FAQs
  for (let faq of faqs) {
    if (userQuestion.includes(faq.question.toLowerCase())) {
      response = faq.answer;
      break;
    }
  }

  // Check Events
  if (response === 'Sorry, I do not have an answer for that.') {
    for (let event of events) {
      if (userQuestion.includes(event.name.toLowerCase())) {
        response = `Event: ${event.name}, Date: ${event.date}, Description: ${event.description}`;
        break;
      }
    }
  }

  res.send({ answer: response });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
