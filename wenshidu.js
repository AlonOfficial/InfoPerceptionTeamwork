// var Wenshiduinfo = localStorage.getItem('data');
function csv2table(csv) {
    var html = "";
    var rows = csv.split('\n');
    rows.pop(); // 最后一行没用的
    rows.forEach(function(row, idx) {
        var columns = row.split(',');
        columns.unshift(idx+1); // 添加行索引
        if(idx == 0) { // 添加列索引
            html += '<tr>';
            for(var i=0; i<columns.length; i++) {
                html += '<th>' + (i==0?'':String.fromCharCode(65+i-1)) + '</th>';
            }
            html += '</tr>';
        }
        html += '<tr>';
        columns.forEach(function(column) {
            html += '<td>'+column+'</td>';
        });
        html += '</tr>';
    });
    return html;
}

function showfile(obj) {
    if(!obj.files) {
        return;
    }
    var f = obj.files[0];
    console.log(f);
    var reader = new FileReader();
    reader.readAsBinaryString(f);
    reader.onload = function(e) {
        var data = e.target.result;
        excelFile = XLSX.read(data, {
            type: 'binary'
        });

        var csv = XLSX.utils.sheet_to_csv(excelFile.Sheets[excelFile.SheetNames[0]]);
        var innerHTML = csv2table(csv);
        localStorage.setItem('data', innerHTML);
        location.reload();
    }
}
