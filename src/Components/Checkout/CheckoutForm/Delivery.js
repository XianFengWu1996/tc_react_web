import React from "react";
import {
  Paper,
  Typography,
  Divider,
  IconButton,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core";
import { FaPencilAlt } from "react-icons/fa";
import { connect } from "react-redux";
import Axios from "axios";
import Loader from 'react-loader-spinner'
import { setError, resetErrorAndWarning, calculateTotal } from "../../../redux/actions/cart";
import { saveDeliveryInfo } from "../../../redux/actions/customer";
import screenSize from '../../../Helper/ScreenSize';
import { TransitionDown } from '../../../Helper/Animation'
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import { updateAddress } from "../../../Helper/SendData";
import LoadingSpinner from '../../../Helper/Loading'
import * as COLORS from '../../../Misc/colors'
import { calculateDeliveryUrl } from '../../../Misc/url'

const useStyle = makeStyles((theme) => ({
  card: {
    padding: "10px 25px",
    display: "grid",
    gridTemplateColumns: "3fr 1fr",
    marginBottom: "15px",
  },
  edit: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }, 
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    margin: '0.7rem 0',

    [theme.breakpoints.down('md')]: {
      fontSize: '1.4rem',
      margin: '0.5rem 0',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.3rem',
      margin: '0.3rem 0',
    }
  }
}));

const Delivery = (props) => {
  const classes = useStyle();
  const { address: deliveryAddress, business, apt} = props.customer.address;
  const { smallScreen, extraSmallScreen } = screenSize();

  const [open, setOpen] = React.useState(false);
  const [openAdditional, setOpenAdditional] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [search, setSearch] = React.useState(''); // handle the search bar text
  const [address, setAddress] = React.useState({
    deliveryFee: 0,
    address_details: {
      address: '',
      zipcode: '',
      apt: '',
      buildingName: '',
    }
  }); // handle displaying formatted address and delivery fee
  const [errorMessage, setErrorMessage] = React.useState(''); // handle error message
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setLoading(false);
    setOpen(false);
    resetSearchResult()
  };

  const resetAddressDetails = () => {
    setAddress({
      deliveryFee: 0,
      address_details: {
        ...address.address_details,
        address: '',
        zipcode: '',
      }
    })
  }

  const resetSearchResult = () => {
    resetAddressDetails();
    setErrorMessage('');
  }

  const handleOnSelect = async (address) => {
    // clear the search bar 
    setSearchLoading(true);
    setSearch('');
    // start loading

    let addressResult = await geocodeByAddress(address);

    let zipcode = addressResult[0].address_components.find((address) => address.types[0] === 'postal_code').long_name;

    // when the customer selects the address calculate the delivery fee
    calculateDelivery(
      addressResult[0].geometry.location.lat(),
      addressResult[0].geometry.location.lng(),
      addressResult[0].formatted_address.replace(', USA', ''),
      zipcode,
    );
  }

