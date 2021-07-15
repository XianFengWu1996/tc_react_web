import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  withStyles,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";

import React, { Component } from "react";
import MenuItem from "./MenuItem";
import randomstring from 'randomstring'


const style = (theme) => ({
  list: {
    flexGrow: 1,

    [theme.breakpoints.down("lg")]: {
      padding: '0 200px',
    },
    [theme.breakpoints.down("md")]: {
      padding: '0 100px',
    },
    [theme.breakpoints.down("sm")]: {
      padding: '0 60px',
    },
    [theme.breakpoints.down("xs")]: {
      padding: '0 5px',
    },
  },
  listItem: {
    [theme.breakpoints.down("lg")]: {
      columns: "2 auto",
      columnFill: "auto",
    },
    [theme.breakpoints.down("sm")]: {
      columns: "1 auto",
    },
  },
  categoryText: {
    fontSize: '1.7rem',

    [theme.breakpoints.down("lg")]: {
      fontSize: '1.5rem',
      fontWeight: 900,
    },
    [theme.breakpoints.down("md")]: {
      fontSize: '1.4rem',
      fontWeight: 500,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: '1.3rem',
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: '1.2rem',
    },
  },
});

class Category extends Component {
  constructor(props) {
    super(props)
    this.state = {};
  }

  handleClick = (e) => {
    this.setState({ [e]: !this.state[e] });
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        {this.props.dishes.map((items, index) => {
          return (
            <List className={classes.list} key={items.englishName}>
              <ListItem
                divider
                key={items.englishName}
                button
                onClick={this.handleClick.bind(this, items.englishName)}
              >
                <ListItemText primary={items.englishName + '  ' + items.chineseName} 
                classes={{primary:classes.categoryText}} />
                {this.state[items.englishName] ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </ListItem>

              <Collapse
                in={this.state[items.englishName]}
                timeout="auto"
                unmountOnExit
              >
                <List
                  component="ul"
                  disablePadding
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 2fr))",
                    gridGap: "10px",
                  }}
                >
                  {items.dishes.map((dish) => {
                    return (
                      <MenuItem dish={dish} key={randomstring.generate(18)} />
                    );
                  })}
                </List>
              </Collapse>
            </List>
          );
        })}
      </>
    );
  }
}

export default withStyles(style)(Category);
