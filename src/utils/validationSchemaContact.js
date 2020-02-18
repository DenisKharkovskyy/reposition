import * as Yup from 'yup';

export default Yup.object().shape({
  email: Yup.string()
    .email('email incorrect')
    .required('email required'),
  fullName: Yup.string().required('Required Full Name'),
});
