$(function () {
    $("#search input").keyup(function (e){
        var query = $("#search input").val();
        clearExistingResults();
        if (query.length > 0) {
            findSearchMatch(query.toLowerCase().trim());
            if ($("#seach .searchResults a.search").length == 0) {
                addFullSearchLink(query);
            }
        }

        // Enter key press handler
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            window.location.href = "/search-results?query=" + query;
        }
    });
});

function findSearchMatch(query) {
    searchResultsJson.forEach(function (result) {
        var queryWords = query.replace(/[ ,]+/g, ",").split(",");
        result.Keywords += ", " + result.Name;
        var keywords = result.Keywords.replace(/\s/g, '').split(",");
        var foundMatches = 0;
        keywords.forEach(function (keyword) {
            if (keyword.toLowerCase().lastIndexOf(query, 0) === 0) {
                addResultToList(result);
            }
            queryWords.forEach(function (queryWord) {
                if (keyword.toLowerCase().lastIndexOf(queryWord, 0) === 0) {
                    foundMatches++;
                }
            });
        });
        if (foundMatches >= 2) {
            // only add if two or more keywords match.
            addResultToList(result);
        }
    });
}

function clearExistingResults() {
    $("#search .searchResults").empty();
}

function addResultToList(result) {
    var canShow = true;

    $("#search .searchResults .result").each(function () {
        if ($(this).find("a").text() == result.Name) {
            canShow = false;
        }
    });

    if (canShow) {
        $("#search .searchResults").append($('<div class="result"><a href="' + result.Link + '">' + result.Name + '</a>' + result.Description + '</div>'));
    }
}

function addFullSearchLink(query) {
    $("#search .searchResults").append($('<div class="fullResults"><a class="button search" href="/search-results?query=' + query + '">See all Results</a></div>'));
}