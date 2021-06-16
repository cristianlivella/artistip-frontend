import BalanceBanner from './components/BalanceBanner/BalanceBanner';
import MaintenanceBanner from './components/MaintenanceBanner/MaintenanceBanner';
import UserProfile from './components/UserProfile/UserProfile';
import { Container, Content, Footer, StyledDivider, StyledLink, StyledTypography } from './styled';

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
                <StyledLink href='mailto:@info@artistip.xyz' target='_blank' color='inherit'>info@artistip.xyz</StyledLink>
            </Footer>
        </Container>

    );
};

export default SidebarContent;
