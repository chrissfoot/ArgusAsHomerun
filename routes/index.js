var express = require('express');
var util = require('util');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/discover.json', function (req, res) {

    var baseUrl = req.protocol + '://' + req.get('host');

    res.json({
        'FriendlyName': 'argusAsHomerun',
        'ModelNumber': 'HDHR4-2DT',
        'FirmwareName': 'hdhomerun4_dvbt',
        'TunerCount': '2',
        'FirmwareVersion': '20150826',
        'DeviceID': '12345678',
        'DeviceAuth': 'test1234',
        'BaseURL': baseUrl,
        'LineupURL': baseUrl + '/lineup.json'

    });
});


router.get('/lineup_status.json', function (req, res) {
    // Get lineup from argus
});


router.get('/lineup.json', function (req, res) {
    // Get lineup from argus

    var baseUrl = req.protocol + '://' + req.get('host');
    var lineUp = [];

    lineUp.push({
        GuideNumber: 1,
        GuideName: 'Chris\'s Test Channel',
        URL : baseUrl + '/auto/1' 

    });
    res.json(lineUp);

});

router.get('/auto/:channel', function (req, res) {
    // Return ts stream from argus
});


module.exports = router;