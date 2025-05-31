    const cells = document.querySelectorAll(".cell");
    const statusText = document.getElementById("status");
    const resetBtn = document.getElementById("resetBtn");
    const boardEl = document.getElementById("board");

    let currentPlayer = "X";
    let gameActive = true;
    let board = ["", "", "", "", "", "", "", "", ""];

    const winCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    function drawWinLine(combo) {
      // Remove any existing win lines before drawing new one
      document.querySelectorAll(".win-line").forEach(line => line.remove());

      const [start, , end] = combo;
      const startCell = cells[start];
      const endCell = cells[end];

      const startRect = startCell.getBoundingClientRect();
      const endRect = endCell.getBoundingClientRect();

      const boardRect = boardEl.getBoundingClientRect();
      const x1 = startRect.left + startRect.width / 2 - boardRect.left;
      const y1 = startRect.top + startRect.height / 2 - boardRect.top;
      const x2 = endRect.left + endRect.width / 2 - boardRect.left;
      const y2 = endRect.top + endRect.height / 2 - boardRect.top;

      const length = Math.hypot(x2 - x1, y2 - y1);
      const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

      const line = document.createElement("div");
      line.classList.add("win-line");
      line.style.width = `${length}px`;
      line.style.height = "6px";
      line.style.top = `${y1}px`;
      line.style.left = `${x1}px`;
      line.style.transformOrigin = "left center";
      line.style.transform = `rotate(${angle}deg) scaleX(0)`;
      boardEl.appendChild(line);

      // Animate line drawing by scaling X from 0 to 1
      setTimeout(() => {
        line.style.transform = `rotate(${angle}deg) scaleX(1)`;
      }, 50);
    }

    function checkWin() {
      for (let combo of winCombos) {
        const [a, b, c] = combo;

        if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
          // Add class to status text for glowing celebration
          statusText.classList.add("status-win");
          statusText.textContent = `🎉 Congratulations Player ${board[a]} wins! 🎉`;
          gameActive = false;
          drawWinLine(combo);
          return true;
        }
      }

      if (!board.includes("")) {
        statusText.textContent = "It's a draw! Well played everyone!";
        gameActive = false;
        return true;
      }

      // Remove glowing effect if game continues
      statusText.classList.remove("status-win");
      return false;
    }

    function handleClick(e) {
      const index = e.target.dataset.index;
      if (!gameActive || board[index]) return;

      board[index] = currentPlayer;
      e.target.textContent = currentPlayer;

      if (!checkWin()) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `Player ${currentPlayer}'s turn`;
      }
    }

    function resetGame() {
      board = ["", "", "", "", "", "", "", "", ""];
      currentPlayer = "X";
      gameActive = true;
      cells.forEach(cell => cell.textContent = "");
      document.querySelectorAll(".win-line").forEach(line => line.remove());
      statusText.textContent = "Player X's turn";
      statusText.classList.remove("status-win");
    }

    cells.forEach(cell => cell.addEventListener("click", handleClick));
    resetBtn.addEventListener("click", resetGame);