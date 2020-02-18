import React from 'react';

import Typography from '@material-ui/core/Typography';

export default function({ children, smallFont, ...props }) {
  return (
    <Typography style={{ color: '#fff', fontSize: smallFont ? 12 : 16 }} {...props}>{children}</Typography>
  );
}
