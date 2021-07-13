
(function () {

    var domain = window.location.hostname,
        hasparams = window.location.href.indexOf('utm_') !== -1,
        tempParts,
        utmparams = {
            'utm_source': window.location.hostname.replace("www.",""),
            'utm_medium': 'referral',
            'utm_content': window.location.pathname,
            'utm_campaign': ''
        },
        queryParams = ['utm_source', 'utm_medium', 'utm_content', 'utm_campaign'],
        links = document.querySelectorAll('a');

    for (var linkIndex = 0; linkIndex < links.length; linkIndex++) {
        var decoratedUrl = decorateUrl(links[linkIndex].href)
        if (decoratedUrl) {
            links[linkIndex].href = decoratedUrl;
        }
    }

    function decorateUrl(urlToDecorate) {
        var paramsInUrl = window.location.href.split("?");

        if (paramsInUrl.length > 1) {
            var allParams = paramsInUrl[1].split("&");
        }

        tempParts = urlToDecorate.split("#");
        var tempUrlToDecorate = tempParts[0];

        var position = 0;
        var cleanUrlToDecorate = urlToDecorate.replace(window.location.href, "");
        if (cleanUrlToDecorate.indexOf("#", position) === position) {
            return false;
        }

        if (hasparams) {
            tempUrlToDecorate = tempUrlToDecorate.replace(/utm[^&]*(?:&utm[^&]*)*&(?=(?!utm[^\s&=]*=)[^\s&=]+=)|\?utm[^&]*(?:&utm[^&]*)*$|&utm[^&]*/gi, "");
        } else {
            if (tempUrlToDecorate.indexOf('utm_') !== -1) {
                tempUrlToDecorate = tempUrlToDecorate.replace(/utm[^&]*(?:&utm[^&]*)*&(?=(?!utm[^\s&=]*=)[^\s&=]+=)|\?utm[^&]*(?:&utm[^&]*)*$|&utm[^&]*/gi, "");
            }
            if (tempUrlToDecorate.indexOf(domain) > -1) {
                return false;
            }
        }

        tempUrlToDecorate = (tempUrlToDecorate.indexOf('?') === -1) ? tempUrlToDecorate + '?' : tempUrlToDecorate + '&';

        var collectedQueryParams = [];
        for (var queryIndex = 0; queryIndex < queryParams.length; queryIndex++) {
            if (getQueryParam(queryParams[queryIndex]) && !(queryParams[queryIndex] === 'utm_source' || queryParams[queryIndex] === 'utm_medium')) {
                collectedQueryParams.push(queryParams[queryIndex] + '=' + getQueryParam(queryParams[queryIndex]));
             } else if (utmparams[queryParams[queryIndex]]) {
                 collectedQueryParams.push(queryParams[queryIndex] + '=' + utmparams[queryParams[queryIndex]]);
             }
        }
        tempParts[0] = tempUrlToDecorate + collectedQueryParams.join('&');
        if (allParams) {
            allParams.forEach(function (param) {
                if (param.indexOf('utm_') === -1) {
                    tempParts[0] = tempParts[0] + "&" + param;
                    console.log(param);
                }
            });
        }
        return tempParts.join("#");
    }

    function getQueryParam(name) {
        if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(window.location.search))
            return decodeURIComponent(name[1]);
    }
})();