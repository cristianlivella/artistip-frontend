import ArtistRanking from './components/ArtistsRanking/ArtistsRanking';
import RecentlyPlayed from './components/RecentlyPlayed/RecentlyPlayed';
import { StyledDivider } from './styled';

const Dashboard = () => {
    return (
        <>
            <RecentlyPlayed />
            <StyledDivider />
            <ArtistRanking />
        </>
    );
};

export default Dashboard;
