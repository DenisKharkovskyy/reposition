import * as Yup from 'yup';

export default Yup.object().shape({
  currentPassword: Yup.string().required('Current password required'),
  newPassword: Yup.string()
    .min(8, 'Password should be more than 8 characters!')
    .required('New password required'),
  confirmPassword: Yup.string()
    .required('COnfirm password required')
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match'),
});
