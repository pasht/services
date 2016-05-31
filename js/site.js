/*
 * object.watch polyfill
 *
 * 2012-04-03
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

// object.watch
if (!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, "watch", {
        enumerable: false
        , configurable: true
        , writable: false
        , value: function (prop, handler) {
            var
                oldval = this[prop]
                , newval = oldval
                , getter = function () {
                    return newval;
                }
                , setter = function (val) {
                    oldval = newval;
                    return newval = handler.call(this, prop, oldval, val);
                }
                ;

            if (delete this[prop]) { // can't watch constants
                Object.defineProperty(this, prop, {
                    get: getter
                    , set: setter
                    , enumerable: true
                    , configurable: true
                });
            }
        }
    });
}

// object.unwatch
if (!Object.prototype.unwatch) {
    Object.defineProperty(Object.prototype, "unwatch", {
        enumerable: false
        , configurable: true
        , writable: false
        , value: function (prop) {
            var val = this[prop];
            delete this[prop]; // remove accessors
            this[prop] = val;
        }
    });
}
/**
 * JQuery watch
 * @param id - jQuery selector
 * @param fn - function to call when
 * @returns {*}
 */
jQuery.fn.watch = function( id, fn ) {
    return this.each(function(){
        var self = this;
        var oldVal = self[id];
        $(self).data(
            'watch_timer',
            setInterval(function(){
                if (self[id] !== oldVal) {
                    fn.call(self, id, oldVal, self[id]);
                    oldVal = self[id];
                }
            }, 100)
        );
    });
};

// Examples at http://james.padolsey.com/javascript/monitoring-dom-properties/
/**
 * JQuery unwatch
 * @param id - JQuery selector
 * @returns {*}
 */
jQuery.fn.unwatch = function( id ) {
    return this.each(function(){
        clearInterval( $(this).data('watch_timer') );
    });
};

/**
 * jQuery event Event Registration
 * @param fn - Handler
 * @returns {*}
 */
jQuery.fn.valuechange = function(fn) {
    return this.bind('valuechange', fn);
};

jQuery.event.special.valuechange = {

    setup: function() { // JQuery set up event
        jQuery(this).watch('value', function(){
            jQuery.event.handle.call(this, {type:'valuechange'});
        });

    },
    teardown: function() { //JQuery tear down event
        jQuery(this).unwatch('value');
    }
};


// Change Password Module
var CHPWDModule = (function($){

    var _MODULE = {};
    var disablesubmit = function(){
        $('input[type="submit"]').disable();
    };
    // Validation handlers
    var checkemptyfield = function(){
        var $this = $(this);
        if($this.val().trim().length==0)
            disablesubmit();    // Disable form submission
    };


    //Initialize module
    _MODULE.init = function(){
        $('#email').focusout(function(e){
            var $this = $(this);
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!re.test($this.val())){
                $.growl.warning({ message: "Η δ/νση ηλ. ταχυδρομείου που πληκτρολογήσατε δεν είναι σωστή",
                    location: "tr",size:'large',title:'Λάθος πληκρολόγησης:',});
                e.preventDefault();
            }
        });

        $('#username','#email').bind('valuechange',function(){
            console.log('Called');
            $el = $(this);
            if ($el.val().length=0)
                $('input[type="submit"]').attr('disabled',true);
            else
                $('input[type="submit"]').removeAttr('disabled');
        });

        $('form').submit(function(evt){
            var $form=$(this)
            // submit form using ajax call
            $.post('/services/rest/resetpwd',
                {
                    user: $form.find('#username').val(),
                    email: $form.find('#email').val()
                }
            )
                .always(function(data){
                    if(data.status==200)
                        $.growl.notice({message:'Επιτυχής ανάκτηση συνθηματικού. <br>Σας έχει αποσταλεί ηλ. αλληλογραφία με τον νέο κωδικό',
                            location:'tr',
                            size:'large',title:''
                            ,duration:6400});
                    else
                        $.growl.error({message: data.responseJSON.error, location: 'tr',size:'large',title:'Κρίσημο λάθος:'});
                });
            evt.preventDefault();
        });
    };

    return _MODULE;
})($);

// News Module
var NEWSModule = (function($) {
    var _MODULE = {};

    //*******************************************************


    function init() {
        var params = window.location.href.split('.html')[1];
        var spinner = new Spinner({scale:2.5}).spin($('#news')[0]);
        $.ajax({
            url: '/services/rest/news' + params,
            type: 'GET'
        }).success(function (data) {
            $('#title>h4').html(data.page_title);
            $('#title').css('visibility', 'visible');
            var t = $('#news > tbody');
            $.each(data.news, function (i, row) {
                // Create row
                var _row = $('<tr><td>' + row.Since + '</td>' +
                    '<td>' + row.category + '</td>' +
                    '<td>' + row.content + '</td>');
                // Create link content
                if (row.file_link)
                    _row.append('<td><a href="' + row.file_link + '" target="_blank">Αρχείο</a></td>' + '</tr>');
                else
                    _row.append('<td></td>');
                // Append row to table
                t.append(_row);
            });

            $('#news').dynatable({  // Show table
                inputs: {
                    recordCountText: 'Εμφάνιση ',
                    paginationPrev: 'Προηγούμενη',
                    paginationNext: 'Επόμενη',
                    perPageText: 'Εγγραφές ανά σελίδα: ',
                    processingText: ''
                },
                readers: {
                    'Ημνία': function (el, record) {
                        s = el.innerHTML.split('/');
                        var dateObj = new Date(Number(s[2]), Number(s[1]) - 1, Number(s[0]));
                        return dateObj;
                    }
                },
                writers: {
                    'Ημνία': function (record) {
                        objDate = record.Ημνία;
                        d = objDate.getDate();
                        m = objDate.getMonth() + 1;
                        y = objDate.getFullYear();

                        // ensure we have 2 digits for days/months
                        d = (d.toString().length < 2) ? '0' + d : d;
                        m = (m.toString().length < 2) ? '0' + m : m;

                        return d + '/' + m + '/' + y;
                    }
                }
            })
            .on('dynatable:afterUpdate', function (evt) {   // Stop spinner after rendering
                spinner.stop();
            });
            spinner.stop();
        });
    }
    /********************************************************/

    //Initialize module
    _MODULE.getNews = init;

    return _MODULE;
})($);


// Initialize handlers after DOM construction
$(function(){
    // Change Password Page
    if($('#login').length)
        $('#login',function(){
            CHPWDModule.init();
        });

    // News Page
    if($('#news').length)
        $('#news',function(){
            NEWSModule.init();
        });
});