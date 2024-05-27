import Box from '@mui/material/Box';
import data from 'database.json';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Weights } from 'components/Dashboard';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import type { Host } from 'components/Dashboard';

interface HostTableProps {
    hostData: Host[],
    handleSelectedHostIds: (hostIds: number[]) => void,
    loading?: boolean,
}

function HostTable({ hostData, handleSelectedHostIds, loading }: HostTableProps) {

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 150, sortable: false, },
        {
            field: 'address',
            headerName: 'Address',
            width: 320,
            sortable: false,
        },
        { field: 'city', headerName: 'City', width: 100, sortable: false, },
        {field: 'review_score', headerName: 'Rating', width:100, sortable: false,},
    ];

    // memoize somehow
    const rows = hostData.map(({ id, name, address, city, review_score }) => ({ id, name, address, city, review_score }))

    return (
        <Box width={"100%"} m={"15px"} flexGrow="1">
            <Card sx={{ height: "100%", borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", backdropFilter: "blur(5px)" }} >
                <CardContent sx={{height: "90%"}}>
                    <Box mx={"15px"} mt="10px" mb="10px" height="10%">
                        <Typography variant="h5" component="div" fontWeight={"bold"}>
                            Hosts
                        </Typography>
                    </Box>
                    <Box m={"10px"} height={"80%"}>
                        <DataGrid
                            // dubious casting
                            onRowSelectionModelChange={(rowIds) => handleSelectedHostIds(rowIds as number[])}
                            rows={rows}
                            columns={columns}
                            autoPageSize
                            checkboxSelection
                            loading={loading}
                        />
                    </Box>

                </CardContent>
            </Card>
        </Box>
    );
}

export default HostTable;