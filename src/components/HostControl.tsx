import type { Host, Weights } from 'components/Dashboard';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import HostTable from 'components/HostTable';
import WeightSelector from 'components/WeightSelector';
import type { PlaceType } from 'components/Dashboard';
import AddressInput from 'components/AddressInput';


interface HostControlProps {
    hostData: Host[],
    handleWeightsSelect: (weights: Weights) => void,
    handleSelectedHostIds: (hostIds: number[]) => void,
    handleAddressInput: (address: PlaceType | null) => void,
    loading?: boolean,
}

export default function HostControl({ hostData, handleWeightsSelect, handleSelectedHostIds, handleAddressInput, loading }: HostControlProps) {

    return (
        <Stack spacing={2} direction="column" alignItems="stretch" height="100%">
            <AddressInput handleAddressInput={handleAddressInput} />
            <Box width={"100%"}>
                <WeightSelector handleWeightsSelect={handleWeightsSelect} loading={loading} />
            </Box>
            <HostTable hostData={hostData} handleSelectedHostIds={handleSelectedHostIds} loading={loading} />
        </Stack>
    );
}