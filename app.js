
import express from 'express';
import jwt from 'jsonwebtoken'
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';

// Set up the express app
const app = express();
let token;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const corsOptions = {
    origin: '*'
}
app.use(cors(corsOptions));

app.get('/api', (req, res) => {
    res.json({
        message: 'welcome to the consultometer api',
    })
});
app.post('/api/login', (req, res) => {

    let consultometer_db = require('nano')('http://64.225.122.227:5984')
    console.log('LOGIN')
    const cookies ={}
    consultometer_db.auth(req.body.name, req.body.password, function (err, body, headers) {
        if (err) {
          res.json({
              err
          })
        }
      
        
        const token = headers['set-cookie'][0].split('=')[1].split('; ')[0];
        res.json({
            token,
            status: "to successes nafter successes"
        });
    });
});
// get all todos
app.get('/api/meetings', (req, res) => {
    console.log('req.body: ', req.query);
    let auth = req.query.token;
    let consultometer_db = require('nano')({
        url: 'http://64.225.122.227:5984/consultometer',
        cookie: 'AuthSession='+auth,
    })
    consultometer_db.view('meetings', 'meeting-view', function (err, body, headers) {
        if (err) {
          res.json({
              err
          });
        }
      
        res.json({
            body
        })
      });
});
app.put('/api/meeting/', (req, res) => {
    const meeting = req.body.meeting;
    const authToken = req.body.authToken;
    console.log('MEETING: ', meeting);
    console.log('authToken: ', authToken);
    let consultometer_db = require('nano')({
        url: 'http://64.225.122.227:5984/consultometer',
        cookie: 'AuthSession='+authToken,
    })
    consultometer_db.insert(meeting, meeting._id).then((body) => {
        console.log('BODY: ', body);
        //const token = headers['set-cookie'][0].split('=')[1].split('; ')[0];
        res.json({
            body
        })
    }); 
});
app.post('/api/meeting/', (req, res) => {
    const meeting = req.body.meeting;
    const authToken = req.body.authToken;
    let consultometer_db = require('nano')({
        url: 'http://64.225.122.227:5984/consultometer',
        cookie: 'AuthSession='+authToken,
    })
    consultometer_db.insert(meeting, '').then((body) => {
        console.log('BODY: ', body);
        //const token = headers['set-cookie'][0].split('=')[1].split('; ')[0];
        res.json({
            body
        })
    });
});
app.get('/api/attendees', (req, res) => {
    console.log('req.body: ', req.query);
    let auth = req.query.token;
    let consultometer_db = require('nano')({
        url: 'http://64.225.122.227:5984/consultometer',
        cookie: 'AuthSession='+auth,
    })
    consultometer_db.view('attendees', 'attendee-view', function (err, body, headers) {
        if (err) {
          res.json({
              err
          });
        }
      
        res.json({
            body
        })
      });
});
app.post('/api/attendee/', (req, res) => {
    const attendee = req.body.attendee;
    const authToken = req.body.authToken;
    let consultometer_db = require('nano')({
        url: 'http://64.225.122.227:5984/consultometer',
        cookie: 'AuthSession='+authToken,
    })
    consultometer_db.insert(attendee, '').then((body) => {
        console.log('BODY: ', body);
        //const token = headers['set-cookie'][0].split('=')[1].split('; ')[0];
        res.json({
            body
        })
    });
});
app.put('/api/attendee/', (req, res) => {
    const attendee = req.body.attendee;
    const authToken = req.body.authToken;
    console.log('MEETING: ', attendee);
    console.log('authToken: ', authToken);
    let consultometer_db = require('nano')({
        url: 'http://64.225.122.227:5984/consultometer',
        cookie: 'AuthSession='+authToken,
    })
    consultometer_db.insert(attendee.value, attendee.value).then((body) => {
        console.log('BODY: ', body);
        //const token = headers['set-cookie'][0].split('=')[1].split('; ')[0];
        res.json({
            body
        })
    }); 
});
app.delete('/api/attendee/', (req, res) => {
    console.log(req.body);
    const id = req.body.params.id;
    const rev = req.body.params.rev;
    const authToken = req.body.params.authToken;
    console.log('ID: ', id);
    console.log('rev: ', rev);
    console.log('AUTHTOKEN: ', authToken);
    let consultometer_db = require('nano')({
        url: 'http://64.225.122.227:5984/consultometer',
        cookie: 'AuthSession='+authToken,
    })
    consultometer_db.destroy(id, rev).then((body) => {
        console.log('BODY: ', body);
        //const token = headers['set-cookie'][0].split('=')[1].split('; ')[0];
        res.json({
            body
        })
    })
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
