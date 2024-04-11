import axios from 'axios';
import { getLeague } from './league';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getLeague', () => {
    it('should return league successfully', async () => {
        const mockFakeTodoItem = {
            id: 1,
            area: { name: 'area_name' },
            name: 'name',
            code: 'code'
        };

        mockedAxios.get.mockResolvedValue({ data: mockFakeTodoItem });

        const competition = await getLeague(2016);
        expect(competition).toEqual({
            competitionId: 1,
            area: 'area_name',
            name: 'name',
            code: 'code',
        });
    });

    it('should return null if league code is not available', async () => {
        mockedAxios.get.mockResolvedValue({ data: { message: '' } });

        const competition = await getLeague(2016);
        expect(competition).toBeNull();
    });

    it('should throw error if something is wrong', async () => {
        mockedAxios.get.mockRejectedValue(new Error('error'));
        expect(getLeague(2016)).rejects.toThrow('error');
    });
});