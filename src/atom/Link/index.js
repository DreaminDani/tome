/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/anchor-has-content */

// copy/pasted from: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/src/Link.js
import MuiLink from '@material-ui/core/Link';
import clsx from 'clsx';
import NextLink from 'next/link';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';

const NextComposed = React.forwardRef(function NextComposed(props, ref) {
  const { as, href, prefetch, ...other } = props;

  return (
    <NextLink href={href} prefetch={prefetch} as={as}>
      <a ref={ref} {...other} />
    </NextLink>
  );
});

NextComposed.propTypes = {
  as: PropTypes.string,
  href: PropTypes.string,
  prefetch: PropTypes.bool,
};

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/#with-link
function Link(props) {
  const {
    activeClassName,
    router,
    className: classNameProps,
    innerRef,
    naked,
    href,
    ...other
  } = props;

  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === href && activeClassName,
  });

  if (naked) {
    return <NextComposed className={className} ref={innerRef} {...other} />;
  }

  return (
    <MuiLink
      component={NextComposed}
      className={className}
      ref={innerRef}
      {...other}
    />
  );
}

Link.propTypes = {
  activeClassName: PropTypes.string,
  as: PropTypes.string,
  className: PropTypes.string,
  href: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  naked: PropTypes.bool,
  onClick: PropTypes.func,
  prefetch: PropTypes.bool,
  router: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

Link.defaultProps = {
  activeClassName: 'active',
};

const RouterLink = withRouter(Link);

export default React.forwardRef((props, ref) => (
  <RouterLink {...props} innerRef={ref} />
));
