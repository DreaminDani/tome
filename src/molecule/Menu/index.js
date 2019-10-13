import {
  Drawer,
  Divider,
  IconButton,
  List,
  ListItem,
  Link,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/LibraryBooks';
import InfoIcon from '@material-ui/icons/Info';
import React from 'react';
import MenuNotch from '../../atom/MenuNotch';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  menuHeader: {
    padding: 8,
  },
  menuIcon: {
    float: 'right',
  },
});

export default function Menu() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const menuList = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={() => setOpen(false)}
      onKeyDown={() => setOpen(false)}
    >
      <div className={classes.menuHeader}>
        <Typography variant="h4" component="span">
          Tome
        </Typography>
        <IconButton className={classes.menuIcon}>
          <CloseIcon />
        </IconButton>
      </div>
      <List>
        <Divider />
        <Link href="/">
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </Link>
        <Link href="/about">
          <ListItem button>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
        </Link>
        <Divider />
        <Link href="/logout">
          <ListItem button>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </Link>
      </List>
    </div>
  );

  return (
    <>
      <MenuNotch onClick={() => setOpen(true)} />
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        {menuList()}
      </Drawer>
    </>
  );
}
