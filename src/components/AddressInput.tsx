import { useRef, useState, useMemo, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { debounce } from '@mui/material/utils';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import type { PlaceType } from 'components/Dashboard';
import { createTheme, ThemeProvider } from '@mui/material/styles';


interface AddressInputProps {
    handleAddressInput?: (address: PlaceType | null) => void,
}



export default function AddressInput({handleAddressInput}: AddressInputProps) {
    // any?
    const autocompleteService = useRef(null as any);
    const [value, setValue] = useState<PlaceType | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<readonly PlaceType[]>([]);
    const placesLib = useMapsLibrary('places');

    const fetch = useMemo(
        () =>
            debounce(
                (
                    request: { input: string },
                    callback: (results?: readonly PlaceType[]) => void,
                ) => {
                    (autocompleteService.current as any).getPlacePredictions(
                        request,
                        callback,
                    );
                },
                400,
            ),
        [],
    );

    const theme = createTheme({
        palette: {
          background: {
            paper: '#ffff',
          },
        },
      });


    //active?
    useEffect(() => {
        let active = true;

        if (!autocompleteService.current && placesLib) {
            autocompleteService.current = new placesLib.AutocompleteService()
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
        <Box m={"15px"}>
            
            <Card sx={{p: "10px", borderRadius:"10px",  backdropFilter: "blur(5px)"}}>
            <ThemeProvider theme={theme}>
                <Autocomplete
                    id="google-address-field"
                    sx={{ width: "100%"}}
                    getOptionLabel={(option) =>
                        typeof option === 'string' ? option : option.description
                    }
                    filterOptions={(x) => x}
                    options={options}
                    autoComplete
                    includeInputInList
                    filterSelectedOptions
                    value={value}
                    noOptionsText="No locations"
                    onChange={(event: any, newValue: PlaceType | null) => {
                        setOptions(newValue ? [newValue, ...options] : options);
                        setValue(newValue);
                        if(handleAddressInput) handleAddressInput(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Enter your address" fullWidth />
                    )}
                    renderOption={(props, option) => {
                        // const matches =
                        //   option.structured_formatting.main_text_matched_substrings || [];

                        return (
                            
                            <li {...props}>
                                <Grid container alignItems="center">  
                                    <Grid item sx={{ display: 'flex', width: 44 }}>
                                        <LocationOnIcon sx={{ color: 'text.secondary' }} />
                                    </Grid>
                                    <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                        {option.structured_formatting.main_text}
                                        <Typography variant="body2" color="text.secondary">
                                            {option.structured_formatting.secondary_text}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </li>
                            
                        );
                    }}
                />
                            </ThemeProvider>
            </Card>

        </Box>
    );
}