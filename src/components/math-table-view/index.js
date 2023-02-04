import {useState} from "react";
import * as PropTypes from "prop-types";
import {
    Card,
    IconButton,
    MenuItem, Popover,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow
} from "@mui/material";
import Scrollbar from "../scrollbar/Scrollbar";
import {UserListHead} from "../../sections/@dashboard/user";
import Label from "../label";
import Iconify from "../iconify";

// ----------------------------------------------------------------------
const TABLE_HEAD = [
    {id: 'number1', label: 'Number 1', alignRight: false},
    {id: 'operation', label: 'Operation', alignRight: false},
    {id: 'number2', label: 'Number 2', alignRight: false},
    {id: 'correctAnswer', label: 'Correct Answer', alignRight: false},
    {id: 'yourAnswer', label: 'Your Answer', alignRight: false},
    {id: 'result', label: 'Result', alignRight: false},
    {id: ''},
];

const MathsTableView = (props) => {
    const [open, setOpen] = useState(null);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const {datasource, operation} = props;

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const emptyRows =
        page > 0
            ? Math.max(0, (1 + page) * rowsPerPage - datasource.length)
            : 0;

    return (
        <>
            <Card style={{marginTop: 50}}>
                <Scrollbar>
                    <TableContainer sx={{minWidth: 800}}>
                        <Table>
                            <UserListHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={datasource.length}
                                onRequestSort={handleRequestSort}
                            />
                            <TableBody>
                                {datasource
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const {number1, number2, correctAnswer, yourAnswer, result} = row;
                                        return (
                                            <TableRow key={`additon-table-row-${index}`}>
                                                <TableCell align="left">{number1}</TableCell>
                                                <TableCell align="left">{operation}</TableCell>
                                                <TableCell align="left">{number2}</TableCell>
                                                <TableCell align="left">
                                                    <Label color="success">{correctAnswer}</Label>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Label color={result ? 'success' : 'error'}>{yourAnswer}</Label>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Label color={result ? 'success' : 'error'}>
                                                        {result ? 'Correct' : 'Incorrect'}
                                                    </Label>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                                                        <Iconify icon={'eva:more-vertical-fill'}/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow style={{height: 53 * emptyRows}}>
                                        <TableCell colSpan={6}/>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={datasource.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 140,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <MenuItem>
                    <Iconify icon={'eva:edit-fill'} sx={{mr: 2}}/>
                    Edit
                </MenuItem>

                <MenuItem sx={{color: 'error.main'}}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{mr: 2}}/>
                    Delete
                </MenuItem>
            </Popover>
        </>
    )
}

MathsTableView.propTypes = {
    datasource: PropTypes.any,
    operation: PropTypes.string
};

export default MathsTableView
