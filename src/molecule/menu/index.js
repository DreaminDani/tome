import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MailIcon from '@material-ui/icons/Mail';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Link from 'next/link';
import React from 'react';
import MenuNotch from '../../atom/menuNotch';

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
  }
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
        <Typography variant="h4" component="span">Tome</Typography>
        <IconButton className={classes.menuIcon}><CloseIcon /></IconButton>
      </div>
      <List>
        <Link href="/about">
          <ListItem button >
            <ListItemIcon><InboxIcon /></ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
        </Link>
        <Link href="/artifact">
          <ListItem button >
            <ListItemIcon><MailIcon /></ListItemIcon>
            <ListItemText primary="Artifact" />
          </ListItem>
        </Link>
        <Link href="/">
          <ListItem button >
            <ListItemIcon><InboxIcon /></ListItemIcon>
            <ListItemText primary="Index" />
          </ListItem>
        </Link>
      </List>
    </div>
  );

  return (
    <React.Fragment>
      <MenuNotch onClick={() => setOpen(true)} />
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        {menuList()}
      </Drawer>
    </React.Fragment>
  )

}