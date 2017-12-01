var regEx = {
    dev: 'www-dev.test.com',
    test: 'www-test.test.com',
    stg: 'www-stg.test.com',
    live: 'www.test.com'
};
var regExM = {
    dev: 'm-dev.test.com',
    test: 'm-test.test.com',
    stg: 'm-stg.test.com',
    live: 'm.test.com'
};

var urlMatch = function(url) {
    for (var key in regEx) {
        if (url.match(regEx[key])) {
            return ['pc', key];
        }
    }
    for (var key in regExM) {
        if (url.match(regExM[key])) {
            return ['m', key];
        }
    }
    return ['nothing']
};

var btnBind = function(url, urlArray) {
    var device = urlArray[0];

    if (device === 'nothing') {
        $('.nothing').show();
        return false
    }

    var name = urlArray[1];
    var originalUrl;
    var changeUrl;

    if (device === 'pc') {
        originalUrl = regEx[name];
        $('.pc').show().find('.'+name).addClass('on');
        $('.pc button').on('click', function() {
            if ($(this).hasClass('on')) {
                return false
            }
            changeUrl = regEx[$(this).attr('class')];
            chrome.tabs.create({
                'url': url.replace(originalUrl, changeUrl)
            });
        });
    } else if (device === 'm') {
        originalUrl = regExM[name];
        $('.m').show().find('.'+name).addClass('on');
        $('.m button').on('click', function() {
            if ($(this).hasClass('on')) {
                return false
            }
            changeUrl = regExM[$(this).attr('class')];
            chrome.tabs.create({
                'url': url.replace(originalUrl, changeUrl)
            });
        });
    }
}

function init() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        var url = tab.url;

        var urlInfo = urlMatch(url);
        // console.log(urlInfo);
        btnBind(url, urlInfo);

    });
}

document.addEventListener('DOMContentLoaded', init, false);
