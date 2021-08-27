import axios, { AxiosResponse } from 'axios';
import ValidationResponse from '../../types/ValidationResponseType';

const ACTIVE = 'Active';

const validateMember = async (
  token: string,
  ieeeID: number,
): Promise<boolean> =>
  axios
    .post(
      'https://services13.ieee.org/RST/Customer/getstatus',
      {
        MemberID: ieeeID,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then(
      (res: AxiosResponse) =>
        (res.data as ValidationResponse).MemberStatus === ACTIVE,
    )
    .catch(() => false);

export default validateMember;
