import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  Button,
  Typography,
  InputLabel,
  FormControl,
  Select,
  makeStyles,
} from "@material-ui/core";
import moment from 'moment';
import Axios, {} from 'axios'
import { store } from "../../store";
import LoadingOverlay from 'react-loading-overlay'
import { getReportUrl } from "../../Misc/url";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const Admin = (props) => {
  const classes = useStyles();
  let date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const [state, setState] = React.useState({
    month: month,
    year: year,
    orders: [],
    summary: {},
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const handleGetReport = async () => {
   try {
    setLoading(true);
    const { auth } = store.getState();
    let result = await Axios.post(getReportUrl, {
      month: state.month, year: state.year 
    }, { headers: { "Authorization": auth.requestKey }})
    setState({
      ...state,
      orders: result.data.orders,
      summary: {
        ...result.data.summary
      }
    })
   } catch (error) {
     setError(error.message ? error.message : 'Unable to get report...')
   }
   setLoading(false);
  }

  return (
    <LoadingOverlay active={loading} spinner text='Retrieving report...'>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="month-native-simple">Month</InputLabel>
        <Select
          native
          value={state.month}
          onChange={handleChange}
          inputProps={{
            name: 'month',
            id: 'month-native-simple',
          }}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
          <option value={10}>10</option>
          <option value={11}>11</option>
          <option value={12}>12</option>
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="year-native-simple">Year</InputLabel>
        <Select
          native
          value={state.year}
          onChange={handleChange}
          inputProps={{
            name: 'year',
            id: 'year-native-simple',
          }}
        >
          <option value={2020}>2020</option>
          <option value={2021}>2021</option>
          <option value={2022}>2022</option>
          <option value={2023}>2023</option>
          <option value={2024}>2024</option>       
          <option value={2024}>2025</option>
          <option value={2024}>2026</option>
          <option value={2024}>2027</option>
          <option value={2024}>2028</option>

        </Select>
      </FormControl>
      <Button onClick={handleGetReport}>Get Report</Button>
      {error ? <Typography color='error'>{error}</Typography> : null}
      <TableContainer component={Paper}>
        <Table aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="left">Order #</TableCell>
              <TableCell align="left">Customer Name</TableCell>
              <TableCell align="left">Subtotal</TableCell>
              <TableCell align="left">Discount</TableCell>
              <TableCell align="left">Tax</TableCell>
              <TableCell align="left">Delivery</TableCell>
              <TableCell align="left">Tip</TableCell>
              <TableCell align="left">Refund</TableCell>
              <TableCell align="left">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.orders ? state.orders.map((item) => (
              <TableRow key={item.order.orderId}>
                <TableCell component="th" scope="row">
                  {moment(item.order.createdAt).format("MMM D, YYYY")}
                </TableCell>
                <TableCell align="left">{item.order.orderId}</TableCell>
                <TableCell align="left">{item.contact.name}</TableCell>
                <TableCell align="left">{'$' + (item.order.subtotal - item.order.lunchDiscount).toFixed(2)}</TableCell>
                <TableCell align="left">{'$' + (item.order.discount).toFixed(2)}</TableCell>
                <TableCell align="left">{'$' + (item.order.tax).toFixed(2)}</TableCell>
                <TableCell align="left">{'$' + (item.order.isDelivery ? item.order.delivery : 0).toFixed(2)}</TableCell>
                <TableCell align="left">{'$' + (item.order.tip).toFixed(2)}</TableCell>
                <TableCell align="left">{'$' + (item.orderStatus.refundAmount).toFixed(2)}</TableCell>
                <TableCell align="left">{'$' + (item.order.total).toFixed(2)}</TableCell>
              </TableRow>
            )) : null }
          </TableBody>
        </Table>
      </TableContainer>

      { Object.keys(state.summary).length === 0 && state.summary.constructor === Object ? null : <Paper>
        <Typography variant='h4'>Monthly Summary</Typography>
        <Typography variant='h6'>Subtotal: ${state.summary.subtotal.toFixed(2)}</Typography>
        <Typography variant='h6'>Discount: (${(state.summary.discount / 100).toFixed(2)})</Typography>
        <Typography variant='h6'>Tax: ${state.summary.tax.toFixed(2)}</Typography>
        <Typography variant='h6'>Tip: ${state.summary.tip.toFixed(2)}</Typography>
        <Typography variant='h6'>Delivery: ${state.summary.delivery.toFixed(2)}</Typography>
        <Typography variant='h6'>Refund: (${(state.summary.refund).toFixed(2)})</Typography>
        <Typography variant='h6'>Total: ${state.summary.total.toFixed(2)}</Typography>
      </Paper>}
    </LoadingOverlay>
  );
};


export default Admin;
