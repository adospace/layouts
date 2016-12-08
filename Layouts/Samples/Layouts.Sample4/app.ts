
class SampleRecordModel {

    static loadSampleData(gridView: layouts.controls.GridView) {
        var jsonFile = new XMLHttpRequest();
        jsonFile.onreadystatechange = (ev) => {
            if (jsonFile.readyState == 4 && jsonFile.status == 200) {
                var jsonContent = JSON.parse(jsonFile.responseText);
                var rows = jsonContent.data;
                gridView.rowsSource = new layouts.ObservableCollection<Object>(rows);

                var columns: string[] = jsonContent.cols;
                var gridColumns = new layouts.ObservableCollection<layouts.controls.GridViewColumn>();
                columns.forEach(c=> {
                    var gridColumn = new layouts.controls.GridViewColumn();
                    gridColumn.name = c;
                    gridColumns.add(gridColumn);
                });
                gridView.columns = gridColumns;                
            }
        }
        jsonFile.open("GET", "data/records.txt", true);
        jsonFile.send();
    }
}


window.onload = () => {
    var app = new layouts.Application();
    var page = new layouts.controls.Page();
    //page.sizeToContent = layouts.SizeToContent.None;
    var gridView = new layouts.controls.GridView();

    page.child = gridView;
    app.page = page;

    SampleRecordModel.loadSampleData(gridView);
    

};