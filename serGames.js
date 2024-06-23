import { Collection } from 'discord.js';
import pkg from 'uuid';
const { v4: uuidv4 } = pkg;

import { slashCommande } from './slashCommande.js';
import { drawBoard } from './ticTacToe.js';

function serGames(client) {
	const games = new Collection();

	slashCommande();

	client.on('ready', () => {
		console.log('Ready!');
	});

	client.on('messageCreate', (message) => {});

	client.on('interactionCreate', async (interaction) => {
		if (!interaction.isCommand() && !interaction.isButton()) return;

		if (interaction.isCommand()) {
			if (interaction.commandName === 'tic-tac-toe') {
				const gameId = uuidv4();
				const initialBoard = Array(9).fill('-');
				const gameData = await drawBoard(gameId, initialBoard);
				games.set(gameId, { ...gameData, board: initialBoard, lastSign: 'O' });
				await interaction.reply(gameData);
			}
		}

		if (interaction.isButton()) {
			const [index, gameId] = interaction.customId.split('|');
			const gameState = games.get(gameId);
			if (gameState) {
				const idx = parseInt(index);

				const newBoard = [...gameState.board];
				newBoard[idx] = gameState.lastSign === 'O' ? 'X' : 'O';

				games.set(gameId, { ...gameState, board: newBoard, lastSign: newBoard[idx] });
				const updatedGameData = await drawBoard(gameId, newBoard);
				await interaction.update(updatedGameData);
			} else {
				await interaction.reply({
					content: 'No active game found for this interaction.',
					ephemeral: true,
				});
			}
		}
	});

	client.login(process.env.TOKEN);
}

export { serGames };
