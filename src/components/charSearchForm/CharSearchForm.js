import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Error from  '../error/Error'

import './charSearchForm.scss';

const CharSearchForm = () => {
    const [char, setChar] = useState(null);
    const {loading, error, getCharacterByName, clearError} = useMarvelService();

    const onCharLoaded = (char) => {
        setChar(char);
    };

    const updateChar = (name) => {
        clearError();

        getCharacterByName(name)
            .then(onCharLoaded);
    };

    const errorMessage = error ? <div className="char__search-critical-error"><Error /></div> : null;
    const results = !char ? null : char.length > 0 ?
                <div className="char__search-wrapper">
                    <div className="char__search-success">There is! Visit {char.name} page?</div>
                    <Link to={`/characters/${char[0].id}`} className="button button__secondary" >
                        <div className="inner">To page</div>
                    </Link>
                </div> :
                <div className="char__search-error">
                    The character was not found. Check the name and try again
                </div>;           

    return (
        <div className="char__search-form">
            <Formik
                initialValues={{
                    charName: ''
                }}
                validationSchema={Yup.object({
                    charName: Yup.string().required('This field is required')
                })}
                onSubmit={({ charName }) => {
                    updateChar(charName);
                }}
            >
                <Form>
                    <label htmlFor="charName" className='char__search-label'>
                        Or find a character by name:
                    </label>
                    <div className="char__search-wrapper">
                        <Field
                            id="charName"
                            type="text"
                            placeholder='Enter name'
                            className='char__search-input'
                            name="charName"/>

                        <button 
                            type='submit' 
                            className="button button__main"
                            disabled={loading}>
                            <div className="inner">find</div>
                        </button>
                    </div>
                    <FormikErrorMessage component="div" className='char__search-error' name="charName" />
                </Form>
            </Formik>
            {results}
            {errorMessage}
        </div>
    )
};

export default CharSearchForm;
