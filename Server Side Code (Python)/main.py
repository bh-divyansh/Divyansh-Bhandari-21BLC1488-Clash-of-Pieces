from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
import uvicorn
import json

app = FastAPI()

board = [[None for _ in range(5)] for _ in range(5)]
current_turn = 'A'
players = {}
piece_orders = {'A': [], 'B': []}

def is_valid_move(row, col, newRow, newCol):
    return 0 <= newRow < 5 and 0 <= newCol < 5 and (board[newRow][newCol] is None or board[newRow][newCol]['player'] != current_turn)

def check_game_over():
    pieces_A = sum(1 for row in board for cell in row if cell and cell['player'] == 'A')
    pieces_B = sum(1 for row in board for cell in row if cell and cell['player'] == 'B')
    if pieces_A == 0 or pieces_B == 0:
        return True, 'A' if pieces_B == 0 else 'B'
    return False, None

@app.get("/")
async def get():
    with open("index.html") as f:
        return HTMLResponse(f.read())

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    player = 'A' if len(players) == 0 else 'B'
    players[player] = websocket
    await websocket.send_text(json.dumps({"type": "player", "player": player}))

    try:
        while True:
            data = await websocket.receive_text()
            move = json.loads(data)
            if move['type'] == 'start':
                pieces = move['pieces']
                piece_orders[move['player']] = pieces
                if len(piece_orders['A']) == 5 and len(piece_orders['B']) == 5:
                    for i in range(5):
                        board[0][i] = {'piece': piece_orders['A'][i], 'player': 'A'}
                        board[4][i] = {'piece': piece_orders['B'][i], 'player': 'B'}
                    await broadcast_board()
            else:
                row, col, newRow, newCol, piece, player = move['row'], move['col'], move['newRow'], move['newCol'], move['piece'], move['player']
                if is_valid_move(row, col, newRow, newCol):
                    board[row][col] = None
                    board[newRow][newCol] = {'piece': piece, 'player': player}
                    global current_turn
                    current_turn = 'B' if current_turn == 'A' else 'A'
                    game_over, winner = check_game_over()
                    if game_over:
                        await broadcast_game_over(winner)
                    else:
                        await broadcast_board()
                else:
                    await websocket.send_text(json.dumps({"type": "alert", "text": "Invalid move"}))
    except Exception as e:
        print(f"Error: {e}")
    finally:
        del players[player]

async def broadcast_board():
    for player, ws in players.items():
        await ws.send_text(json.dumps({"type": "update", "board": board, "currentTurn": current_turn}))

async def broadcast_game_over(winner):
    for player, ws in players.items():
        await ws.send_text(json.dumps({"type": "game_over", "winner": winner}))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
