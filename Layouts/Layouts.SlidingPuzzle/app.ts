
class Game extends layouts.DepObject {

    constructor() {
        super();
    }

    private _pad: Pad = new Pad();
    get pad(): Pad {
        return this._pad;
    }
    set pad(value: Pad) {
        if (this._pad != value) {
            var oldValue = this._pad;
            this._pad = value;
            this.onPropertyChanged("pad", value, oldValue);
        }
    }

    private _newGameCommand: layouts.Command;
    get newGameCommand(): layouts.Command {
        if (this._newGameCommand == null)
            this._newGameCommand = new layouts.Command((cmd, p) => this.pad = new Pad());
        return this._newGameCommand;
    }

}

class Pad extends layouts.DepObject {

    matrix: Tile[][];
    tiles: Tile[];
    moves: number = 0;

    constructor() {
        super();

        var num = [];
        for (var i = 0; i < 15; ++i) num[i] = i + 1;

        num = shuffle(num);

        this.matrix = [];
        this.tiles = [];
        for (var i = 0; i < 4; i++) {
            this.matrix[i] = [];
            for (var j = 0; j < 4; j++) {
                if (num.length > 0) {
                    this.matrix[i][j] = new Tile(num.pop(), this);
                    this.matrix[i][j].row = i;
                    this.matrix[i][j].col = j;
                    this.tiles.push(this.matrix[i][j]);
                }
            }
        }
    }

    public canMove(tile: Tile): boolean {
        for (var c = 0; c < 4; c++) {
            if (c != tile.col && this.matrix[tile.row][c] == null)
                return true;
        }
        for (var r = 0; r < 4; r++) {
            if (r != tile.row && this.matrix[r][tile.col] == null)
                return true;
        }

        return false;
    }

    public move(tile: Tile) {
        this.moves++;
        for (var c = 0; c < 4; c++) {
            if (c != tile.col && this.matrix[tile.row][c] == null) {
                var colToReset = tile.col;
                if (c > tile.col) {
                    for (var i = c; i > tile.col; i--) {
                        this.matrix[tile.row][i] = this.matrix[tile.row][i - 1];
                        this.matrix[tile.row][i].col = i;
                    }
                } else {
                    for (var i = c; i <= tile.col; i++) {
                        this.matrix[tile.row][i] = this.matrix[tile.row][i + 1];
                        this.matrix[tile.row][i].col = i;
                    }
                }
                this.matrix[tile.row][colToReset] = null;
                return;
            }
        }
        for (var r = 0; r < 4; r++) {
            if (r != tile.row && this.matrix[r][tile.col] == null) {
                var rowToReset = tile.row;
                if (r > tile.row) {
                    for (var i = r; i > tile.row; i--) {
                        this.matrix[i][tile.col] = this.matrix[i - 1][tile.col];
                        this.matrix[i][tile.col].row = i;
                    }
                } else {
                    for (var i = r; i <= tile.row; i++) {
                        this.matrix[i][tile.col] = this.matrix[i + 1][tile.col];
                        this.matrix[i][tile.col].row = i;
                    }
                }
                this.matrix[rowToReset][tile.col] = null;
                return;
            }
        }
    }

    public onMoved() {
        for (var i = 0; i < 15; i++)
            this.tiles[i].moveCommand.canExecuteChanged();

        var gameCompleted = true;
        for (var r = 0; r < 4; r++)
            for (var c = 0; c < 4; c++) {
                if (!gameCompleted)
                    break;

                if (r == 3 && c == 3)
                    break;

                if (this.matrix[r][c] == null ||
                    this.matrix[r][c].num != r * 4 + c + 1) {
                    gameCompleted = false;
                    break;
                }
            }

        if (gameCompleted)
            alert("GREAT! Game completed in {0} moves".format(this.moves.toString()));
    }
}

class Tile extends layouts.DepObject {

    constructor(public num: number, public pad: Pad) {
        super();
    }

    private _row: number;
    get row(): number {
        return this._row;
    }
    set row(value: number) {
        if (this._row != value) {
            var oldValue = this._row;
            this._row = value;
            this.onPropertyChanged("row", value, oldValue);
       }
    }

    private _col: number;
    get col(): number {
        return this._col;
    }
    set col(value: number) {
        if (this._col != value) {
            var oldValue = this._col;
            this._col = value;
            this.onPropertyChanged("col", value, oldValue);
        }
    }

    private _moveCommand: layouts.Command;
    get moveCommand(): layouts.Command {
        if (this._moveCommand == null)
            this._moveCommand = new layouts.Command((cmd, p) => this.onMove(), (cmd, p) => this.canMove());
        return this._moveCommand;
    }

    private onMove() {
        this.pad.move(this);
        this.pad.onMoved();
    }

    private canMove(): boolean {
        return this.pad.canMove(this);
    }



}

// http://stackoverflow.com/questions/962802#962890
function shuffle(array) {
    var tmp, current, top = array.length;
    if (top) while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }
    return array;
}

