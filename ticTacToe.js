import { createCanvas } from 'canvas';
import { EmbedBuilder } from 'discord.js';
import { AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

async function drawBoard(gameId, board = ['-', '-', '-', '-', '-', '-', '-', '-', '-']) {
	const winner = checkWinner(board);

	let signPlay = board.filter((item) => item !== '-').length % 2 === 0 ? 'X' : 'O';
	if (winner !== null) {
		signPlay = winner[0] === 'X' ? 'X' : 'O';
	}
	const bgColor = winner !== null ? '#1D1D1D' : '#000';
	const canvas = createCanvas(300, 300);
	const ctx = canvas.getContext('2d');

	// Définir le fond noir
	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Dessiner la grille avec des barres blanches
	ctx.strokeStyle = '#FFF';
	ctx.lineWidth = 8;
	ctx.strokeRect(0, 0, 300, 300);
	ctx.lineWidth = 4;
	for (let i = 1; i < 3; i++) {
		ctx.beginPath();
		ctx.moveTo(i * 100, 0);
		ctx.lineTo(i * 100, 300);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, i * 100);
		ctx.lineTo(300, i * 100);
		ctx.stroke();
	}

	// Dessiner les X et O
	ctx.lineWidth = 8;
	for (let i = 0; i < 9; i++) {
		if (board[i] === '-') continue;
		if (winner !== null && winner[1].includes(i)) {
			if (winner[0] === 'X') {
				ctx.fillStyle = '#58B748';
			} else {
				ctx.fillStyle = '#447ADA';
			}
		} else {
			ctx.fillStyle = '#FFF';
		}

		const x = (i % 3) * 100 + 50;
		const y = Math.floor(i / 3) * 100 + 50;
		const text = board[i];
		ctx.font = '80px sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(text, x, y);
	}

	const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'tic-tac-toe.png' });

	const createButton = (index, label = '-', disabled = false) =>
		new ButtonBuilder()
			.setLabel(label)
			.setCustomId(`${index}|${gameId}|${board[index]}`)
			.setStyle(choseColor(board[index]))
			.setDisabled(disabled);

	const row1 = new ActionRowBuilder().addComponents(
		createButton(0, board[0], board[0] !== '-' || winner !== null),
		createButton(1, board[1], board[1] !== '-' || winner !== null),
		createButton(2, board[2], board[2] !== '-' || winner !== null)
	);

	const row2 = new ActionRowBuilder().addComponents(
		createButton(3, board[3], board[3] !== '-' || winner !== null),
		createButton(4, board[4], board[4] !== '-' || winner !== null),
		createButton(5, board[5], board[5] !== '-' || winner !== null)
	);

	const row3 = new ActionRowBuilder().addComponents(
		createButton(6, board[6], board[6] !== '-' || winner !== null),
		createButton(7, board[7], board[7] !== '-' || winner !== null),
		createButton(8, board[8], board[8] !== '-' || winner !== null)
	);
	const embed = new EmbedBuilder()
		.setImage(`attachment://${attachment.name}`)
		.setColor(signPlay === 'X' ? '#58B748' : '#447ADA')
		.setTitle('Tic Tac Toe');

	if (winner === 'tie') {
		embed.setDescription('Game ended in a tie!');
	} else if (winner === null) {
		embed.setDescription('It turns to ' + signPlay + ' player');
	} else {
		embed.setDescription(`${winner[0]} player won the game!`);
	}

	const customIds = board.map((_, i) => `${i}|${board[i]}`);

	return { customIds, embeds: [embed], files: [attachment], components: [row1, row2, row3] };
}

function choseColor(boardItem) {
	if (boardItem === 'X') {
		return ButtonStyle.Success;
	} else if (boardItem === 'O') {
		return ButtonStyle.Primary;
	} else {
		return ButtonStyle.Secondary;
	}
}

function checkWinner(board) {
	const winPatterns = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (const pattern of winPatterns) {
		const [a, b, c] = pattern;
		if (board[a] !== '-' && board[a] === board[b] && board[a] === board[c]) {
			return [board[a], pattern];
		}
	}

	if (board.every((item) => item !== '-')) {
		return 'tie';
	}

	return null;
}

export { drawBoard };
