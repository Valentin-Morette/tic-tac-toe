import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

function slashCommande() {
	const commands = [
		{
			name: 'tic-tac-toe',
			description: 'Jouer au jeu du tic-tac-toe',
		},
	];

	const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

	(async () => {
		try {
			await rest.put(Routes.applicationCommands(process.env.IDAPPLICATION), { body: commands });
			console.log('Commandes slash globales enregistrées avec succès !');
		} catch (error) {
			console.error("Erreur lors de l'enregistrement des commandes slash globales:");
		}
	})();
}

export { slashCommande };
