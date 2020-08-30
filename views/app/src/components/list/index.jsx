import React, {useEffect, useState, useContext} from 'react';
import Axios from 'axios';
import ImageSlider from '../ImageSlider';
import CommentContext from '../../contexts/CommentContext';

const unescapeHtml = (unsafe) => {
  return unsafe
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, "\"")
      .replace(/&#039;/g, "'");
}
// const formatDate = (timeStamp) => {
//   const date = new Date(timeStamp);
//   return date.
// }
const ListPosts = ({list}) => {
  const commentData = useContext(CommentContext);
  return (
  <div className="list-container">
    {
      list.map(post => (
        <div className="post-wrapper" key={post.data.id}>
          
          <div className="post">
            <div className="post-header">
              {post.tags.length ? (
                <div className="post-tags">
                  {
                    post.tags.map(tag => (
                      <button className="post-tag" key={tag.code}>
                        <span>{tag.label}</span>
                      </button>
                    ))
                  }
                </div>
              ) : null}
              <div className="score-date">
                <div className="post-date">
                  {/* <span>{(new Date(post.data.created))}</span> */}
                </div>
                <div className="post-score">
                  <span>{post.data.score}</span>
                </div>
              </div>
              <button className="get-comments" onClick={() => {commentData.getData(post)}}>
                Comments
              </button>
            </div>
            <h4 className="post-title">{post.data.title}</h4>
            {!post.data.stickied ? (
              <>
                <ImageSlider post={post}/>
                <div className="post-content-wrapper">
                  <div className="post-content">
                    <p dangerouslySetInnerHTML={{__html: (post.data.selftext_html ? unescapeHtml(post.data.selftext_html) : null)}} ></p>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
        )
      )
    }
  </div>

  )
}

const List = () => {
  const [list, setList] = useState([]);
  
  useEffect(() => {
    Axios.get('/posts')
    .then(res => {
      console.log(res.data);
      setList([...res.data]);
    })
  }, []);

  return (
    <div className="list-page">
      {/* <h3>List</h3> */}
      {list.length ? (
        <ListPosts list={list}/>
      ) : null}
    </div>
  )
}

export default List;

