import axios, { AxiosResponse } from 'axios';
import { URLSearchParams } from 'url';
import Bot from '../../client/Client';
import TokenResponse from '../../types/TokenResponseType';

const generateValidationToken = async (client: Bot): Promise<string | void> => {
	return axios
		.post(
			'https://services13.ieee.org/RST/api/oauth/token',
			new URLSearchParams({
				grant_type: 'client_credentials',
				client_id: process.env.VALIDATOR_CLIENT_ID as string,
				client_secret: process.env.VALIDATOR_SECRET as string,
				scope: 'GetMemberStatus',
			}),
		)
		.then((res: AxiosResponse) => (res.data as TokenResponse).access_token)
		.catch((e: unknown) => client.logger.error(e));
};

export default generateValidationToken;
