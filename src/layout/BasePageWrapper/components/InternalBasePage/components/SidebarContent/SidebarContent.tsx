import spotify from '../../../../../../assets/spotify.png';
import BalanceBanner from './components/BalanceBanner/BalanceBanner';
import LowBalanceBanner from './components/LowBalanceBanner/LowBalanceBanner';
import MaintenanceBanner from './components/MaintenanceBanner/MaintenanceBanner';
import SettingsBanner from './components/SettingsBanner/SettingsBanner';
import UserProfile from './components/UserProfile/UserProfile';
import { AttributionContainer, Container, Content, Footer, SpotifyAttributionText, SpotifyLogo, StyledDivider, StyledLink, StyledTypography } from './styled';

interface Props {
    closeDrawer: () => void;
}

const SidebarContent = (props: Props) => {
    return (
        <Container>
            <Content>
                <StyledTypography variant='h3'>
                    ArtisTip
                </StyledTypography>
                <BalanceBanner />
                <SettingsBanner />
                <LowBalanceBanner />
                <MaintenanceBanner />
            </Content>
            <Footer>
                <StyledDivider />
                <UserProfile />
                <StyledDivider />
                <div>
                    <StyledLink href='https://terms.artistip.xyz' target='_blank' color='inherit'>Terms of Service</StyledLink>
                    <StyledLink href='https://privacy.artistip.xyz' target='_blank' color='inherit'>Privacy Policy</StyledLink>
                </div>
                <StyledLink href='mailto:info@artistip.xyz' target='_blank' color='inherit'>info@artistip.xyz</StyledLink>
                <StyledDivider />
                <AttributionContainer>
                    <SpotifyLogo src={spotify} />
                    <SpotifyAttributionText>
                        Artists and songs data and images are provided by Spotify. ArtisTip is not affiliated with Spotify.
                    </SpotifyAttributionText>
                </AttributionContainer>
            </Footer>
        </Container>

    );
};

export default SidebarContent;
