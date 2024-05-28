import { useMemo } from 'react';

import { Box, Typography, CardContent } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import DashboardCard from 'components/Dashboard/DashboardCard';

import type { Host } from 'shared/shared.types';

interface HostTableProps {
    hostData: Host[];
    handleSelectedHostIds: (hostIds: number[]) => void;
    loading?: boolean;
}

function HostTable({
    hostData,
    handleSelectedHostIds,
    loading,
}: HostTableProps) {
    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
        },
        {
            field: 'address',
            headerName: 'Address',
            width: 320,
        },
        {
            field: 'city',
            headerName: 'City',
            width: 100,
        },
        {
            field: 'review_score',
            headerName: 'Rating',
            width: 100,
        },
    ];

    const rows = useMemo(() => {
        return hostData.map(({ id, name, address, city, review_score }) => ({
            id,
            name,
            address,
            city,
            review_score,
        }));
    }, [hostData]);

    return (
        <DashboardCard sx={{ height: '100%' }}>
            <CardContent sx={{ height: '85%' }}>
                <Box mx="15px" mt="10px" mb="20px">
                    <Typography
                        variant="h5"
                        component="div"
                        fontWeight={'bold'}
                    >
                        Hosts
                    </Typography>
                </Box>
                <Box m="10px" height={{ xs: '50vh', xl: '85%' }}>
                    <DataGrid
                        onRowSelectionModelChange={(rowIds) =>
                            handleSelectedHostIds(rowIds as number[])
                        }
                        rows={rows}
                        columns={columns}
                        autoPageSize
                        checkboxSelection
                        loading={loading}
                        disableColumnMenu
                        disableColumnResize
                        disableColumnSorting
                    />
                </Box>
            </CardContent>
        </DashboardCard>
    );
}

export default HostTable;
