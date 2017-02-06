var express = require('express');
var util = require('util');
var request = require('request');
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
    res.json({
        ScanInProgress: 0,
        ScanPossible : 1,
        Source: 'Antenna',
        SourceList : ['Antenna']
    });
});


router.get('/lineup.json', function (req, res) {  
    var baseUrl = req.protocol + '://' + req.get('host');
    var lineUp = [];
    var url = 'http://localhost:49943/ArgusTV/Scheduler/Channels/0'    

    request.get({
        url: url,
        json: true,
        headers: {'Accept': 'application/json' }
    }, (error, response, data) => {
        if (!error && response.statusCode === 200) {            
			data.forEach(function (value) {
				
				lineUp.push({
					GuideNumber: value.Id.toString(),
					GuideName: value.DisplayName,
					URL: baseUrl + '/auto/' + value.ChannelId
				});				
			});
			res.json(lineUp);
        } else {
			res.send('Unable to get channels: ', error);
            console.log("Got an error:", error, ", status code: ", response.statusCode);
            console.log("Tried to get:", url);
        }
    });

    
    

});

router.get('/auto/:channel', function (req, res) {
    // Return ts stream from argus
    // Start a stream going and get the url
    var url = 'http://localhost:49943/ArgusTV/Control/TuneLiveStream'    

    request({
        url: url,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ Channel: { ChannelId: req.params['channel'] } })
    }, (error, response, data) => {
        if (!error && response.statusCode === 200) {
            var stream = data.LiveStream.RtspUrl;
            request(stream).pipe(res);
        } else {
            res.send('Unable to get stream: ', error);
            console.log("Got an error:", error, ", status code: ", response.statusCode);
            console.log("Tried to get:", url);
        }
    });
});


module.exports = router;