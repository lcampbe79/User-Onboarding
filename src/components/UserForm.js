import React, { useState, useEffect } from 'react';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const UserForm =({errors, touched, values, status}) => {
  
  const [users, setUsers] = useState([]);
  console.log(users);

  useEffect(() => {
    if (status) {
      setUsers([...users, status]);
    }
  }, [status, users]);

  return(
    <div className="user-form">
      <Form>
        <Field 
          component='input'
          type='text'
          name='name'
          placeholder='Name'
        />
        {touched.name && errors.name && (
          <p className='error'>{errors.name}</p>
        )}
        <Field 
          component='input'
          type='text'
          name='email'
          placeholder='Email'
        />
        {touched.email && errors.email && (
          <p className='error'>{errors.email}</p>
        )}
        <Field 
          component='input'
          type='password'
          name='password'
          placeholder='Password'
        />
        {touched.password && errors.password && (
          <p className='error'>{errors.password}</p>
        )}
        <button>Submit!</button>
        <label className="checkbox-container">
          Terms of Service
          <Field
            type="checkbox"
            name="terms"
            checked={values.terms}
          />
          {touched.terms && errors.terms && (
            <p className='error'>{errors.terms}</p>
          )}
          <span className="checkmark" />
        </label>
      </Form>
    </div>
  );
};

const formikHOC = withFormik({
  mapPropsToValues({ name, email, password , terms}) {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      terms: terms || false
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required('Name is a required field.'),
    email: Yup.string().required('Email is a required field.'),
    password: Yup.string().required('Password is a required field.'),
    terms: Yup.bool().oneOf([true], 'Field must be checked')
  }),
  handleSubmit(values, {setStatus, resetForm}) {
    axios
      .post('https://reqres.in/api/users', values)
      .then(res => {
        console.log('handleSubmit: then: res: ', res);
        setStatus(res.data);
        resetForm();
      })
      .catch(err => console.error('handleSubmit: catch: err: ', err));
    }
});

const FormWithFormik = formikHOC(UserForm);

export default FormWithFormik;
// export default withFormik()(UserForm);