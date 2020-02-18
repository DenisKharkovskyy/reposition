import * as Yup from 'yup';

export default Yup.object().shape({
  chosenService: Yup.string().required('Required service'),
  chosenLoadingPort: Yup.string().required('Port of loading required'),
  selectedLoadingDate: Yup.string().required('Date of loading required'),
  chosenDischargePort: Yup.string().required('Port of discharge required'),
  availableTEU: Yup.string().required('Available TEU required'),
  emailContact: Yup.string()
    .email('email incorrect')
    .required('email required'),
  selectedOpenUntilDate: Yup.string().required('Expire Date required'),
});