window.onload = () => {
    var app = new layouts.Application();
    var loader = new layouts.XamlReader();

//    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
//<Page Name="testPage">
//    <Stack VerticalAlignment="Center" HorizontalAlignment="Center" Orientation="Vertical">
//        <Grid Rows="* * * *" Columns="* * * *" Width="400" Height="400">
//            <Button class="tile" Text="{pad.tiles[0].num}" Grid.Row="{pad.tiles[0].row}" Grid.Column="{pad.tiles[0].col}" Command="{pad.tiles[0].moveCommand}"/>
//            <Button class="tile" Text="{pad.tiles[1].num}" Grid.Row="{pad.tiles[1].row}" Grid.Column="{pad.tiles[1].col}" Command="{pad.tiles[1].moveCommand}"/>
//            <Button class="tile" Text="{pad.tiles[2].num}" Grid.Row="{pad.tiles[2].row}" Grid.Column="{pad.tiles[2].col}" Command="{pad.tiles[2].moveCommand}"/>
//            <Button class="tile" Text="{pad.tiles[3].num}" Grid.Row="{pad.tiles[3].row}" Grid.Column="{pad.tiles[3].col}" Command="{pad.tiles[3].moveCommand}"/>
//            <Button class="tile" Text="{pad.tiles[4].num}" Grid.Row="{pad.tiles[4].row}" Grid.Column="{pad.tiles[4].col}" Command="{pad.tiles[4].moveCommand}"/>
//            <Button class="tile" Text="{pad.tiles[5].num}" Grid.Row="{pad.tiles[5].row}" Grid.Column="{pad.tiles[5].col}" Command="{pad.tiles[5].moveCommand}"/>
//            <Button class="tile" Text="{pad.tiles[6].num}" Grid.Row="{pad.tiles[6].row}" Grid.Column="{pad.tiles[6].col}" Command="{pad.tiles[6].moveCommand}"/>
//            <Button class="tile" Text="{pad.tiles[7].num}" Grid.Row="{pad.tiles[7].row}" Grid.Column="{pad.tiles[7].col}" Command="{pad.tiles[7].moveCommand}"/>
//            <Button class="tile" Text="{pad.tiles[8].num}" Grid.Row="{pad.tiles[8].row}" Grid.Column="{pad.tiles[8].col}" Command="{pad.tiles[8].moveCommand}"/>
//            <Button class="tile" Text="{pad.tiles[9].num}" Grid.Row="{pad.tiles[9].row}" Grid.Column="{pad.tiles[9].col}" Command="{pad.tiles[9].moveCommand}"/>
//            <Button class="tile" Text="{pad.tiles[10].num}" Grid.Row="{pad.tiles[10].row}" Grid.Column="{pad.tiles[10].col}" Command="{pad.tiles[10].moveCommand}"/>
//            <Button class="tile" Text="{pad.tiles[11].num}" Grid.Row="{pad.tiles[11].row}" Grid.Column="{pad.tiles[11].col}" Command="{pad.tiles[11].moveCommand}"/>
//            <Button class="tile" Text="{pad.tiles[12].num}" Grid.Row="{pad.tiles[12].row}" Grid.Column="{pad.tiles[12].col}" Command="{pad.tiles[12].moveCommand}"/>
//            <Button class="tile" Text="{pad.tiles[13].num}" Grid.Row="{pad.tiles[13].row}" Grid.Column="{pad.tiles[13].col}" Command="{pad.tiles[13].moveCommand}"/>
//            <Button class="tile" Text="{pad.tiles[14].num}" Grid.Row="{pad.tiles[14].row}" Grid.Column="{pad.tiles[14].col}" Command="{pad.tiles[14].moveCommand}"/>
//        </Grid>
//        <Button Text="New Game" Command="{newGameCommand}"/>
//    </Stack>
//</Page>`;
    
    //@media(min - width:320px) { /* smartphones, iPhone, portrait 480x320 phones */ }
    //@media(min - width:481px) { /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */ }
    //@media(min - width:641px) { /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */ }
    //@media(min - width:961px) { /* tablet, landscape iPad, lo-res laptops ands desktops */ }
    //@media(min - width:1025px) { /* big landscape tablets, laptops, and desktops */ }
    //@media(min - width:1281px) { /* hi-res laptops and desktops */ }

    var lmlTest = `<?xml version="1.0" encoding="utf-8" ?>
<Page Name="testPage">
    <MediaTemplateSelector>
        <DataTemplate Media="(min-width:1025px)">
            <Stack VerticalAlignment="Center" HorizontalAlignment="Center" Orientation="Vertical">
                <ItemsControl ItemsSource="{pad.tiles}" Width="400" Height="400">
                    <ItemsControl.ItemsPanel>
                        <Grid Rows="* * * *" Columns="* * * *"/>
                    </ItemsControl.ItemsPanel>
                    <DataTemplate>
                        <Button class="tile" Text="{num}" Grid.Row="{row}" Grid.Column="{col}" Command="{moveCommand}"/>
                    </DataTemplate>
                </ItemsControl>
                <Button Text="New Game" Command="{newGameCommand}"/>
            </Stack>
        </DataTemplate>
        <DataTemplate Media="(min-width:320px)">
            <Grid Rows="* Auto">
                <ItemsControl ItemsSource="{pad.tiles}">
                    <ItemsControl.ItemsPanel>
                        <Grid Rows="* * * *" Columns="* * * *"/>
                    </ItemsControl.ItemsPanel>
                    <DataTemplate>
                        <Button class="tile" Text="{num}" Grid.Row="{row}" Grid.Column="{col}" Command="{moveCommand}"/>
                    </DataTemplate>
                </ItemsControl>
                <Button Text="New Game" Command="{newGameCommand}" Grid.Row="1" Height="100"/>
            </Grid>
        </DataTemplate>
    </MediaTemplateSelector>
</Page>`;

    app.page = loader.Parse(lmlTest);
    app.page.dataContext = new Game();
};