import axios, { AxiosResponse } from 'axios';
import Bot from '../../client/Client';
import ValidationResponse from '../../types/ValidationResponseType';

const ACTIVE = 'Active';

const validateMembership = async (
	client: Bot,
	token: string,
	ieeeID: string
): Promise<boolean> => {
	let valid = false;

	await axios
		.post(
			'https://services13.ieee.org/RST/Customer/getstatus',
			{
				MemberID: ieeeID,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		.then((res: AxiosResponse) => {
			const valRes = res.data as ValidationResponse;
			valid = valRes.MemberStatus === ACTIVE;
		})
		.catch((e: unknown) => client.logger.error(e));

	return valid;
};

export default validateMembership;
