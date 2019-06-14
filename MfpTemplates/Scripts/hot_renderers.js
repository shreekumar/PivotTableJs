hot_renderers = (function () {
    var callWithJQuery;

    callWithJQuery = function (pivotModule) {
        if (typeof exports === "object" && typeof module === "object") {
            return pivotModule(require("jquery"));
        } else if (typeof define === "function" && define.amd) {
            return define(["jquery"], pivotModule);
        } else {
            return pivotModule(jQuery);
        }
    };

    callWithJQuery(function ($) {
        return $.pivotUtilities.hot_renderers = {
            "HOT": function (pivotData, opts) {
                var agg, colAttrs, colKey, colKeys, defaults, r, result, row, rowAttr, rowAttrs, rowKey, rowKeys, text, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n;
                //console.log("called HOT renderer");
                defaults = {
                    localeStrings: {}
                };
                opts = $.extend(defaults, opts);
                rowKeys = pivotData.getRowKeys();
                if (rowKeys.length === 0) {
                    rowKeys.push([]);
                }
                colKeys = pivotData.getColKeys();
                if (colKeys.length === 0) {
                    colKeys.push([]);
                }
                rowAttrs = pivotData.rowAttrs;
                colAttrs = pivotData.colAttrs;
                result = [];
                for (_l = 0; _l < colAttrs.length; _l++) {
                    row = [];
                    for (_i = 0, _len = rowAttrs.length; _i < _len; _i++) {
                        rowAttr = rowAttrs[_i];
                        row.push(rowAttr);
                    }
                    if (colKeys.length === 1 && colKeys[0].length === 0) {
                        row.push(pivotData.aggregatorName);
                    } else {
                        for (_j = 0, _len1 = colKeys.length; _j < _len1; _j++) {
                            colKey = colKeys[_j];
                            //row.push(colKey.join("-"));
                            row.push(colKey[_l]);
                        }
                    }
                    result.push(row);
                }
                for (_k = 0, _len2 = rowKeys.length; _k < _len2; _k++) {
                    rowKey = rowKeys[_k];
                    row = [];
                    for (_l = 0, _len3 = rowKey.length; _l < _len3; _l++) {
                        r = rowKey[_l];
                        row.push(r);
                    }
                    for (_m = 0, _len4 = colKeys.length; _m < _len4; _m++) {
                        colKey = colKeys[_m];
                        agg = pivotData.getAggregator(rowKey, colKey);
                        if (agg.value() != null) {
                            row.push(agg.value());
                        } else {
                            row.push("");
                        }
                    }
                    result.push(row);
                }
                text = "";
                for (_n = 0, _len5 = result.length; _n < _len5; _n++) {
                    r = result[_n];
                    text += r.join("\t") + "\n";
                }

                var aDiv = $("<div>");
                /* */
                //console.log(rowAttrs.length, colAttrs.length);
                var aHotDiv = $("<div id='hotDiv1'/>");
                //$(aHotDiv).css({fontSize: "17px", backgroundColor: "cyan"})
                //heatmapScale  = chroma.scale(['#ffa', '#f50']);
                $(aHotDiv).handsontable({
                    //  data: result//objectData
                    //, startRows: 5
                    //, startCols: 3
                    colHeaders: false
                    //, font-size: 13pt
                  , minSpareRows: 0
                  , maxSpareRows: 0
                  , cells: function (row, col, prop) {
                      var cellProperties = {};
                      if (row >= colAttrs.length && col >= rowAttrs.length) {
                          //if (row>=1 && col >= rowAttrs.length) {
                          cellProperties = { type: 'numeric', format: '0.00#' };
                      } else {
                          cellProperties = { readOnly: true };
                      }
                      return cellProperties;
                  }
                  , Controller: {
                      buttons: ['move', 'add'],
                      ui: 'float'
                  }
                  , afterChange: function (changes, source) {
                      if (changes !== null) {
                          //console.log(changes); //console.log(changes[0][0], changes[0][1], changes[0][3], ':', rowAttrs, colAttrs, ':', rowKeys, colKeys, rowAttrs[changes[0][0]]);
                          for (k = 0; k < changes.length; k++) {
                              //console.log(rowKeys[changes[k][0]-colAttrs.length], ':', colKeys[changes[k][1]-rowAttrs.length] ,changes[k][3]);
                              xx = {};
                              for (r = 0; r < rowAttrs.length; r++) xx[rowAttrs[r]] = rowKeys[changes[k][0] - colAttrs.length][r];
                              for (r = 0; r < colAttrs.length; r++) xx[colAttrs[r]] = colKeys[changes[k][1] - rowAttrs.length][r];
                              //console.log( _.where(myPivotInputData, xx) );
                              _.each(_.where(myPivotInputData, xx), function (element, index, list) { list[index].value = changes[k][3] });
                              //xx['value'] = changes[k][3]
                              //console.log(xx);
                              //pivotData.processRecord(xx);
                              //myPivotInputData.push(xx);
                              //myPivotInputData[0] = xx;
                              //pivotData['_input'].push(xx);
                              //console.log(pivotData);
                              //setTimeout(pivotData.refresh() ,10);
                          }
                      }
                  }
                });

                $(aHotDiv).handsontable("loadData", result);

                $(aDiv).append("<h4>Editor (HandsOnTable)</h4>");
                $(aDiv).append(aHotDiv);
                return ($(aDiv));
            }
        };
    });

}).call(this);