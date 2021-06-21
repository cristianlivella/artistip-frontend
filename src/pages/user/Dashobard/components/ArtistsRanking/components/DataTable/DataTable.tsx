import FlipMove from 'react-flip-move';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import bigInt from 'big-integer';
import BoringAvatar from 'boring-avatars';

import {  Item } from '../../types';
import { AvatarTableCell, Container, FixedWidthCell, SmallTableCell, StyledAvatar, StyledLink, StyledTableBody, StyledTableHeader } from './styled';

interface Props {
    data: Item[];
}

const DataTable = (props: Props) => {
    const { data } = props;

    const formatNumber = (value: number, digits: number = 2) => {
        // maybe it's better to use Numeral.js or something similiar
        return value.toLocaleString('en-US', {minimumIntegerDigits: digits, useGrouping: false});
    };

    const formatFollowersNumber = (value: number) => {
        // Numeral.js also here?
        return value.toLocaleString('en-US').replaceAll(',', ' ');
    };

    const rawToNano = (raw: string) => {
        // util class (?)
        const payoutIntPart = bigInt(raw).divide(bigInt(10).pow(30));
        const payoutDecimalPart = bigInt(raw).divide(bigInt(10).pow(22)).minus(payoutIntPart.multiply(bigInt(10).pow(8))).abs();
        return payoutIntPart.toJSNumber() + payoutDecimalPart.toJSNumber() * Math.pow(10, -8);
    };

    const formatPayout = (value: string, digits: number) => {
        return rawToNano(value).toLocaleString('en-US', {minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: false});
    };

    const formatDuration = (milliseconds: number) => {
        const seconds = milliseconds / 1000;
        if (seconds < 60) {
            return Math.round(seconds) + ' second' + (seconds !== 1 ? 's' : '');
        }
        else if (seconds < 60 * 60) {
            const minutes = Math.round(seconds / 60);
            return minutes + ' minute' + (minutes !== 1 ? 's' : '');
        }
        else {
            const hours = Math.floor(seconds / (60 * 60));
            const minutes = Math.round((seconds - (hours * 60 * 60)) / 60);
            return hours + ':' + formatNumber(minutes) + ' hour' + (hours !== 1 ? 's' : '');
        }
    } ;

    const isPayoutEstimated = !data.every(artist => artist.estimatedPayout === undefined);
    const totalPayout = data.reduce((acc, cur) => acc.add(bigInt(cur.estimatedPayout ?? cur.payout)), bigInt(0)).toString();
    const totalPayoutNano = rawToNano(totalPayout);
    const nanoDecimalDigits = (totalPayoutNano === 0.0 || totalPayoutNano > 10) ? 2 : Math.min(3 - Math.round(Math.log10(totalPayoutNano)), 6);

    const header = {} as Item;
    const fakeData = [header, ...data];

    return (
        <Container>
            <TableContainer component={Paper}>
                <Table>
                    <StyledTableBody>
                        <FlipMove
                            staggerDurationBy={20}
                            duration={800}
                            easing={'cubic-bezier(0.25, 0.1, 0.25, 1.0)'}
                            typeName={null} >
                            {fakeData.map((row, i) => {
                                if (i === 0) {
                                    return (
                                        <StyledTableHeader key='header'>
                                            <SmallTableCell></SmallTableCell>
                                            <AvatarTableCell></AvatarTableCell>
                                            <TableCell>Artist</TableCell>
                                            <FixedWidthCell>Followers</FixedWidthCell>
                                            <FixedWidthCell>{isPayoutEstimated ? 'Estimated payout' : 'Payout'}</FixedWidthCell>
                                            <SmallTableCell>Listening time</SmallTableCell>
                                        </StyledTableHeader>
                                    );
                                }
                                return (
                                    <TableRow key={row.name} hover={true} style={{width: '100%'}}>
                                        <SmallTableCell component='th' scope='row'>
                                            {i}
                                        </SmallTableCell>
                                        <AvatarTableCell>
                                            <StyledAvatar alt={row.name} src={row.image} >
                                                <BoringAvatar size={56} variant='beam' name={row.id} colors={['#411f2d', '#ac4147', '#f88863', '#ffc27f', '#ffe29a']} />
                                            </StyledAvatar>
                                        </AvatarTableCell>
                                        <TableCell><StyledLink href={'https://open.spotify.com/artist/' + row.id} target='_blank'>{row.name}</StyledLink></TableCell>
                                        <FixedWidthCell>{formatFollowersNumber(row.followers)}</FixedWidthCell>
                                        <FixedWidthCell>{formatPayout(row.estimatedPayout ?? row.payout, nanoDecimalDigits)} NANO</FixedWidthCell>
                                        <SmallTableCell>{formatDuration(row.duration)}</SmallTableCell>
                                    </TableRow>
                                );
                            })}
                        </FlipMove>
                    </StyledTableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default DataTable;
