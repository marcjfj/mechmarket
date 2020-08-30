const express = require('express');
const router = express.Router();
const axios = require('axios');

if (!Array.prototype.flat)
{
    Object.defineProperty(Array.prototype, 'flat',
    {
        value: function(depth = 1, stack = [])
        {
            for (let item of this)
            {
                if (item instanceof Array && depth > 0)
                {
                    item.flat(depth - 1, stack);
                }
                else {
                    stack.push(item);
                }
            }

            return stack;
        }
    });
}

const getTags = (post) => {
  const tagRef = [
    {
      code: '[IC]',
      label: 'Interest Check'
    },
    {
      code: '[GB]',
      label: 'Group Buy'
    },
    {
      code: '[H]',
      label: 'For Sale'
    },
    {
      code: '[W]',
      label: 'Wanted'
    },
    {
      code: '[ARTISAN]',
      label: 'Artisans'
    },
    {
      code: '[VENDOR]',
      label: 'Vendor'
    },
  ]
  const title = post.data.title.toUpperCase();
  console.log(title);
  const tags = tagRef.filter(ref => title.includes(ref.code));
  console.log(tags);
  return tags;
}

const getImgurObs = (post) => {
  const regex = /href="(.*?)"/g;
    ids = [];
    while (matches = regex.exec(post.data.selftext_html)) {
      if (matches[1] && matches[1].includes('http')) {
        const url = new URL(matches[1]);
        const obj = {};
        if (matches[1].includes('/a/')) {
          obj.type = 'a';
        } else if ( matches[1].includes('/gallery/') ) {
          obj.type = 'g';
        } else {
          obj.type = 'i';
        }
        // console.log(url.hostname);
        if (url.hostname === 'imgur.com' || url.hostname === 'i.imgur.com') {
          ids.push({...obj, id: url.pathname.split('/').pop().split('.').reverse().pop()});
        }
      }
    };
    // console.log(ids);
    return ids;
}

const getImages = async (id) => {
  let arr;
  try {
    if (id.type === 'a') {
      // console.log(`https://api.imgur.com/3/album/${id.id}/images`);
      arr = await axios.get(`https://api.imgur.com/3/album/${id.id}/images`, {
        headers: {
          'Authorization': 'Client-ID 31a193c77c98133'
        }
      });
    } else if (id.type === 'g') {
      // console.log(`https://api.imgur.com/3/gallery/album/${id.id}`);
      arr = await axios.get(`https://api.imgur.com/3/gallery/album/${id.id}/images`, {
        headers: {
          'Authorization': 'Client-ID 31a193c77c98133'
        }
      });
      
    } else {
      // console.log(`https://api.imgur.com/3/image/${id.id}`);
      arr = await axios.get(`https://api.imgur.com/3/image/${id.id}`, {
        headers: {
          'Authorization': 'Client-ID 31a193c77c98133'
        }
      });
      
      // console.log(Array.isArray(arr.data));
    }
  } catch (err) {
    // console.log(err.message);
    return [];
  }

  return arr.data;
};

/* GET home page. */
router.get('/posts', async (req, res, next) => {
  const request = await axios.get('https://www.reddit.com/r/mechmarket.json').catch(err => console.log(err.message));;
  const posts = request.data.data.children;

  const modPosts = await Promise.all(posts.map( async (post) => {
    post.imgur_ids = await getImgurObs(post);
    post.imgur_images = await Promise.all(post.imgur_ids.map(async (id) => {
      const images = await getImages(id);
      return images.data;
    }));
    post.tags = getTags(post);
    post.imgur_images = post.imgur_images.flat();

    return post;

  }))
  res.json(modPosts);
});

router.post('/comments', (req, res) => {
  
  const postData = req.body;
  const endPoint = `https://reddit.com${postData.post.data.permalink}.json`;
  console.log(`https://reddit.com${postData.post.data.permalink}.json`)
  axios.get(endPoint).then(response => res.json(response.data)).catch(err => console.log(err.message));
  
});

module.exports = router;
