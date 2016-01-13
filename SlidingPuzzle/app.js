var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        _super.call(this);
        this._pad = new Pad();
    }
    Object.defineProperty(Game.prototype, "pad", {
        get: function () {
            return this._pad;
        },
        set: function (value) {
            if (this._pad != value) {
                var oldValue = this._pad;
                this._pad = value;
                this.onPropertyChanged("pad", value, oldValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "newGameCommand", {
        get: function () {
            var _this = this;
            if (this._newGameCommand == null)
                this._newGameCommand = new layouts.Command(function (cmd, p) { return _this.pad = new Pad(); });
            return this._newGameCommand;
        },
        enumerable: true,
        configurable: true
    });
    return Game;
})(layouts.DepObject);
var Pad = (function (_super) {
    __extends(Pad, _super);
    function Pad() {
        _super.call(this);
        this.moves = 0;
        var num = [];
        for (var i = 0; i < 15; ++i)
            num[i] = i + 1;
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
    Pad.prototype.canMove = function (tile) {
        for (var c = 0; c < 4; c++) {
            if (c != tile.col && this.matrix[tile.row][c] == null)
                return true;
        }
        for (var r = 0; r < 4; r++) {
            if (r != tile.row && this.matrix[r][tile.col] == null)
                return true;
        }
        return false;
    };
    Pad.prototype.move = function (tile) {
        this.moves++;
        for (var c = 0; c < 4; c++) {
            if (c != tile.col && this.matrix[tile.row][c] == null) {
                var colToReset = tile.col;
                if (c > tile.col) {
                    for (var i = c; i > tile.col; i--) {
                        this.matrix[tile.row][i] = this.matrix[tile.row][i - 1];
                        this.matrix[tile.row][i].col = i;
                    }
                }
                else {
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
                }
                else {
                    for (var i = r; i <= tile.row; i++) {
                        this.matrix[i][tile.col] = this.matrix[i + 1][tile.col];
                        this.matrix[i][tile.col].row = i;
                    }
                }
                this.matrix[rowToReset][tile.col] = null;
                return;
            }
        }
    };
    Pad.prototype.onMoved = function () {
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
    };
    return Pad;
})(layouts.DepObject);
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile(num, pad) {
        _super.call(this);
        this.num = num;
        this.pad = pad;
    }
    Object.defineProperty(Tile.prototype, "row", {
        get: function () {
            return this._row;
        },
        set: function (value) {
            if (this._row != value) {
                var oldValue = this._row;
                this._row = value;
                this.onPropertyChanged("row", value, oldValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "col", {
        get: function () {
            return this._col;
        },
        set: function (value) {
            if (this._col != value) {
                var oldValue = this._col;
                this._col = value;
                this.onPropertyChanged("col", value, oldValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "moveCommand", {
        get: function () {
            var _this = this;
            if (this._moveCommand == null)
                this._moveCommand = new layouts.Command(function (cmd, p) { return _this.onMove(); }, function (cmd, p) { return _this.canMove(); });
            return this._moveCommand;
        },
        enumerable: true,
        configurable: true
    });
    Tile.prototype.onMove = function () {
        this.pad.move(this);
        this.pad.onMoved();
    };
    Tile.prototype.canMove = function () {
        return this.pad.canMove(this);
    };
    return Tile;
})(layouts.DepObject);
// http://stackoverflow.com/questions/962802#962890
function shuffle(array) {
    var tmp, current, top = array.length;
    if (top)
        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
    return array;
}
window.onload = function () {
    var app = new layouts.Application();
    var loader = new layouts.XamlReader();
    var lmlTest = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<Page Name=\"testPage\">\n    <Stack VerticalAlignment=\"Center\" HorizontalAlignment=\"Center\" Orientation=\"Vertical\">\n        <Grid Rows=\"* * * *\" Columns=\"* * * *\" Width=\"400\" Height=\"400\">\n            <Button class=\"tile\" Text=\"{pad.tiles[0].num}\" Grid.Row=\"{pad.tiles[0].row}\" Grid.Column=\"{pad.tiles[0].col}\" Command=\"{pad.tiles[0].moveCommand}\"/>\n            <Button class=\"tile\" Text=\"{pad.tiles[1].num}\" Grid.Row=\"{pad.tiles[1].row}\" Grid.Column=\"{pad.tiles[1].col}\" Command=\"{pad.tiles[1].moveCommand}\"/>\n            <Button class=\"tile\" Text=\"{pad.tiles[2].num}\" Grid.Row=\"{pad.tiles[2].row}\" Grid.Column=\"{pad.tiles[2].col}\" Command=\"{pad.tiles[2].moveCommand}\"/>\n            <Button class=\"tile\" Text=\"{pad.tiles[3].num}\" Grid.Row=\"{pad.tiles[3].row}\" Grid.Column=\"{pad.tiles[3].col}\" Command=\"{pad.tiles[3].moveCommand}\"/>\n            <Button class=\"tile\" Text=\"{pad.tiles[4].num}\" Grid.Row=\"{pad.tiles[4].row}\" Grid.Column=\"{pad.tiles[4].col}\" Command=\"{pad.tiles[4].moveCommand}\"/>\n            <Button class=\"tile\" Text=\"{pad.tiles[5].num}\" Grid.Row=\"{pad.tiles[5].row}\" Grid.Column=\"{pad.tiles[5].col}\" Command=\"{pad.tiles[5].moveCommand}\"/>\n            <Button class=\"tile\" Text=\"{pad.tiles[6].num}\" Grid.Row=\"{pad.tiles[6].row}\" Grid.Column=\"{pad.tiles[6].col}\" Command=\"{pad.tiles[6].moveCommand}\"/>\n            <Button class=\"tile\" Text=\"{pad.tiles[7].num}\" Grid.Row=\"{pad.tiles[7].row}\" Grid.Column=\"{pad.tiles[7].col}\" Command=\"{pad.tiles[7].moveCommand}\"/>\n            <Button class=\"tile\" Text=\"{pad.tiles[8].num}\" Grid.Row=\"{pad.tiles[8].row}\" Grid.Column=\"{pad.tiles[8].col}\" Command=\"{pad.tiles[8].moveCommand}\"/>\n            <Button class=\"tile\" Text=\"{pad.tiles[9].num}\" Grid.Row=\"{pad.tiles[9].row}\" Grid.Column=\"{pad.tiles[9].col}\" Command=\"{pad.tiles[9].moveCommand}\"/>\n            <Button class=\"tile\" Text=\"{pad.tiles[10].num}\" Grid.Row=\"{pad.tiles[10].row}\" Grid.Column=\"{pad.tiles[10].col}\" Command=\"{pad.tiles[10].moveCommand}\"/>\n            <Button class=\"tile\" Text=\"{pad.tiles[11].num}\" Grid.Row=\"{pad.tiles[11].row}\" Grid.Column=\"{pad.tiles[11].col}\" Command=\"{pad.tiles[11].moveCommand}\"/>\n            <Button class=\"tile\" Text=\"{pad.tiles[12].num}\" Grid.Row=\"{pad.tiles[12].row}\" Grid.Column=\"{pad.tiles[12].col}\" Command=\"{pad.tiles[12].moveCommand}\"/>\n            <Button class=\"tile\" Text=\"{pad.tiles[13].num}\" Grid.Row=\"{pad.tiles[13].row}\" Grid.Column=\"{pad.tiles[13].col}\" Command=\"{pad.tiles[13].moveCommand}\"/>\n            <Button class=\"tile\" Text=\"{pad.tiles[14].num}\" Grid.Row=\"{pad.tiles[14].row}\" Grid.Column=\"{pad.tiles[14].col}\" Command=\"{pad.tiles[14].moveCommand}\"/>\n        </Grid>\n        <Button Text=\"New Game\" Command=\"{newGameCommand}\"/>\n    </Stack>\n</Page>";
    app.page = loader.Parse(lmlTest);
    app.page.dataContext = new Game();
};
//# sourceMappingURL=app.js.map