const calculateDelivery = async (lat, lng, formatted_address, zipcode) => {
  resetSearchResult();
  // make a request to our backend to request calculate the distance
  try {
    await Axios.post(calculateDeliveryUrl, {
      lat: lat,
      lng: lng,
    }, { headers: { "Authorization": props.auth.requestKey }}).then((deliveryResult) => {
        setAddress({
          deliveryFee: deliveryResult.data.result,
          address_details: {
            ...address.address_details,
            address: formatted_address,
            zipcode: zipcode,
          }
        });
    }).catch((error) => {
      resetAddressDetails();
      setErrorMessage(error.response.data.error);
    });
  } catch (error) {
    setErrorMessage(error.message ? error.message : 'Unexpected Error occurred, try again later.')
  }
  setSearchLoading(false)
  };
  

  return (
    <div>
      <Typography className={classes.title}>Where should we deliver?</Typography >
      <Paper className={classes.card}>
        <div>
          <Typography variant={smallScreen ? 'h6' : 'h5'}>Delivery Info</Typography>
          <Divider style={{ margin: "5px 0px" }} />
          {business !== "" ? (
            <Typography variant="button">Business Name: {business}</Typography>
          ) : null}
          <Typography variant={smallScreen ? 'subtitle2' : 'subtitle1'}>
            {deliveryAddress}
          </Typography>
          <Typography variant={smallScreen ? 'subtitle2' : 'subtitle1'}>
            {apt !== "" ? `Apt: ${apt}` : null}          
          </Typography>
        </div>
        <div className={classes.edit} >
          <IconButton onClick={handleClickOpen} size={extraSmallScreen ? 'small' : 'medium'}>
            <FaPencilAlt />
          </IconButton>
        </div>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={smallScreen}
        disableBackdropClick
        aria-labelledby="form-dialog-title"
        TransitionComponent={TransitionDown}
      >
        <DialogTitle id="form-dialog-title">Delivery Address</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your address to calculate the delivery fee, please note that
            we are only able to deliver within 6 miles driving distance.
          </DialogContentText>
          <PlacesAutocomplete 
            value={search} 
            onChange={(e) => {
              resetSearchResult();
              setSearch(e);
            }}
            onSelect={handleOnSelect}
            >
            {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
              <div>
              <TextField
                variant="outlined"
                fullWidth
                {...getInputProps({
                  placeholder: 'Search Address ...',
                  className: 'location-search-input'
                })}
              />
              <div className="autocomplete-dropdown-container">
                {suggestions.map(suggestion => {
                  const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                              ? { backgroundColor: '#d3d3d3 ', cursor: 'pointer', padding: '5px 10px'}
                              : { backgroundColor: '#ffffff', cursor: 'pointer', padding: '5px 10px'};
                  return (
                    <div {...getSuggestionItemProps(suggestion, { className, style })} key={suggestion.placeId}>
                      <span>{suggestion.description}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            )}
          </PlacesAutocomplete>
          {/* display loading before the request is finish */}
          {searchLoading ? <Loader type="ThreeDots"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            color="#000"
            height={30}
            width={30}
          /> : null}
          {errorMessage ? <Typography color="error" style={{ marginTop: 10}}>{errorMessage}</Typography> : null}
          {/* display the formatted address for the user to view */}
              {address.address_details.address ? 
              <>
                <Typography>Your address:</Typography>
                <Typography>{address.address_details.address}</Typography>
              </> 
              : null }

          {/* display the delivery fee */}
              {address.deliveryFee 
                ? <Typography>Delivery Fee: ${address.deliveryFee}</Typography> 
                : null}

              {/* Display an option to add build info */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
              <Button variant="text" color="primary" style={{ margin: '1rem 0'}} onClick={() => {
                setOpenAdditional(!openAdditional);
              }}>Add Apt # or Building Name</Button>
              {
                openAdditional ?  <div>
                <TextField
                  variant="outlined"
                  style={{ paddingBottom: "10px" }}
                  label="Apt / Floor"
                  value={address.address_details.apt}
                  onChange={(value) => {
                    setAddress({
                      ...address,
                      address_details: {
                        ...address.address_details,
                        apt: value.target.value
                      }
                    })
                  }}
                  name="apt"
                  fullWidth={true}
                />
  
                <TextField
                  variant="outlined"
                  style={{ paddingBottom: "10px" }}
                  label="Business Name"
                  value={address.address_details.buildingName}
                  onChange={(value) => {
                    setAddress({
                      ...address,
                      address_details: {
                        ...address.address_details,
                        buildingName: value.target.value
                      }
                    })
                  }}
                  name="business"
                  fullWidth={true}
                />
                </div> : null
              }
           </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            disabled={address.address_details.address === '' || loading}
            style={{ backgroundColor: COLORS.BUTTON_RED, color: '#fff'}}
            variant="contained"
            onClick={ async () => {
              if(address.address_details.address !== ''){
                setLoading(true);
                setErrorMessage('')

                // // attemp to update the address to the backend
                let result = await updateAddress({
                  address: address.address_details, 
                  deliveryFee: address.deliveryFee,
                  handleClose
                });

                // if the result contains error, display the error
                if(result.error){
                  setErrorMessage(result.error);
                  setLoading(false);
                }
              }
            }}
          >
            {loading ? <LoadingSpinner /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  customer: state.customer,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  setError: (error) => dispatch(setError(error)),
  resetError: () => dispatch(resetErrorAndWarning()),
  calculateTotal: () => dispatch(calculateTotal()),
  saveDeliveryInfo: (info) => dispatch(saveDeliveryInfo(info)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Delivery);
