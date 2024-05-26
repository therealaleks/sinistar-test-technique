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
    handleSelectedHostIds: (hostIds: number[]) => void;
}

function HostTable({ hostData, handleSelectedHostIds }: HostTableProps) {

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 150 },
        {
            field: 'address',
            headerName: 'Address',
            width: 320,
        },
        { field: 'city', headerName: 'City', width: 150 },
    ];

    // memoize somehow
    const rows = hostData.map(({ id, name, address, city }) => ({ id, name, address, city }))

    return (
        <Box width={"100%"} m={"15px"}>
            <Card sx={{ borderRadius: "10px" , boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",  backdropFilter: "blur(5px)"}} >
                <CardContent>
                    <Box m={"10px"}>
                        <Typography variant="h5" component="div" fontWeight={"bold"}>
                            Hosts
                        </Typography>
                    </Box>
                    <Box m={"10px"} height={"30vh"}>
                        <DataGrid
                            // dubious casting
                            onRowSelectionModelChange={(e) => handleSelectedHostIds(e as number[])}
                            rows={rows}
                            columns={columns}
                            autoPageSize
                            checkboxSelection
                        />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default HostTable;