app.controller('TableCtrl', function($scope){

    $scope.tablePaneSettings = {};

    $scope.tableSettings = {
        url: "http://hotell.difi.no/api/jsonp/brreg/enhetsregisteret",
        jsonp: "callback",
        path: {
            entries: "entries",
            total: "posts",
            page: "page",
            pages: "pages",
            count: "count",
            start: "start",
            sortcol: "sortcol",
            sortdir: "sortdir"
        },
        label: "Products",
        columns: [{
            name: "Org.nr",
            col: 'orgnr',
            searchable: true,
            sortable: true,
            resizable: true,
            width: "100px"
        },
        {
            name: "Navn",
            col: 'navn',
            searchable: true,
            sortable: true,
            resizable: true,
            width: "450px"
        },
        {
            name: "Adresse",
            col: "forretningsadr",
            searchable: true,
            sortable: true,
            resizable: true
        }]
    };

});