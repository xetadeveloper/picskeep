// Modules
import React from 'react';
import { useHistory } from 'react-router-dom';

// Styles
import style from './notFound.module.css';

// Components
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  const history = useHistory();

  return (
    <section
      className={`flex flex-col justify-center align-center ${style.container} ${style.notFound}`}>
      <div>
        <h2>This Page Cannot Be Found</h2>
        <p>It likely doesn't exist</p>
      </div>
      <div
        className={`${style.backBtn}`}
        onClick={() => {
          history.goBack();
        }}>
        <h4>Go Back</h4>
        <FiArrowLeft />
      </div>
    </section>
  );
}
