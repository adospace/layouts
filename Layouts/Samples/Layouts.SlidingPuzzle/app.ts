
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