import { Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, TextField } from '@material-ui/core';
import firebase from 'firebase';
import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { checkPassword } from '../../Helper/CheckPassword';
import LoadingSpinner from '../../Helper/Loading';
import ScreenSize from '../../Helper/ScreenSize';
import Requirement from './Requirement';

const useStyle = makeStyles((theme) => ({
    saveButton: {
      color: "white",
      backgroundColor: "#4BB543",
      "&:hover": {
        backgroundColor: "#03A84A",
      },
    },
    textField: {
        marginBottom: '0.7rem'
    }
  }));

const ChangePassword = (props) => {
    const classes = useStyle();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { extraSmallScreen } = ScreenSize();
    const [state, setState] = useState({
        message: '',
        color: '',
        status: ''
    })
    const [status, setStatus] = useState({
        checked: false,
        uppercase: false,
        lowercase: false,
        numeric: false,
        symbol: false,
        qualifyPassword: false,
        qualifyLength: false,
    })

    const handleChangePassword = () => {
        if(status.qualifyPassword && newPassword === confirmPassword){
            if(firebase.auth().currentUser !== null){
                // start loading 
                setLoading(true)

                // update password 
                firebase.auth().currentUser.updatePassword(confirmPassword).then(() => {
                    setState({
                        message: 'Success',
                        color: '#0dc10d',
                        status: 'success'
                    })
                }).catch((error) => {
                    setState({
                        message: error.message ? error.message : 'Failed to change password',
                        color: 'red',
                        status: 'fail'
                    })
                })
                // end loading
                setLoading(false)
            } else {
                setState({
                    message: 'Require recent login to change password, please login again',
                    color: 'red',
                    status: 'fail'
                })
            }            
        }
    }

    const handleIcon = (status) => {
        if(status === 'success'){
            return <FaCheckCircle style={{ marginRight: '10px'}}/>
        } else if (status === 'fail'){
            return <FaTimesCircle style={{ marginRight: '10px'}}/>
        }
    }

    return (
        <Dialog open={props.open} onClose={props.onClose} fullScreen={extraSmallScreen}>
        <DialogTitle>
          Change Password
        </DialogTitle>
        <DialogContent>
        {
            state.message !== '' ? <div style={{ 
                padding: '10px 30px',
                margin: '10px',
                minWidth: '20%',
                background: state.color,
                color:'white',
                fontFamily: 'sans-serif',
                display: 'flex',
                alignItems: 'center',
            }}>
                {handleIcon(state.status)} {state.message}
            </div> : null
        }
        <TextField
            label="New Password"
            variant="outlined"
            name="new"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            fullWidth
            className={classes.textField}
          />

        <TextField
            label="Confirm New Password"
            variant="outlined"
            name="confirmNew"
            type="password"
            value={confirmPassword}
            onChange={(e) => { 
                setConfirmPassword(e.target.value)
                let result = checkPassword(e.target.value);
                setStatus({...result});
            }}
            required
            fullWidth
            className={classes.textField}
            error={status.qualifyPassword && (newPassword !== confirmPassword)}
            helperText={
                status.qualifyPassword && (newPassword !== confirmPassword)
                ? "Password does not match"
                : null
            }
          />
          <Requirement status={status} />
        </DialogContent>
        <DialogActions>
            <Button
              variant="contained"
              className={classes.saveButton}
              onClick={handleChangePassword}
            >{ loading ? <LoadingSpinner /> : 'Save'}</Button>
            <Button onClick={props.onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

    );
};

export default ChangePassword;