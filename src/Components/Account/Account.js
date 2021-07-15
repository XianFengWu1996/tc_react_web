import React, { useState } from "react";
import {
  makeStyles,
} from "@material-ui/core";
import { FiLock } from "react-icons/fi";
import { RiHandCoinLine } from "react-icons/ri";
import { AiOutlineCreditCard } from "react-icons/ai";
import ChangePassword from "./ChangePassword";
import DeleteCardDialog from "./DeleteCardDialog";
import { withRouter } from "react-router";

const useStyle = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridGap: "40px",
    margin: "2rem 4rem",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "1fr",
      justifyContent: "center",
      justifyItems: "center",
    },
  },
  container: {
    width: "250px",
    height: "200px",
    border: "3px solid black",
    borderRadius: "18%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
    textTransform: "uppercase",
    fontWeight: "bold",
    fontFamily: "sans-serif",
  },

  button: {
    padding: "1.2rem 2rem",
    border: "2px solid #000",
    borderRadius: "40px",
    marginBottom: "1rem",
  },
  deleteButton: {
    padding: "1rem 1.5rem",
    border: "2px solid #FF0000",
    width: "15rem",
    marginBottom: "1rem",
    marginTop: "1rem",
    alignSelf: "center",
  },
  saveButton: {
    marginBottom: "4rem",
    marginTop: "1rem",
    color: "white",
    backgroundColor: "#4BB543",
    "&:hover": {
      backgroundColor: "#03A84A",
    },
  },
  textSmall: {
    fontSize: "1rem",
  },
  marginBottom: {
    marginBottom: "0.7rem",
  },
}));

const Account = (props) => {
  const classes = useStyle();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);


  return (
    <div className={classes.root}>
      <div onClick={() => setPasswordOpen(true)} className={classes.container}>
        <FiLock size={35} />
        <div style={{ marginTop: "15px" }}>Change Password</div>
      </div>

      <div onClick={() => setCardOpen(true)} className={classes.container}>
        <AiOutlineCreditCard size={35} />
        <div style={{ marginTop: "15px" }}>Manage Card</div>
      </div>

      <div onClick={() => props.history.push('/reward')} className={classes.container}>
        <RiHandCoinLine size={35} />
        <div style={{ marginTop: "15px" }}>Rewards</div>
      </div>

      <ChangePassword open={passwordOpen} onClose={() => setPasswordOpen(false)} />

      <DeleteCardDialog open={cardOpen} onClose={() => setCardOpen(false)} />
    </div>
  );
};

export default withRouter(Account);
