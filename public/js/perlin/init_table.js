
$(function(){

    _.templateSettings = {
      interpolate : /\{\{(.+?)\}\}/g
    };

    var ct_txt = $('#cell_data_table_row').html()
    var cell_template = _.template(ct_txt);
    $('#cell_data_table_row').html('{{ cells }}');

    var rt_txt = $('#cell_data_table').html();
    var row_template = _.template(rt_txt);
    $('#cell_data_table').html('');

    var rows = [];

    for (var r = 0; r < 10; ++r){
        var cells = [];

        for (var c = 0; c < 10; ++c){
            cells.push(cell_template({r: r, c: c}));
        }

        rows.push(row_template({cells: cells.join('\n')}));
    }

    $('#cell_data_table').html(rows.join(''));
});

