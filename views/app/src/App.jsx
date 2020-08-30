import React, {useContext, useState} from 'react';
import './App.scss';
import List from './components/list/';
import CommentBox from './components/CommentBox'
import CommentContext from './contexts/CommentContext';
import Axios from 'axios';
function App() {
  const [commentData, setCommentData] = useState({
    data: null,
    getData: (post) => {
      Axios.post('/comments/', {post}).then( res => setCommentData({...commentData, data: res.data}))
    }
  });
  return (
    <div className="App">
      <div className="header">
        <div className="header-inner">
          <p className="header-logo">Metamech.io</p>
        </div>
      </div>
      <main>
        <CommentContext.Provider value={commentData}>
          <CommentBox />
          <List />
        </CommentContext.Provider>
      </main>
    </div>
  );
}

export default App;
