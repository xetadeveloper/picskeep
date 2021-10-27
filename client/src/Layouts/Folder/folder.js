// Modules
import React from 'react';

// Redux
import { connect } from 'react-redux';

// Styles
import style from './folder.module.css';

// Components
import Gallery from '../../Components/Gallery/gallery';
import { dummyFolders } from '../../DummyData/dummy';
import { useLocation, useParams } from 'react-router';
import { convertCamelCase } from '../../Utils/utils';

function Folder({ folders }) {
  // console.log('Folders: ', dummyFolders);

  const folderID = new URLSearchParams(useLocation().search).get('folderID');

  //   const folder = folders && folders.find(folder => folder.fileID === folderID);
  const folder =
    dummyFolders && dummyFolders.find(folder => folder.fileID === folderID);

  const { pictures } = folder || {};

  // console.log('FOlder found: ', folder);
  return (
    <section className={`${style.container}`}>
      <section className={`${style.folderHeader}`}>
        <h3 className={`bold-text`}>
          {folder ? convertCamelCase(folder.name) : ''} Pictures
        </h3>
      </section>
      <div className={`${style.divider}`}>
        <div className={`divider`}></div>
      </div>
      <Gallery pictures={pictures} />
    </section>
  );
}

function mapStateToProps(state) {
  const { folders } = state.app;

  return { folders };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Folder);
