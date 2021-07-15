import React from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography, AppBar, Toolbar, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio
} from "@material-ui/core";
import { Add, Close, Remove } from "@material-ui/icons";
import { connect } from "react-redux";
import { addToCart, calculateTotal, setTip} from "../../redux/actions/cart";
import { TransitionDown } from '../../Helper/Animation'
import screenSize from '../../Helper/ScreenSize'


const AddToCart = (props) => { 
  const [open, setOpen] = React.useState(false);
  const [count, setCount] = React.useState(1);
  const [comment, setComment] = React.useState('');
  const [value, setValue] = React.useState('');
  const [selectedOption, setSelectedOption] = React.useState({});

  const { smallScreen } = screenSize();

  const dish = props.dish;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCount(1);
    setComment('');
  };

  const handleAddToCart = () => {
    props.addToCart({
        foodId: selectedOption.id ? selectedOption.id : dish.food_id,
        foodName: selectedOption.name ? selectedOption.name + ' ' +dish.food_name : dish.food_name,
        foodNameChinese: selectedOption.chineseName ? selectedOption.chineseName : dish.food_name_chinese,
        price: selectedOption.diff ? dish.price + selectedOption.diff : dish.price,
        count: count,
        total: selectedOption.diff ? (dish.price + selectedOption.diff) * count : dish.price * count,
        comment: comment,
        spicy: dish.spicy,
        lunch: dish.lunch ? true : false,
        option: selectedOption
    })
    if(props.cart.tipChoice === '10' || props.cart.tipChoice === '15' || props.cart.tipChoice === '20'){
      props.setTip({ choice: props.cart.tipChoice, amount: Number(props.cart.tipChoice) / 100})
    }
    
    props.calculateTotal();

    handleClose();
  }

  return (
    <>
      <IconButton onClick={handleClickOpen} size='medium'>
        <Add />
      </IconButton>


      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={TransitionDown}
        aria-labelledby="form-dialog-title"
        fullScreen={smallScreen}
        PaperProps={{
          style: smallScreen ? {}: {
            minHeight: '275px',
            minWidth: '500px',
          },
        }}
      >
         
        { smallScreen ? 
          <>
            <AppBar>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                  <Close />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Toolbar />
          </> : null}
        <DialogTitle id="form-dialog-title">
          {dish.food_id}. {dish.food_name}{" "}
          {dish.food_name_chinese}
        </DialogTitle>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', justifySelf: 'flex-end' }}>
          {dish.options ? 
            <FormControl component="fieldset">
                <FormLabel component="legend">Choose an option</FormLabel>
                <RadioGroup 
                  aria-label="option" 
                  name="option" 
                  value={value} 
                  onChange={(e) => {
                    setValue(e.target.value);
                    let result = dish.options.filter((option) => option.name === e.target.value);
                    setSelectedOption(result[0]);
                }}>
                  {
                     dish.options.map((option) => {
                      return <div key={option.id}>
                        <FormControlLabel 
                        key={option.id}
                        value={option.name} 
                        control={<Radio />} 
                        disabled={!option.active}
                        label={<div style={{ display: 'flex', flexDirection: 'row'}}>
                            <Typography>{option.name}</Typography>
                            <Typography style={{marginLeft: '10px'}}>{option.chineseName}</Typography>
                            <Typography style={{
                              marginLeft: '10px',
                              color: option.diff >= 0 ? 'green' : 'red'
                            }}>{(option.diff >= 0 ? '+$' : '-$') + Math.abs(option.diff).toFixed(2)}</Typography>
                          </div> 
                        } />
                      </div>
                    })
                  }
              </RadioGroup>
            </FormControl> 
           
          : null }
          <TextField
            placeholder="Leave special instruction about the dish. (Ex. Allergies, spicy level, etc..)"
            multiline
            variant="outlined"
            rows={2}
            rowsMax={64}
            fullWidth={true}
            onChange={(e) => setComment(e.target.value)}
          />

        </DialogContent>
        <DialogActions>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: '1px solid #000',
              borderRadius: '50px',
              margin: '0 10px'
            }}
          >
            <IconButton onClick={() => {
                if(count > 1){
                setCount(count - 1)
                }
            }}>
              <Remove />
            </IconButton>
            <Typography style={{margin: '0 5px'}}>{count}</Typography>
            <IconButton onClick={() => setCount(count + 1)}>
              <Add />
            </IconButton>
          </div>

          <Button onClick={handleAddToCart} color="secondary" variant="contained">
            Add to Cart ${(count * (dish.price + (selectedOption.diff ? selectedOption.diff : 0))).toFixed(2)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};


const mapStateToProps = state => {
  return {
    cart: state.cart
  }
}

const mapDispatchToProps = dispatch => {
    return {
        addToCart: item => dispatch(addToCart(item)),
        setTip: choice => dispatch(setTip(choice)),
        calculateTotal: () => dispatch(calculateTotal()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToCart);

