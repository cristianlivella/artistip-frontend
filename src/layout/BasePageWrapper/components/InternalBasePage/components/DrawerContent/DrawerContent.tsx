import UserProfile from './components/UserProfile/UserProfile';
import { Container, Content, Footer, StyledDivider, StyledLink, StyledTypography } from './styled';

interface Props {
    closeDrawer: () => void;
}

const DrawerContent = (props: Props) => {
    return (
        <Container>
            <Content>
                <StyledTypography variant='h3'>
                    ArtisTip
                </StyledTypography>
            </Content>
            <Footer>
                <StyledDivider />
                <UserProfile />
                <StyledDivider />
                <div>
                    <StyledLink href='#' color='inherit'>Terms of Service</StyledLink> <StyledLink href='#' color='inherit'>Privacy Policy</StyledLink>
                </div>
                <StyledLink href='mailto:@info@artistip.xyz' color='inherit'>info@artistip.xyz</StyledLink>
            </Footer>
        </Container>

    );
};

export default DrawerContent;
