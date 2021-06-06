

var board = null
var game = new Chess()
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'
var $board = $('#myBoard')
var squareToHighlight = null
var squareClass = 'square-55d63'
var depth = 2 

function removeHighlights (color) {
    $board.find('.' + squareClass)
        .removeClass('highlight-' + color)
}

function removeGreySquares () {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare (square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for White
  if (piece.search(/^b/) !== -1) return false
}

function makeRandomMove () {
    console.log(game.board())
    var oBoard = game.board()
    var cBoard = []
    for (var i = 0; i < oBoard.length; i++) {
        var tRow = []
        for (var j =0 ; j < oBoard[i].length; j++) {
            var pos = oBoard[i][j]
            if (pos == null) {
                tRow.push("--")
            }
            else if (pos.color == 'w') {
                if (pos.type == 'r') {
                    tRow.push("wR")
                }
                else if (pos.type == 'n') {
                    tRow.push("wH")
                }
                else if (pos.type == 'b') {
                    tRow.push("wB")
                }
                else if (pos.type == 'q') {
                    tRow.push("wQ")
                }
                else if (pos.type == 'k') {
                    tRow.push("wK")
                }
                else if (pos.type == 'p') {
                    tRow.push("wP")
                }
            }
            else if (pos.color == 'b') {
                if (pos.type == 'r') {
                    tRow.push("bR")
                }
                else if (pos.type == 'n') {
                    tRow.push("bH")
                }
                else if (pos.type == 'b') {
                    tRow.push("bB")
                }
                else if (pos.type == 'q') {
                    tRow.push("bQ")
                }
                else if (pos.type == 'k') {
                    tRow.push("bK")
                }
                else if (pos.type == 'p') {
                    tRow.push("bP")
                }
            }
        }
        cBoard.push(tRow)
    }
    console.log(cBoard)
  var possibleMoves = game.moves()
    // var term = $form.find( "input[name='s']" ).val()
    var url = "https://chessai-api.herokuapp.com/play"
    var res = ""
    $.ajaxSetup({
        url: url,
        type: "POST",
        data: JSON.stringify({
            depth: depth,
            board: cBoard
        }),
        async: false,
        dataType: 'JSON',
        timeout: 10000,
        xhrFields: {
           withCredentials: true
        },
        crossDomain: true,
        // contentType: 'application/json; charset=utf-8',
        contentType: 'application/json',
        success: function(result) {
            res = result;
            return true ;
        },
    });
    $("div.spanner").addClass("show");
    // $("div.overlay").addClass("show");
    $.ajax();
    $("div.spanner").removeClass("show");
    // $("div.overlay").removeClass("show");
    console.log(res);
    var src = res.aiMove.moveSrc.toLowerCase();
    var des = res.aiMove.moveDes.toLowerCase();
    $("#aiScore").text("AI Score: " + res.aiScore);
    $("#uScore").text("User Score: " + res.userScore);
    console.log(src, "---", des)
    var move = game.move({
        from: src,
        to: des,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
      })
      console.log("M2", move)
      if (move === null) return 'snapback'
    // highlight black's move
    removeHighlights('black')
    $board.find('.square-' + move.from).addClass('highlight-black')
    squareToHighlight = move.to
    // .done(function(data) {
    //     callback(data);
    // })
    // .fail(function(err) {
    //     callback(err);
    // });
    
    // var posting = $.post( url, { 
    //     depth: depth,
    //     board: cBoard,
    //  } );
    // console.log(posting)

  // game over
//   if (possibleMoves.length === 0) return

//   var randomIdx = Math.floor(Math.random() * possibleMoves.length)
//   game.move(possibleMoves[randomIdx])
  board.position(game.fen())

}

function onDrop (source, target) {
  // see if the move is legal
  console.log(source, "---", target)
  console.log("M!", move)
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })
  console.log("M!", move)

  // illegal move
  if (move === null) return 'snapback'
  // highlight white's move
  removeHighlights('white')
  $board.find('.square-' + source).addClass('highlight-white')
  $board.find('.square-' + target).addClass('highlight-white')

  // make random legal move for black
  makeRandomMove();
//   window.setTimeout(makeRandomMove, 250)
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}
function onMouseoverSquare (square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
      square: square,
      verbose: true
    })
  
    // exit if there are no moves available for this square
    if (moves.length === 0) return
  
    // highlight the square they moused over
    greySquare(square)
  
    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to)
    }
}

function onMouseoutSquare (square, piece) {
    removeGreySquares()
}
function onMoveEnd () {
    $board.find('.square-' + squareToHighlight)
        .addClass('highlight-black')
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onMoveEnd: onMoveEnd,
  onSnapEnd: onSnapEnd
}
board = Chessboard('myBoard', config)
function diffucltySet(d) {
    depth = d ;
    if (depth == 1) {
        $("#dButton").text('Easy')
    }
    else if (depth == 2) {
        $("#dButton").text('Medium')
    }
    else if (depth == 3) {
        $("#dButton").text('Hard')
    }
    document.addEventListener('touchmove',preventDefault, false);
    // // prevent scrolling from outside of input field
    // $(document).on('touchstart', function(e) {
    //     if (e.target.nodeName !== 'INPUT') {
    //         e.preventDefault();
    //     }
    // });

    // // prevent scrolling from within input field
    // $(document).on('touchmove', function(e) {
    //     if (e.target.nodeName == 'INPUT') {
    //         e.preventDefault();
    //     }
    // });
}
