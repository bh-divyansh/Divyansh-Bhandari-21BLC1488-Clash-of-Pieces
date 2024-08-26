# Divyansh Bhandari's SE Assignment Game: Clash of Pieces 🕹️
Made as an assignment for my SE Intern role application at Hitwicket 🏏 College: VIT Chennai | Roll Number: 21BLC1488
This is a simple, chess-like turn-based game built using Python with FastAPI for the backend and JavaScript for the frontend. The game supports two players (Player A and Player B) who can play against each other in separate browser tabs. The game includes features such as real-time updates, piece selection, and move validation.

![Game-ongoing-Screenshot](https://github.com/bh-divyansh/Divyansh-Bhandari-21BLC1488-Clash-of-Pieces/blob/main/assets/game-in-progress-screenshot.png?raw=true)
## Features

 - **Two-Player Game:**-   Players A and B play in separate browser tabs, interacting with the game in real-time.
-   **Turn-Based Mechanics:** Each player can only move their pieces during their turn.
-   **Real-Time Updates:** Game state and board updates are broadcast to both players instantly using WebSockets.
-   **Move Validation:** The server ensures that each move is valid and that players can only move their own pieces.

## Getting Started
The backend websocket support is provided with Python. We recommend Python version 3.10+ for running this game as this was built on that particular version but older python versions may also be supported. You can install Python 3.10+ from the [Python website](https://www.python.org/downloads/). Please install it before proceeding.

### Installation
Download the game's code from this github repository or run the following script in your terminal if you have git installed, and naviagate to the folder:

    git clone https://github.com/bh-divyansh/Clash-of-Pieces.git
    cd Clash-of-Pieces
    cd "Server Side Code (Python)"

### Set up the python environment

Create a virtual environment, activate it and install fastapi and uvicorn:

	python -m venv venv_hitwicket_assignment
	cd venv_hitwicket_assignment\Scripts\
	activate
	pip install fastapi uvicorn

  Now, Run the backend server:

    uvicorn main:app --reload
The server will be started on localhost. Keep this terminal running. Don't close it.
![Server-Terminal-Screenshot](https://github.com/bh-divyansh/Divyansh-Bhandari-21BLC1488-Clash-of-Pieces/blob/main/assets/server-terminal-screenshot.png?raw=true)
### Manually open the index.html file
Navigate to the repository folder, open the index.html file in your preferred browser. It will be opened for Player A. Open it again in the second tab, for Player B.

### Start Playing
![Game-Initialisation-Screenshot](https://github.com/bh-divyansh/Divyansh-Bhandari-21BLC1488-Clash-of-Pieces/blob/main/assets/game-initialisation-screenshot.png?raw=true)
 1. Each player chooses his combination of pieces.
 2. Game starts when both player A and player B have choosen their combinations.
 3. The first turn is of Player A. He/She clicks any piece on his/her side and then the options of moving of that particular type of piece are shown below the game board.
 4. The turn shifts to player B. He/she follows same procedure.
 5. The game continues till any player loses all their pieces.
 6. The players are informed about invalid moves or game-ending through JavaScript popups. Please don't disable them through your browser.
 7. Once game ends, both players have to click the option to end the game and then the first turn gets switched for the players. Player A becomes Player B and Player B becomes Player A.
 
 ### About the Pieces in the game
 - Pawn: Moves one block in any direction - Left, Forward, Right, Backward.
- Hero1: Moves one block in any direction - Left, Forward, Right, Backward, and kills any opponent piece in its path.
- Hero2: Moves one block diagonally in FL, FR, BL, BR directions and kills any opponent piece in its path.

Note: I am aware that the piece movement logic was different in the requirements of the game given by the company, however this is just implemented for the sake of bringing up a functional prototype in the short time frame. The logic can be updated further and more types of pieces can be introduced.
#### Invalid Moves:
Moves are considered invalid if:
- The move would take the character out of bounds. 
- The move targets a friendly character.

The following cases are not possible in this implementation as we arent taking any string input from the user. They can choose from only valid moves for that particular piece-type from the given options as buttons.
- The move is not valid for the given character type.
- The specified character doesn't exist.
### Bonus Challenges done:
The players can choose any combination of the pieces in any order while initialising. 
