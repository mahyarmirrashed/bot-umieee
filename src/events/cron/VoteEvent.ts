import Bot from '../../client/Client';
import addVote from '../../helpers/cotw/AddVote';
import removeVote from '../../helpers/cotw/RemoveVote';
import RunFunction from '../../interfaces/RunFunctionStorage';

export const run: RunFunction = async (client: Bot): Promise<void> => {
	removeVote(client);
	addVote(client);
};

export const name = 'vote';
