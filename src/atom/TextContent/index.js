import { makeStyles } from "@material-ui/core";
import PropTypes from 'prop-types';
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

function TextContent(props) {
    const classes = useStyles();
    return (
        <p className={classes.text}>
            {props.children}
        </p>
    )
}

TextContent.propTypes = {
    children: PropTypes.string,
};

export default TextContent;