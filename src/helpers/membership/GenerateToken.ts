import axios, { AxiosResponse } from 'axios';
import { URLSearchParams } from 'url';
import TokenResponse from '../../types/TokenResponseType';

const generateToken = async (): Promise<string> =>
  axios
    .post(
      'https://services13.ieee.org/RST/api/oauth/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.VALIDATOR_CLIENT_ID as string,
        client_secret: process.env.VALIDATOR_SECRET as string,
        scope: 'GetMemberStatus',
      }),
    )
    .then((res: AxiosResponse) => (res.data as TokenResponse).access_token);

export default generateToken;
