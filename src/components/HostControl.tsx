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
}

export default function HostControl({ hostData, handleWeightsSelect, handleSelectedHostIds, handleAddressInput }: HostControlProps) {

    return (
        //not quite the right place for positioning
        <Box width={"35vw"} height={"60vh"} position={"absolute"} sx={{ bottom: 350, left: 0 }} m={"10px"}>
            <Stack spacing={2} direction="column" alignItems="stretch">
                <AddressInput handleAddressInput={handleAddressInput} />
                <Box width={"100%"}>
                    <WeightSelector handleWeightsSelect={handleWeightsSelect} />
                </Box>
                <HostTable hostData={hostData} handleSelectedHostIds={handleSelectedHostIds} />
            </Stack>
        </Box>
    );
}