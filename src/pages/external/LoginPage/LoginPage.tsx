import { Container, Footer, Section, StyledButton, StyledLink, StyledNavLink, StyledTypography } from './styled';

const LoginPage = () => {
    return (
        <Container>
            <StyledTypography variant='h2'>
                ArtisTip
            </StyledTypography>
            <Section elevation={3}>
                <StyledTypography variant='h5'>
                    Are you a music lover?
                </StyledTypography>
                <StyledTypography variant='body1'>
                    Log in with Spotify to start tracking your listening and sending tips to your favorite artists!
                </StyledTypography>
                <StyledNavLink to='/login/spotify'>
                    <StyledButton variant='contained' color='primary'>
                        Login with Spotify
                    </StyledButton>
                </StyledNavLink>
            </Section>
            <Footer>
                <StyledLink href='https://terms.artistip.xyz' target='_blank' color='inherit'>Terms of Service</StyledLink>
                <StyledLink href='https://privacy.artistip.xyz' target='_blank' color='inherit'>Privacy Policy</StyledLink>
            </Footer>

        </Container >
    );
};

export default LoginPage;
