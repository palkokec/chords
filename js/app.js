$(function () {

    let artists = {};
    let actualSong = data[Math.floor(Math.random() * data.length)];
    let firstLetters = {};
    data.sort((a, b) => a.name.localeCompare(b.name));

    //prepare data
    $.each(data, function (index, value) {
        $("#songList").append(
            $("<a></a>")
                .attr("href", "#")
                .data("index", index)
                .append($("<small></small>")
                    .text(value.name)
                )
        ).append(", ");

        let firstLetter = value.name.match(/[A-Z\u00C1-\u00DD\u0160\u0164\u017D\u013D]/);
        if (typeof firstLetter !== 'undefined' && firstLetter != null) {
            if (typeof firstLetters[firstLetter[0]] === 'undefined') {
                firstLetters[firstLetter[0]] = []
            }
            firstLetters[firstLetter[0]].push({ index: index, name: value.name });
        }

        if (typeof artists[value.artist] === 'undefined') {
            artists[value.artist] = []
        }
        artists[value.artist].push({ index: index, name: value.name });
    });

    sortObject = obj => Object.keys(obj).sort().reduce((res, key) => (res[key] = obj[key], res), {})

    $.each(sortObject(artists), function (index, value) {
        // console.log (index);
        // console.log (value);
        let dropright = $("<div></div>");
        dropright.
            addClass("list-group-item d-flex justify-content-between align-items-center dropright");

        dropright.
            append(
                $("<div></div>")
                    .addClass("dropdown-toggle w-100")
                    .attr("data-toggle", "dropdown")
                    .attr("aria-expanded", "false")
                    .text(index)
                    .append($("<span></span>").
                        addClass("badge badge-success badge-pill ml-1")
                        .text(value.length)
                    )
            )
        let dropdownMenu = $("<div></div>");
        dropdownMenu.addClass("dropdown-menu");
        $.each(value, function (i, v) {
            dropdownMenu.append(
                $("<a></a>")
                    .addClass("dropdown-item songDropdown")
                    .attr("href", "#")
                    .data("index", v.index)
                    .append($("<small></small>")
                        .text(v.name)
                    )
            )
        })
        dropright.append(dropdownMenu);
        dropright.appendTo($("#artists"));
    });


    $.each(sortObject(firstLetters), function (index, value) {
        let dropdown = $("<li></li>");
        dropdown.
            addClass("dropdown ml-1");
        dropdown.append(
            $("<div></div>")
                .addClass("dropdown-toggle w-100")
                .attr("data-toggle", "dropdown")
                .attr("aria-expanded", "false")
                .text(index)
        )
        let dropdownMenu = $("<div></div>");
        dropdownMenu.addClass("dropdown-menu");
        $.each(value, function (i, v) {
            dropdownMenu.append(
                $("<a></a>")
                    .addClass("dropdown-item songDropdown")
                    .attr("href", "#")
                    .data("index", v.index)
                    .append($("<small></small>")
                        .text(v.name)
                    )
            )
        })
        dropdown.append(dropdownMenu);
        dropdown.appendTo($(".breadcrumb"));
    });


    renderSong(actualSong);
    $("#songCount").text(data.length);

    $("#searchSongInput").autocomplete({
        source: data.map(item => item.name)
    });

    $("#searchSong").on("click", function (e) {
        e.preventDefault();
        let songName = $("#searchSongInput").val();
        var result = data.filter(obj => {
            return obj.name === songName
        })
        renderSong(result[0]);
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });

    $("#songList a").on("click", function (e) {
        e.preventDefault();
        let index = $(this).data("index");
        actualSong = data[index];
        renderSong(actualSong);
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });

    $("a.songDropdown").on("click", function (e) {
        e.preventDefault();
        let index = $(this).data("index");
        actualSong = data[index];
        renderSong(actualSong);
        $(this).parent().hide();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });

    $('#toPrint').on('click', function (e) {
        e.preventDefault();
        let id = $(this).data("index");
        var result = data.filter(obj => {
            return obj.id === id
        })
        printData(result[0]);
        return false;
    });

    $('#toPdf').on('click', function (e) {
        e.preventDefault();
        let id = $(this).data("index");
        var result = data.filter(obj => {
            return obj.id === id
        })
        let renderData = $("<p></p>");
        renderData.css ({"width":"100%", "height": "100%"});
        let text_layer = result[0].text_layer.split('###');
        let chord_layer = result[0].chord_layer.split('###');
        for (let index = 0; index < text_layer.length; index++) {
            let chord = typeof chord_layer[index] === 'undefined' ? '' : chord_layer[index];
            chord = chord.endsWith("<br>") ? chord : chord + "<br>";
            renderData.append(chord);
            renderData.append(text_layer[index]);
        }
        window.html2canvas = html2canvas;
        let doc = new jspdf.jsPDF({unit: 'pt', format: 'a4', orientation: 'landscape' });
        let pdfjs = renderData.get(0);//document.querySelector('#song');
        doc.html(pdfjs, {
            callback: function(doc) {
                doc.save("output.pdf");
            },
            x: 10,
            y: 10
        });
        return false;
    });

    function renderSong(s) {
        let renderData = $("<p></p>");
        let text_layer = s.text_layer.split('###');
        let chord_layer = s.chord_layer.split('###');
        for (let index = 0; index < text_layer.length; index++) {
            let chord = typeof chord_layer[index] === 'undefined' ? '' : chord_layer[index];
            chord = chord.endsWith("<br>") ? chord : chord + "<br>";
            $("<span></span>").addClass("chordSpan").html(chord).appendTo(renderData);
            $("<span></span>").addClass("textSpan").html(text_layer[index]).appendTo(renderData);
        }
        if (typeof s.tags !== 'undefined' && s.tags !== null) {
            for (let index = 0; index < s.tags.split(',').length; index++) {
                const element = s.tags.split(',')[index];
                $("<span></span>").addClass("badge badge-info").text(element).appendTo("#songTags");

            }
        }
        $("#song").html(renderData);
        $("#songAlbum").text("Album: " + s.album + " ,rok: " + s.year);
        $("#songName").text(s.artist + " - " + s.name);

        $("#toListen").data("index", s.id);
        $("#toWatch").data("index", s.id);
        $("#toPdf").data("index", s.id);
        $("#toPrint").data("index", s.id);
        $("#toListen").removeClass("d-none");
        $("#toWatch").removeClass("d-none");
        if (typeof s.mp === 'undefined' || s.mp === null) {
            $("#toListen").addClass("d-none");
        }

        if (typeof s.yl === 'undefined' || s.yl === null) {
            $("#toWatch").addClass("d-none");
        }

        $('#content').css('background-image', 'url(' + getBG() + ')');
    }

    function getBG() {
        let s = Math.random() * 383;
        s = s + 1;
        return "./images/bg/" + Math.floor(s) + ".jpg";
    }

    function printData(s) {
        console.log(s);
        let renderData = $("<p></p>");
        let text_layer = s.text_layer.split('###');
        let chord_layer = s.chord_layer.split('###');
        for (let index = 0; index < text_layer.length; index++) {
            let chord = typeof chord_layer[index] === 'undefined' ? '' : chord_layer[index];
            chord = chord.endsWith("<br>") ? chord : chord + "<br>";
            $("<span></span>").addClass("chordSpan").html(chord).appendTo(renderData);
            $("<span></span>").addClass("textSpan").html(text_layer[index]).appendTo(renderData);
        }
        if (typeof s.tags !== 'undefined' && s.tags !== null) {
            for (let index = 0; index < s.tags.split(',').length; index++) {
                const element = s.tags.split(',')[index];
                $("<span></span>").addClass("badge badge-info").text(element).appendTo("#songTags");

            }
        }
        newWin = window.open("");
        newWin.document.write(renderData.html());
        newWin.print();
        newWin.close();
    }
});