import { makeStyles } from "@material-ui/core";
import React from 'react';
const useStyles = makeStyles(theme => ({
    text: {
        fontFamily: `'Cormorant Garamond', serif`,
        whiteSpace: 'pre',
        '&::selection': {
            background: theme.palette.primary.light,
            color: 'white',
        }
    }
}))

export default function TextContent(props) {
    const classes = useStyles();
    console.log(props.children);
    return (
        <p className={classes.text}>
            {props.children}
        </p>
    )
}