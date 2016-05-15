/**
 * Created by Paschalis Thriskos on 4/22/16.
 */

var express = require('express');
var router = express.Router();
var services = express();
var path = require('path');

// Set application options
services.set('view engine', 'ejs');
services.set('views',path.join(__dirname, '../templates'));
// Hide Express tag implementation
services.disable('x-powered-by');

router.get('/',function(request,response){
    response.render('index',{ title: 'Διαχείριση χαρτών',
        message: 'Καλημέρα κόσμε'
    });
});


router.get('/map',function(request,response){
    response.render('map.ejs');
})




// Export our router
module.exports = router;
