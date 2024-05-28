import { useRef, useState, useMemo, useEffect } from 'react';

import { Autocomplete, TextField, Grid, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { debounce } from '@mui/material/utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useMapsLibrary } from '@vis.gl/react-google-maps';

import DashboardCard from 'components/Dashboard/DashboardCard';
import DashboardAlert from 'components/Dashboard/DashboardAlert';

import type { PlaceType } from 'shared/shared.types';

interface AddressInputProps {
    handleAddressInput?: (address: PlaceType | null) => void;
}

export default function AddressInput({
    handleAddressInput,
}: AddressInputProps) {
    const autocompleteService = useRef(null as any);
    const [value, setValue] = useState<PlaceType | null>(null);
    const [apiFailToastOpen, setApiFailToastOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<readonly PlaceType[]>([]);
    const placesLib = useMapsLibrary('places');

    const fetch = useMemo(
        () =>
            debounce(
                (
                    request: { input: string },
                    callback: (results?: readonly PlaceType[]) => void,
                ) => {
                    (autocompleteService.current as any)
                        .getPlacePredictions(request, callback)
                        .catch((e: any) => {
                            console.log(
                                'failed to fetch address suggestions due to: ' +
                                    e,
                            );
                            setApiFailToastOpen(true);
                        });
                },
                400,
            ),
        [],
    );

    const theme = createTheme({
        palette: {
            primary: {
                main: '#ff9800',
                light: '#12819c',
            },
            secondary: {
                main: '#f50057',
            },
            background: {
                paper: '#ffff',
            },
        },
    });

    useEffect(() => {
        let active = true;

        if (!autocompleteService.current && placesLib) {
            autocompleteService.current = new placesLib.AutocompleteService();
        }
        if (!autocompleteService.current) {
            return;
        }

        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch({ input: inputValue }, (results?: readonly PlaceType[]) => {
            if (active) {
                let newOptions: readonly PlaceType[] = [];

                if (value) {
                    newOptions = [value];
                }

                if (results) {
                    newOptions = [...newOptions, ...results];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch, placesLib]);

    return (
        <>
            <DashboardCard sx={{ p: '10px' }}>
                <ThemeProvider theme={theme}>
                    <Autocomplete
                        id="google-address-field"
                        sx={{ width: '100%' }}
                        getOptionLabel={(option) => option.description}
                        options={options}
                        autoComplete
                        filterSelectedOptions
                        value={value}
                        noOptionsText="No locations"
                        onChange={(event: any, newValue: PlaceType | null) => {
                            setOptions(
                                newValue ? [newValue, ...options] : options,
                            );
                            setValue(newValue);
                            if (handleAddressInput)
                                handleAddressInput(newValue);
                        }}
                        onInputChange={(event: any, newInputValue: string) => {
                            setInputValue(newInputValue);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Enter your address"
                                fullWidth
                            />
                        )}
                        renderOption={(props, option) => {
                            return (
                                <li {...props}>
                                    <Grid container alignItems="center">
                                        <Grid
                                            item
                                            sx={{ display: 'flex', width: 44 }}
                                        >
                                            <LocationOnIcon
                                                sx={{ color: 'text.secondary' }}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            sx={{
                                                width: 'calc(100% - 44px)',
                                                wordWrap: 'break-word',
                                            }}
                                        >
                                            {
                                                option.structured_formatting
                                                    .main_text
                                            }
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {
                                                    option.structured_formatting
                                                        .secondary_text
                                                }
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </li>
                            );
                        }}
                    />
                </ThemeProvider>
            </DashboardCard>
            <DashboardAlert
                open={apiFailToastOpen}
                severity="error"
                message="Failed to load addresses"
                handleClose={() => setApiFailToastOpen(false)}
            />
        </>
    );
}
