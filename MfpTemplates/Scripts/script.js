$(function () {
    $.getJSON("/Content/pivot_source/mps.json", function (mps) {
        $("#pivotContainer").pivotUI(mps, {
            rows: ["location"],
            cols: ["band"],
            aggregatorName: "Count",
            //vals: ["Age"],
            rendererName: "Heatmap",
            //renderers: $.pivotUtilities.hot_renderers,
            rendererOptions: {
                table: {
                    clickCallback: function (e, value, filters, pivotData) {
                        //var names = [];
                        //pivotData.forEachMatchingRecord(filters, function (record) {
                        //    names.push(record.Name);
                        //});
                        var cs = 'editable_' + $(e.srcElement).attr('class').replace(' ', '_').replace(' ', '_');
                        var v = value == null ? "" : value;
                        if (!$(e.srcElement).children().length > 0) {
                            $(e.srcElement).empty();
                            $(e.srcElement).append("<input class='" + cs + "' type='text' value='" + v + "'/>");
                            $(e.srcElement).find('input').focus().keypress(function (event) {
                                var keycode = (event.keyCode ? event.keyCode : event.which);
                                if (keycode == '13') {
                                    $(e.srcElement).attr("data-value", parseInt($(e.srcElement).children('input').val()));
                                    $(e.srcElement).html(parseInt($(e.srcElement).children('input').val()));
                                    $(e.srcElement).remove('input');
                                    calculateRow(e.srcElement);
                                    calculateColumn();

                                }
                            });
                        }
                        //console.log(pivotData);
                    }
                }
            }
        });
    });
});

$(document).keyup(function (e) {
    if (e.key === "Escape") { // escape key maps to keycode `27`
        $(".pvtTable tr td").each(function (i, v) {
            if ($(v).children().length > 0) {
                $(v).html($($(v).children()).val());
                $(v).remove('input');
            }
        });
    }
});

function calculateRow(td) {
    $tr = $(td).parent();
    $lastTd = $tr.find("td:last");
    var sum = 0;
    $tr.find('td').not(':last').each(function (i, v) {
        var data = ($(v).attr("data-value") == "null" ? 0 : $(v).attr("data-value"));
        sum += parseInt(data);
    });
    $lastTd.attr("data-value");
    $lastTd.html(sum);
}

function calculateColumn() {

    $(".pvtTable tbody tr:first td").each(function (index, val) {
        var total = 0;
        $(".pvtTable tbody tr").not(':last').each(function (i, v) {
            var value = $('td.pvtVal', this).eq(index).attr("data-value");
            var data = (value == "null" ? 0 : value);
            total += parseInt(data);
        });
        $('.pvtTable tbody tr td.colTotal').eq(index).attr("data-value", total);
        $('.pvtTable tbody tr td.colTotal').eq(index).html(total);
    });

    var grandTotal = 0;
    $(".pvtTable tbody tr td.colTotal").each(function (i, v) {
        var d = ($(v).attr("data-value") == "null" ? 0 : $(v).attr("data-value"));
        grandTotal += parseInt(d);
    });
    $("td.pvtGrandTotal").attr("data-value", grandTotal);
    $("td.pvtGrandTotal").html(grandTotal);
}