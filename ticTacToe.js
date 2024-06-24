import { createCanvas } from 'canvas';
import { EmbedBuilder } from 'discord.js';
import { AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

async function drawBoard(gameId, board = ['-', '-', '-', '-', '-', '-', '-', '-', '-']) {
	// console.log(board);
	const canvas = createCanvas(300, 300);
	const ctx = canvas.getContext('2d');

	// Définir le fond noir
	ctx.fillStyle = '#000';
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
		const x = (i % 3) * 100 + 50;
		const y = Math.floor(i / 3) * 100 + 50;
		const text = board[i];
		ctx.font = '80px sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = '#FFF';
		ctx.fillText(text, x, y);
	}

	// ctx.fillStyle = '#FFF';
	// ctx.beginPath();
	// ctx.moveTo(25, 25);
	// ctx.lineTo(75, 75);
	// ctx.stroke();

	// ctx.beginPath();
	// ctx.moveTo(75, 25);
	// ctx.lineTo(25, 75);
	// ctx.stroke();

	// // fait un rond pour la case central
	// ctx.beginPath();
	// ctx.arc(150, 150, 30, 0, Math.PI * 2);
	// ctx.stroke();

	const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'tic-tac-toe.png' });

	const createButton = (index, label = '-', disabled = false) =>
		new ButtonBuilder()
			.setLabel(label)
			.setCustomId(`${index}|${gameId}|${board[index]}`)
			.setStyle(choseColor(board[index]))
			.setDisabled(disabled);

	const row1 = new ActionRowBuilder().addComponents(
		createButton(0, board[0], board[0] !== '-'),
		createButton(1, board[1], board[1] !== '-'),
		createButton(2, board[2], board[2] !== '-')
	);

	const row2 = new ActionRowBuilder().addComponents(
		createButton(3, board[3], board[3] !== '-'),
		createButton(4, board[4], board[4] !== '-'),
		createButton(5, board[5], board[5] !== '-')
	);

	const row3 = new ActionRowBuilder().addComponents(
		createButton(6, board[6], board[6] !== '-'),
		createButton(7, board[7], board[7] !== '-'),
		createButton(8, board[8], board[8] !== '-')
	);
	const embed = new EmbedBuilder()
		.setImage(`attachment://${attachment.name}`)
		.setColor('#FF0000')
		.setTitle('Tic Tac Toe');

	// console.log(board);

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

export { drawBoard };
