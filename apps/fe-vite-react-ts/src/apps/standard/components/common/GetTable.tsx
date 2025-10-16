// import { useEffect, useState } from "react";
// import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { Typography } from "@mui/material";
// import { MRT_TableOptions, MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import SaveIcon from '@mui/icons-material/Save';
import GetDataFrom from "../../common/GetDataFrom";

const GetTable = (props: any) => {

    // const http = process.env.REACT_APP_STANDARD_BE_ADDR_PORT;
    const http = 'http://192.168.0.101:8090/standard';

    const columns = GetDataFrom(String(http) + props.addr + '/columns');
    if (columns !== undefined && columns !== null && columns.length) {
        // console.log(columns);
    }

    const data = GetDataFrom(String(http) + props.addr + '/data');
    if (data !== undefined && data !== null && data.length) {
        // console.log(data);
    }

    // const [pagination, setPagination] = useState({
    //     pageSize: 10,
    //     pageIndex: 0,
    // });

    // useEffect(() => {
    //     //do something when the pagination state changes
    // }, [pagination.pageIndex, pagination.pageSize]);

    const table = useMaterialReactTable({
        columns,
        data,
        enableHiding: false,
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        // editDisplayMode: props.editMode,        // 'modal' | 'cell' | 'row' | 'table' | 'custom
        // enableEditing: props.editMode === undefined ? false : true,
        enableRowSelection: false,
        // enableRowActions: true,
        positionActionsColumn: 'first',
        enableRowNumbers: true,
        rowNumberDisplayMode: 'original',   // 'original' | 'static'
        enablePagination: true,
        paginationDisplayMode: 'pages',
        initialState: {
            density: 'compact',             // 'comfortable' | 'compact' | 'spacious'
            pagination: {
                pageSize: 10,
                pageIndex: 0,
            }
        },
        getRowId: (row: any) => row.id,
        // renderRowActions: ({ row }) => (
        //     <Box sx={{ display: 'flex', gap: '1rem' }}>
        //         <Tooltip title="Update">
        //             <IconButton onClick={() => { table.setEditingRow(row); }}>
        //                 <EditIcon />
        //             </IconButton>
        //         </Tooltip>
        //         <Tooltip title="Delete">
        //             <IconButton color="error" onClick={() => { props.fnDelete(row); }}>
        //                 <DeleteIcon />
        //             </IconButton>
        //         </Tooltip>
        //     </Box>
        // ),
        // onEditingRowChange: ({ row: any }): any => {
        //     // props.fnUpdate(row, row.original, row._valuesCache);
        //     table.setEditingRow(null);
        // },
        // onEditingRowCancel: ({ table }): any => { table.setEditingRow(null); },
        // onEditingRowSave: ({ exitEditingMode, row, table }): any => {
        //     props.fnUpdate(row, row.original, row._valuesCache);
        //     table.setEditingRow(null);
        //     exitEditingMode();
        // },
        // muiTableBodyRowProps: ({ row }) => ({
        //     onClick: (e) => {
        //         // console.log(row);
        //     }
        // }),
        // onCreatingRowCancel: () => setValidationErrors({}),
        // onCreatingRowSave: handleCreateUser,
        // onEditingRowCancel: () => setValidationErrors({}),
        // onEditingRowSave: handleSaveUser,
        // renderRowActions: ({ row, table }) => (
        //     <Box sx={{ display: 'flex', gap: '1rem' }}>
        //         <Tooltip title="Edit">
        //             {/* <IconButton onClick={() => table.setEditingRow(row)}> */}
        //                 <EditIcon />
        //             {/* </IconButton> */}
        //         </Tooltip>
        //         <Tooltip title="Delete">
        //             {/* <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}> */}
        //                 <DeleteIcon />
        //             {/* </IconButton> */}
        //         </Tooltip>
        //     </Box>
        // ),
    });

    return (
        <div style={{ width: '100vw', maxWidth: '100vw' }}>
            <Typography align="center" variant="h5" component="h5">
                {props.title}
            </Typography>
            <div style={{ width: '100vw', maxWidth: '100vw' }}>
                <MaterialReactTable
                    table={table}
                />
            </div>
        </div>
    )
}

export default GetTable;
